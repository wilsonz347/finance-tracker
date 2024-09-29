from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import request
from bcrypt import gensalt, hashpw, checkpw
import random
import os

# Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Check if the 'users.db' file exists
if not os.path.exists('users.db'):
    # Setup database URI to use SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize the SQLAlchemy instance
    db = SQLAlchemy(app)

    # Define the User model
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(30), unique=True, nullable=False)
        password = db.Column(db.String(128), nullable=False)
        email = db.Column(db.String(128), nullable=False)

        def __repr__(self):
            return f'<ID: {self.id}, User: {self.username}, Email: {self.email}>'

    # Define the Item model
    class Item(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        #user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        mood = db.Column(db.String(30), nullable=False)
        writing = db.Column(db.Text, nullable=False)

        def __repr__(self):
            return f'<Item: {self.mood}, Writing: {self.writing}>'

    # Create the database and tables
    with app.app_context():
        db.create_all()

else:
    # Initialize the SQLAlchemy instance if the database already exists
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db = SQLAlchemy(app)


def generate_unique_id():
    while True:
        user_id = str(random.randint(10000, 99999))  # Generate a random 5-digit number
        if not User.query.filter_by(id=user_id).first():
            return user_id

#Add a new user to the database
@app.route('/api/registration', methods=['POST'])
def registration():
    try:
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
        return jsonify({"message": "User added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e), "message": "An internal error occurred."}), 500


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
        latest_item = Item.query.order_by(Item.id.desc()).first()
        return jsonify({
            "user_id": user.id,
            "email": user.email,
            "username": user.username,
            "latest_mood": latest_item.mood if latest_item else None,
            "latest_writing": latest_item.writing if latest_item else None
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

<<<<<<< HEAD

#check this code cause I paste it from claude :)
@app.route('/api/journal', methods=['POST'])
def add_journal_entry():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    new_entry = Item(mood='Journal', writing=f"Title: {title}\n\n{content}")
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"message": "Journal entry added successfully"}), 200

=======
'''
>>>>>>> af7f0085507bf24deef2c74849bef4a56b0aaa76
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

    return jsonify({"message": "Item added successfully"}), 201
'''

#Add mood to the database
@app.route('/api/mood/<user_id>', methods=['POST'])
def add_mood(user_id):
    data = request.get_json()
    mood = data.get('mood')

    if not mood:
        return jsonify({"error": "Mood is required"}), 400

    # Create a new mood item
    new_item = Item(mood=mood, writing = "", user_id=user_id)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Mood added successfully"}), 201

# Add writing to the database
@app.route('/api/writing/<user_id>', methods=['POST'])
def add_writing(user_id):
    data = request.get_json()
    writing = data.get('writing')

    if not writing:
        return jsonify({"error": "Writing is required"}), 400

    # Create a new writing item
    new_item = Item(writing=writing, mood = "", user_id=user_id)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Writing added successfully"}), 201

@app.errorhandler(Exception)
def handle_exception(e):
    response = {
        "error": str(e),
        "message": "An internal error occurred."
    }
    return jsonify(response), 500

@app.route('/')
def home():
    return 'Server is running!'

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)