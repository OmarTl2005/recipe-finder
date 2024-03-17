from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_login import current_user, login_user, logout_user, login_required
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

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

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    filename = db.Column(db.String(255), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f'<Recipe {self.title}>'

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

@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({'message': 'User already loged in'}), 200
    
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    login_user(user)

    return jsonify({'message': 'Login successful'}), 200

@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'message': 'User loged out'}), 200
    else:
        return jsonify({'error': 'User already loged out'}), 401

@app.route('/recipes')
def recipes():
    recipes = Recipe.query.all()
    return jsonify([recipe.title for recipe in recipes])


@app.route('/make-recipe', methods=['POST'])
def make_recipe():
  if request.method == 'POST':
    # Access uploaded file
    uploaded_file = request.files.get('file')
    if uploaded_file:
      # Secure filename
      filename = secure_filename(uploaded_file.filename)
      # Create uploads folder if it doesn't exist
      uploads_dir = os.path.join(app.config['UPLOAD_FOLDER'], '')  # Add trailing slash
      os.makedirs(uploads_dir, exist_ok=True)  # Create folder if needed
      # Save the file
      filepath = os.path.join(uploads_dir, filename)
      uploaded_file.save(filepath)

      # Create new recipe with filename (and other data)
      title = request.form.get('title')
      description = request.form.get('description')
      # ... (rest of your recipe creation logic)
      new_recipe = Recipe(title=title, description=description, filename=filename, user_id=current_user)
      # ... (save new_recipe to database)
      db.session.add(new_recipe)
      db.session.commit()
      return {'message': 'Recipe created successfully!'}
    else:
      return {'error': 'No file uploaded!'}, 400  # Bad request

  return {'error': 'Method not allowed'}, 405  # Method not allowed

if __name__ == '__main__':
    app.run(debug=True)