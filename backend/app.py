from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_login import current_user, login_user, logout_user, login_required
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['UPLOAD_FOLDER'] = 'uploads'

CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# managin models
class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(128))
    recipes = db.relationship('Recipe', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.username}>'

    def make_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

# Define Recipe model
class Recipe(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    cuisine = db.Column(db.String(128))
    rating = db.Column(db.Float)
    favorite = db.Column(db.Boolean)
    content = db.Column(db.Text)
    filename = db.Column(db.String(255), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    ingredients = db.relationship('Ingredient', backref='recipe', lazy='dynamic')

    def __repr__(self):
        return f'<Recipe {self.title}>'

# Define Ingredient model
class Ingredient(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    ingredient = db.Column(db.Text)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'))

    def __repr__(self):
        return f'<Ingredient {self.id}>'

# managing routes

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 400
    
    user = User(username=username, email=email)
    user.make_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registrated successfully'}), 200

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        if current_user.is_authenticated:
            return jsonify({'message': 'User already loged in!'}), 200
        else:
            return jsonify({'error': 'User not loged in!'}), 401
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify({'message': 'User already loged in!'}), 200
    
        data = request.json
        email = data.get('email')
        password = data.get('password')
    
        user = User.query.filter_by(email=email).first()
    
        if user is None or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password!'}), 401
    
        login_user(user)
    
        return jsonify({'message': 'Login successful!'}), 200

@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'message': 'User loged out!'}), 200
    else:
        return jsonify({'error': 'User already loged out!'}), 401

@app.route('/')
def index():
    try:
        recipes = Recipe.query.all()
        return jsonify([{'id': recipe.id,
                         'title': recipe.title,
                         'description': recipe.description,
                         'cuisine': recipe.cuisine,
                         'favorite': recipe.favorite,
                         'filename': f'{recipe.filename}'} for recipe in recipes]), 200
    except:
        return jsonify({'error': 'An error occurred while fetching recipes'}), 500


@app.route('/recipes')
@login_required
def recipes():
    try:
        recipes = Recipe.query.filter_by(user_id=current_user.id).all()
        return jsonify([{'id': recipe.id,
                         'title': recipe.title,
                         'description': recipe.description,
                         'cuisine': recipe.cuisine,
                         'favorite': recipe.favorite,
                         'filename': f'{recipe.filename}'} for recipe in recipes]), 200
    except:
        return jsonify({'error': 'An error occurred while fetching recipes'}), 500

@app.route('/uploads/<filename>')
def serve_image(filename):
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        return send_file(filepath)
    except:
        return jsonify({'error': 'Image not found'}), 404
    
@app.route('/media/<filename>')
def get_media(filename):
    try:
        filepath = os.path.join('media', filename)
        return send_file(filepath)
    except:
        return jsonify({'error': 'Image not found'}), 404

import os
import random
from flask import request, jsonify
from werkzeug.utils import secure_filename

# ... (rest of your Flask app imports)

@app.route('/make-recipe', methods=['POST'])
@login_required
def make_recipe():
    if request.method == 'POST':
        # Access uploaded file
        uploaded_file = request.files.get('file')
        try:
            if uploaded_file:
                # Secure filename
                filename = secure_filename(uploaded_file.filename)

                # Check for existing filenames and modify if needed
                base, extension = os.path.splitext(filename)  # Separate base and extension
                i = 1
                temp_filename = f"{base}_{i}{extension}"  # Initial modified filename
                while Recipe.query.filter_by(filename=temp_filename).first():
                    i += 1
                    temp_filename = f"{base}({i}){extension}"
                i = 1
                filename = temp_filename  # Assign the unique filename

                # Create uploads folder if it doesn't exist
                uploads_dir = os.path.join(app.config['UPLOAD_FOLDER'], '')  # Add trailing slash
                os.makedirs(uploads_dir, exist_ok=True)  # Create folder if needed

                # Save the file
                filepath = os.path.join(uploads_dir, filename)
                uploaded_file.save(filepath)

                # Create new recipe with filename (and other data)
                title = request.form.get('title')
                description = request.form.get('description')
                cuisine = request.form.get('cuisine')
                content = request.form.get('content')
                # ... (rest of your recipe creation logic)
                new_recipe = Recipe(title=title, description=description, cuisine=cuisine, content=content, filename=filename, user_id=current_user.id)
                # ... (save new_recipe to database)
                db.session.add(new_recipe)
                db.session.commit()
                return jsonify({'message': 'Recipe created successfully!', 'recipeId': new_recipe.id}), 200
            else:
                return jsonify({'error': 'No file uploaded!'}), 400  # Bad request
        except:
            return jsonify({'error': 'An error occurred while creating the recipe.'}), 500



@app.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@login_required
def delete_recipe(recipe_id):
  """Deletes a recipe based on its ID."""
  try:
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
      return jsonify({'error': 'Recipe not found'}), 404

    if recipe.user_id != current_user.id:
      return jsonify({'error': 'Unauthorized to delete this recipe'}), 403

    db.session.delete(recipe)
    # ... (Optional: Delete the uploaded file if needed)

    db.session.commit()
    return jsonify({'message': 'Recipe deleted successfully'}), 200  
  except:
    return jsonify({'error': 'An error occurred while deleting the recipe'}), 500 

    

  return jsonify({'error': 'Method not allowed'}), 405 

@app.route('/favorite/<int:recipe_id>', methods=['PUT'])
@login_required
def favorite(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'error': 'Recipe not found'}), 404

        is_favorite = request.json.get('is_favorite')
        if is_favorite is None:
            return jsonify({'error': 'is_favorite field is required'}), 400

        # Handle both true and false cases
        if is_favorite == 'true':
            recipe.favorite = True
            message = 'Recipe added to favorites successfully'
        if is_favorite == 'false':
            recipe.favorite = False
            message = 'Recipe removed from favorites successfully'

        db.session.commit()

        return jsonify({'message': message}), 200
    except:
        return jsonify({'error': 'something went wrong'}), 500

