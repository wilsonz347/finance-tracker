from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

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

@app.route('/get_users/<user_id>', methods=['GET'])
def get_user(user_id):
    # Check if the user_id exists in our data
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "user_id": user_id,
            "username": user["username"],
            "mood": user["mood"]
        })
    else:
        return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)