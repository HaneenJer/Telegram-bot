from flask import *
from database import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/tele_polls'
app.config['SECRET_KEY'] = 'g34jdk9018220dd'

NOTFOUND = 404
CONFLICT = 409
OK = 200



@app.before_first_request
def init():
    with app.app_context():
        create_db(app)


@app.route('/register', methods=['POST'])
def add_user():
    status = db_add_usr(chat_id=int(request.args.get("chat_id")))
    if status == -1:
        return Response("this user is already registered", status=CONFLICT)
    return Response("[CHECKING]---add user", status=OK)
    pass


@app.route('/remove', methods=['DELETE'])
def delete_user():
    status = db_delete_usr(chat_id=int(request.args.get("chat_id")))
    if status == -1:
        return Response("this user doesnt exist", status=NOTFOUND)
    return Response("[CHECKING]---remove user", status=OK)
    pass


if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)