@app.route('/recipe/<int:id>')
def recipe(id):
    try:
        recipes = Recipe.query.filter_by(id=id).all()
        return jsonify([{'id': recipe.id,
                         'title': recipe.title,
                         'description': recipe.description,
                         'content': recipe.content,
                         'rating': recipe.rating,
                         'cuisine': recipe.cuisine,
                         'filename': f'{recipe.filename}'} for recipe in recipes]), 200
    except:
        return jsonify({'error': 'An error occurred while fetching recipes'}), 500

@app.route('/rating/<int:recipe_id>', methods=['POST'])
@login_required
def rate_recipe(recipe_id):
  try:
    # Get request data
    data = request.json
    rating = data.get('rating')

    if not rating:
      return jsonify({'message': 'Missing rating data'}), 400

    # Find the recipe by ID
    recipe = Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
      return jsonify({'message': 'Recipe not found'}), 404

    # Create a new Rating record
    recipe.rating = rating
    db.session.commit()

    return jsonify({'message': 'Rating submitted successfully'}), 200
  except:
    return jsonify({'message': 'Error submitting rating'}), 500


@app.route('/add-ingredient', methods=['POST'])
@login_required
def add_ingredient():
    try:
        data = request.json
        ingredient = data.get('ingredient')
        recipe_id = data.get('recipeId')
        new_ingredient = Ingredient(ingredient=ingredient, recipe_id=recipe_id)
        db.session.add(new_ingredient)
        db.session.commit()
        return jsonify({'message': 'Ingredient added successfully'}), 200
    except:
        return jsonify({'error': 'An error occurred while adding the ingredient'}), 500

@app.route('/ingredients/<int:recipe_id>')
def ingredients(recipe_id):
    try:
        my_ingredients = Ingredient.query.filter_by(recipe_id=recipe_id).all()
        ingredient_list = [{'id': ingredient.id, 'ingredient': ingredient.ingredient} for ingredient in my_ingredients]
        return jsonify(ingredient_list), 200
    except:
        return jsonify({'error': 'An error occurred while fetching ingredients'}), 500

if __name__ == '__main__':
    app.run(debug=True)