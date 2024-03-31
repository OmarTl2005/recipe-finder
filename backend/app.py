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
# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(128))
    recipes = db.relationship('Recipe', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.username}>'

    def make_password(self, password):
        """Hashes the user's password."""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Checks if the provided password matches the user's hashed password."""
        return check_password_hash(self.password, password)

# Recipe Model
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    cuisine = db.Column(db.String(128))
    rating = db.Column(db.Float)
    favorite = db.Column(db.Boolean)
    filename = db.Column(db.String(255), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    ingredients = db.relationship('Ingredient', backref='recipe', lazy='dynamic')
    comments = db.relationship('Comment', backref='recipe', lazy='dynamic')

    def __repr__(self):
        return f'<Recipe {self.title}>'

# Ingredient Model
class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ingredient = db.Column(db.Text)
    instructions = db.Column(db.Text)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'))

    def __repr__(self):
        return f'<Ingredient {self.id}>'

# Comment Model
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text)
    username = db.Column(db.Text)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'))

    def __repr__(self):
        return f'<Comment {self.id}>'

# Routes

@app.route('/register', methods=['POST'])
def register():
    """Registers a new user."""
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
    
    return jsonify({'message': 'User registered successfully'}), 200

@app.route('/login', methods=['POST', 'GET'])
def login():
    """Logs in a user."""
    if request.method == 'GET':
        if current_user.is_authenticated:
            return jsonify({'message': 'User already logged in!'}), 200
        else:
            return jsonify({'error': 'User not logged in!'}), 401
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify({'message': 'User already logged in!'}), 200
    
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
    """Logs out the current user."""
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'message': 'User logged out!'}), 200
    else:
        return jsonify({'error': 'User already logged out!'}), 401

@app.route('/')
def index():
    """Fetches all recipes."""
    try:
        recipes = Recipe.query.all()
        return jsonify([{'id': recipe.id,
                         'title': recipe.title,
                         'description': recipe.description,
                         'cuisine': recipe.cuisine,
                         'favorite': recipe.favorite,
                         'rating': recipe.rating,
                         'filename': f'{recipe.filename}'} for recipe in recipes]), 200
    except:
        return jsonify({'error': 'An error occurred while fetching recipes'}), 500


@app.route('/recipes')
@login_required
def recipes():
    """Fetches recipes created by the current user."""
    try:
        recipes = Recipe.query.filter_by(user_id=current_user.id).all()
        return jsonify([{'id': recipe.id,
                         'title': recipe.title,
                         'description': recipe.description,
                         'cuisine': recipe.cuisine,
                         'rating': recipe.rating,
                         'favorite': recipe.favorite,
                         'filename': f'{recipe.filename}'} for recipe in recipes]), 200
    except:
        return jsonify({'error': 'An error occurred while fetching recipes'}), 500

@app.route('/uploads/<filename>')
def serve_image(filename):
    """Serves uploaded images."""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        return send_file(filepath)
    except:
        return jsonify({'error': 'Image not found'}), 404
    
@app.route('/media/<filename>')
def get_media(filename):
    """Fetches media files."""
    try:
        filepath = os.path.join('media', filename)
        return send_file(filepath)
    except:
        return jsonify({'error': 'Media file not found'}), 404

@app.route('/make-recipe', methods=['POST'])
@login_required
def make_recipe():
    """Creates a new recipe."""
    if request.method == 'POST':
        uploaded_file = request.files.get('file')
        try:
            if uploaded_file:
                # Handle uploaded file
                filename = secure_filename(uploaded_file.filename)
                # Check for existing filenames and modify if needed
                base, extension = os.path.splitext(filename)
                i = 1
                temp_filename = f"{base}_{i}{extension}"
                while Recipe.query.filter_by(filename=temp_filename).first():
                    i += 1
                    temp_filename = f"{base}({i}){extension}"
                i = 1
                filename = temp_filename

                uploads_dir = os.path.join(app.config['UPLOAD_FOLDER'], '')
                os.makedirs(uploads_dir, exist_ok=True)

                filepath = os.path.join(uploads_dir, filename)
                uploaded_file.save(filepath)

                # Get recipe details
                title = request.form.get('title')
                description = request.form.get('description')
                cuisine = request.form.get('cuisine')

                # Create new recipe instance
                new_recipe = Recipe(title=title, description=description, cuisine=cuisine, filename=filename, user_id=current_user.id)

                db.session.add(new_recipe)
                db.session.commit()

                # Retrieve and add ingredients to the recipe
                ingredients = request.form.getlist('ingredient')
                instructions = request.form.getlist('instruction')

                for ingredient, instruction in zip(ingredients, instructions):
                    new_ingredient = Ingredient(ingredient=ingredient, instructions=instruction, recipe_id=new_recipe.id)
                    db.session.add(new_ingredient)

                db.session.commit()

                return jsonify({'message': 'Recipe created successfully!'}), 200
            else:
                return jsonify({'error': 'No file uploaded!'}), 400
        except:
            return jsonify({'error': 'An error occurred while creating the recipe.'}), 500

