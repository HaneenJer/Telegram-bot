from flask import *

app = Flask(__name__)
# TODO: change secret key
# TODO: init database
app.config['SECRET_KEY'] = 'some secret string'


@app.route('/register', methods=['POST'])
def add_user():
    # TODO: add user to the database
    print("[CHECKING]---See if this function is reached")
    pass


@app.route('/remove')
def delete_user():
    # TODO: remove user from the database
    pass


if __name__ == '__main__':
    app.run(debug=True)
