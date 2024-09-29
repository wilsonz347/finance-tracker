from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import request
from bcrypt import gensalt, hashpw, checkpw
import random

#Create flask
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

#Setup database URI to use SQLite database, create database called users.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#Create tables if they don't exist
with app.app_context():
    db.create_all()


def generate_unique_id():
    while True:
        user_id = str(random.randint(10000, 99999))  # Generate a random 5-digit number
        if not User.query.filter_by(id=user_id).first():
            return user_id


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<ID: {self.id}, User: {self.username}, Email: {self.email}>'


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(30), nullable=False)
    writing = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Item: {self.mood}, Writing: {self.writing}>'


#Add a new user to the database
@app.route('/api/registration', methods=['POST'])
def registration():
    data = request.get_json()

    required_fields = ['username', 'password', 'email']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user_id = generate_unique_id()

    # Hash the password before storing it in the database
    hashed_password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')

    new_user = User(
        id = new_user_id,
        username=data['username'],
        password=hashed_password,
        email=data['email']
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully"}), 200


#Update a user in the database
@app.route('/api/update_user/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')

        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


#Delete a user from the database
@app.route('/api/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


#Retrieve user information from database
@app.route('/api/data/<user_id>', methods=['GET'])
def get_user(user_id):
    # Check if the user_id exists in our data
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "user_id": user.id,
            "email": user.email,
            "username": user.username,
            "mood": user.mood,
            "writing": user.writing
        })
    else:
        return jsonify({"error": "User not found"}), 404


#Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    return jsonify({"message": "Invalid credentials"}), 400


#Add mood and writing to the database in the 'data' endpoint.
@app.route('/api/data', methods=['POST'])
def add_item():
    data = request.get_json()
    mood = data.get('mood')
    writing = data.get('writing')

    if not writing:
        return jsonify({"error": "Writing is required"}), 400
    if not mood:
        return jsonify({"error": "Mood is required"}), 400

    new_item = Item(mood=mood, writing=writing)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Item added successfully"}), 200

@app.errorhandler(Exception)
def handle_exception(e):
    response = {
        "error": str(e),
        "message": "An internal error occurred."
    }
    return jsonify(response), 500

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)