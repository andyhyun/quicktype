from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Fake database
scores_table = [
    {'score': 121, 'user_id': 2},
    {'score': 73, 'user_id': 3},
    {'score': 114, 'user_id': 2},
    {'score': 96, 'user_id': 1},
]

# Get all scores in the database
@app.route('/api/scores', methods=['GET'])
def get_scores():
    if request.method == 'GET':
        return scores_table

# Get all scores of a specific user
@app.route('/api/scores/<int:id>', methods=['GET'])
def get_score(id):
    if request.method == 'GET':
        return [row for row in scores_table if row['user_id'] == id]

if __name__ == '__main__':
    app.run()
