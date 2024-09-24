from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#Sample
users = {
    "123": {"username": "John", "mood": "Happy"},
    "124": {"username": "Jane", "mood": "Sad"},
}

@app.route('/get_users/<user_id>', methods=['GET'])
def get_user(user_id):
    # Check if the user_id exists in our data
    user = users.get(user_id)
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