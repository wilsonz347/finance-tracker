from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import request

#Create flask
app = Flask(__name__)
CORS(app)

#Setup database URI to use SQLite database, create database called users.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#Create tables if they don't exist
with app.app_context():
    db.create_all()

class User(db.Model):
    id = db.Column(db.String(3), primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    mood = db.Column(db.String(30), nullable=False)

    def __repr__(self):
        return f'<User: {self.username}, Mood: {self.mood}>'

#Add a new user to the database
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    if 'id' not in data or 'username' not in data or 'mood' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    if not data['id']:
        return jsonify({"error": "Invalid id"}), 400

    new_user = User(id=data['id'], username=data['username'], mood=data['mood'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully"}), 201

#Update a user in the database
@app.route('/update_user/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()
        user.username = data['username']
        user.mood = data['mood']
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

#Delete a user from the database
@app.route('/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

#Retrieve user information from database
@app.route('/get_users/<user_id>', methods=['GET'])
def get_user(user_id):
    # Check if the user_id exists in our data
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "user_id": user.id,
            "username": user.username,
            "mood": user.mood
        })
    else:
        return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)