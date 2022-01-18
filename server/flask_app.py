from flask import *
from flask_cors import CORS
from database import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/tele_polls'
app.config['SECRET_KEY'] = 'g34jdk9018220dd'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

NOTFOUND = 404
CONFLICT = 409
OK = 200

curr_poll = 0
@app.before_first_request
def init():
    with app.app_context():
        create_db(app)
        add_first_admin()
        global curr_poll
        curr_poll = get_last_poll_id()


@app.route('/register', methods=['POST'])
def add_user():
    status = db_add_usr(chat_id=int(request.args.get("chat_id")), username=request.args.get("username"))
    if status == -1:
        return Response("this user is already registered", status=CONFLICT)
    elif status == -2:
        return Response("this user is already registered with another name", status=CONFLICT)
    return Response("user added", status=OK)
    pass


@app.route('/remove', methods=['DELETE'])
def delete_user():
    status = db_delete_usr(chat_id=int(request.args.get("chat_id")), username=(request.args.get("username")))
    if status == -1:
        return Response("this user doesnt exist", status=NOTFOUND)
    if status == -2:
        return Response("this is not the right username", status=NOTFOUND)
    return Response("user removed", status=OK)
    pass


@app.route('/admins', methods=['GET'])
def get_admins():
    admins = db_fetch_admins()
    admins_list = []
    for admin in admins:
        admins_list.append(format_admin(admin))
    return {'admins': admins_list}


@app.route('/polls', methods=['GET'])
def get_polls():
    data = request.get_json()
    polls = db_fetch_polls()
    polls_list = []
    for poll in polls:
        polls_list.append(format_polls(poll))
    return {'polls': polls_list}


@app.route('/users', methods=['GET'])
def get_users():
    users = db_fetch_users()
    users_list = []
    for user in users:
        users_list.append(format_user(user))
    return {'users': users_list}

@app.route('/admins', methods=['POST'])
def add_admin():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    status = db_add_admin(username=username, password=password)
    if status == -1:
        return Response("this admin is already registered", status=CONFLICT)
    return Response("admin added", status=OK)


@app.route('/polls', methods=['POST'])
def add_poll():
    global curr_poll
    data = request.get_json()
    description = data["pollDesc"]
    options = data["inputFeilds"]
    admin_name = data["name"]
    db_add_poll(curr_poll, admin_name, description)
    for idx, option in enumerate(options):
        db_add_poll_option(poll_id=curr_poll, ans_id=idx, ans=option["description"])
    db_send_poll(curr_poll, description, options, data["usersList"])
    curr_poll += 1
    return Response("poll added", status=OK)




class admin_data:
    userId = "789789",
    password = "236369",
    name = "Admin",
    username = "admin",
    isAdmin = True


# static user details
admin = admin_data()

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)
