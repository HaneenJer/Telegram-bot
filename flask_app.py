from flask import *

app = Flask(__name__)
# TODO: change secret key
# TODO: init database
#app.config['SECRET_KEY'] = 'some secret string'


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
