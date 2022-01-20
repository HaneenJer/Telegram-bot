from flask import *
from flask_cors import CORS
from database import *
from config import postgres

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = postgres["SQLALCHEMY_DATABASE_URI"]
app.config['SECRET_KEY'] = postgres["SECRET_KEY"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = postgres["SQLALCHEMY_TRACK_MODIFICATIONS"]
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
    username = request.args.get("username")
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
    print(admins)
    admins_list = []
    for admin in admins:
        admins_list.append(format_admin(admin))
    print("this is the list of admins returned to react: ", admins_list)
    return {'admins': admins_list}

@app.route('/pollDesc', methods=['GET'])
def get_poll_desc():
    poll_id = request.args.get('poll_id')
    # poll_id = data['poll_id']
    print("poll_is: ", poll_id)
    poll_desc = db_get_poll_desc(poll_id=poll_id)
    return poll_desc


@app.route('/answers', methods=['GET'])
def get_answers():
    print(request.args.keys())
    pollId = request.args.get('pollId')
    print('pollId: ' + pollId)
    answers = db_fetch_poll_answers(pollId)
    #answers = db_fetch_poll_answers()
    #answers = db_fetch_admins()
    #print('answers: ' + answers)
    answers_list = []
    for answer in answers:
        answers_list.append(format_answer(answer))
    print("this is the list of answers returned to react: ", answers_list)
    return {'answers_list': answers_list}

@app.route('/allAnswers', methods=['GET'])
def get_all_answers():
    answers = db_fetch_answers()
    answers_list = []
    for answer in answers:
        print(answer)
        answers_list.append(format_answer(answer))
    print("this is the list of answers returned to react: ", answers_list)
    return {'answers_list': answers_list}

@app.route('/filteredAnswers', methods=['GET'])
def get_filtered_answers():
    data = request.get_json()
    print("data: ", data)
    print("user_id: ", request.args.get('user_id'))
    print("poll_id: ", request.args.get('poll_id'))
    print("ans_num: ", request.args.get('ans_num'))
    #print('user_id_filter')
    #print(request.args.get('user_id'))
    user_id_filter = request.args.get('user_id')
    poll_id_filter = request.args.get('poll_id')
    answer_num_filter = request.args.get('ans_num')
    if (user_id_filter == None or user_id_filter == ''):
        user_id_filter = -1

    if (poll_id_filter == None or poll_id_filter == ''):
        poll_id_filter = -1

    if (answer_num_filter == None or answer_num_filter == ''):
        answer_num_filter = -1;

    answers = db_fetch_filtered_answers(user_id_filter,poll_id_filter, answer_num_filter)
    answers_list = []
    for answer in answers:
        answers_list.append(format_answer(answer))
    print("this is the list of answers returned to react: ", answers_list)
    return {'answers_list': answers_list}

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

@app.route('/users', methods=['GET'])
def get_users():
    users = db_fetch_users()
    users_list = []
    for user in users:
        users_list.append(format_user(user))
    return {'users': users_list}

@app.route('/polls', methods=['GET'])
def get_polls_by_admin():
    adminName = request.args.get('username')
    data = request.get_json()
    print("data: ", data)
    print("username: ", request.args.get('username'))
    polls = db_fetch_polls(adminName)
    print("polls: ", polls)
    polls_list = []
    for poll in polls:
        polls_list.append(format_polls(poll))
    print("this is the list of polls returned to react: ", polls_list)
    return {'polls': polls_list}


@app.route('/admins', methods=['POST'])
def add_admin():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    status = db_add_admin(username=username, password=password)
    if status == -1:
        return Response("this admin is already registered", status=CONFLICT)
    return Response("admin added", status=OK)

@app.route('/answerPoll', methods=['POST'])
def get_poll_ans():
    chat_id = int(request.args.get("chat_id"))
    answer = int(request.args.get("answer"))
    generated_id = request.args.get("generated_id")
    poll_id = db_get_poll_id(chat_id, generated_id)
    db_add_user_answer(chat_id, poll_id, answer)
    db_delete_generated_poll(generated_id)
    return Response("answer added", status=OK)

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