# Delete Recipe Route
@app.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@login_required
def delete_recipe(recipe_id):
    """Deletes a recipe based on its ID."""
    try:
        recipe = Recipe.query.get(recipe_id)
        ingredients = Ingredient.query.filter_by(recipe_id=recipe_id).all()
        if not recipe:
            return jsonify({'error': 'Recipe not found'}), 404

        if recipe.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized to delete this recipe'}), 403

        # Delete the uploaded file from the file system if it exists
        if recipe.filename:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], recipe.filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db.session.delete(recipe)
        db.session.delete(ingredients)
        db.session.commit()

        return jsonify({'message': 'Recipe deleted successfully'}), 200  
    except:
        return jsonify({'error': 'An error occurred while deleting the recipe'}), 500 

# Favorite Recipe Route
@app.route('/favorite/<int:recipe_id>', methods=['PUT'])
@login_required
def favorite(recipe_id):
    """Adds or removes a recipe from favorites."""
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'error': 'Recipe not found'}), 404

        is_favorite = request.json.get('is_favorite')
        if is_favorite is None:
            return jsonify({'error': 'is_favorite field is required'}), 400

        if is_favorite == 'true':
            recipe.favorite = True
            message = 'Recipe added to favorites successfully'
        if is_favorite == 'false':
            recipe.favorite = False
            message = 'Recipe removed from favorites successfully'

        db.session.commit()

        return jsonify({'message': message}), 200
    except:
        return jsonify({'error': 'Something went wrong'}), 500

# Fetch Recipe Route
@app.route('/recipe/<int:id>')
def recipe(id):
    """Fetches a single recipe by ID."""
    try:
        recipes = Recipe.query.filter_by(id=id).all()
        return jsonify([{'id': recipe.id,
                         'title': recipe.title,
                         'description': recipe.description,
                         'rating': recipe.rating,
                         'cuisine': recipe.cuisine,
                         'filename': f'{recipe.filename}'} for recipe in recipes]), 200
    except:
        return jsonify({'error': 'An error occurred while fetching recipes'}), 500

# Rate Recipe Route
@app.route('/rating/<int:recipe_id>', methods=['POST'])
@login_required
def rate_recipe(recipe_id):
    """Submits a rating for a recipe."""
    try:
        data = request.json
        rating = data.get('rating')

        if not rating:
            return jsonify({'message': 'Missing rating data'}), 400

        recipe = Recipe.query.filter_by(id=recipe_id).first()
        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404

        recipe.rating = rating
        db.session.commit()

        return jsonify({'message': 'Rating submitted successfully'}), 200
    except:
        return jsonify({'message': 'Error submitting rating'}), 500


# Ingredients Route
@app.route('/ingredients/<int:recipe_id>')
def ingredients(recipe_id):
    """Fetches ingredients for a specific recipe."""
    try:
        my_ingredients = Ingredient.query.filter_by(recipe_id=recipe_id).all()
        ingredient_list = [{'id': ingredient.id, 'ingredient': ingredient.ingredient, 'instruction': ingredient.instructions} for ingredient in my_ingredients]
        return jsonify(ingredient_list), 200
    except:
        return jsonify({'error': 'An error occurred while fetching ingredients'}), 500

# Add Comment Route
@app.route('/add-comment/<int:recipe_id>', methods=['POST'])
@login_required
def add_comment(recipe_id):
    """Adds a comment to a recipe."""
    try:
        data = request.json
        comment = data.get('comment')
        user = User.query.filter_by(username=current_user.username).first()
        new_comment = Comments(comment=comment, recipe_id=recipe_id, username=user.username)
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({'message': 'Comment added successfully'}), 200
    except:
        return jsonify({'error': 'An error occurred while adding comment'}), 500

# Comments Route
@app.route('/comments/<int:recipe_id>')
def comments(recipe_id):
    """Fetches comments for a specific recipe."""
    try:
        my_comments = Comments.query.filter_by(recipe_id=recipe_id).all()
        comment_list = [{'id': comment.id, 'comment': comment.comment, 'username': comment.username} for comment in my_comments]
        return jsonify(comment_list), 200
    except:
        return jsonify({'error': 'An error occurred while fetching comments'}), 500

# Delete Comment Route
@app.route('/delete-comment/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    """Deletes a comment by its ID."""
    try:
        comment = Comments.query.get(comment_id)
        if not comment:
            return jsonify({'error': 'Comment not found'}), 404
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'message': 'Comment deleted successfully'}), 200
    except:
        return jsonify({'error': 'An error occurred while deleting comment'}), 500

# Get User Route
@app.route('/get-user')
@login_required
def get_user():
    """Fetches the current user's information."""
    return jsonify({'username': current_user.username}), 200

if __name__ == '__main__':
    app.run(debug=True)