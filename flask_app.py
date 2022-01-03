from flask import *
from database import create_db



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/tele_polls'
app.config['SECRET_KEY'] = 'g34jdk9018220dd'


@app.before_first_request
def init():
    with app.app_context():
        create_db(app)

@app.route('/register', methods=['POST'])
def add_user():
    # TODO: add user to the database
    return Response("[CHECKING]---add user")
    pass


@app.route('/remove', methods=['DELETE'])
def delete_user():
    # TODO: remove user from the database
    return Response("[CHECKING]---remove user")
    pass


if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)
