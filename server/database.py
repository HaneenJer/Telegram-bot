import requests
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKeyConstraint

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    chat_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))


class Admin(db.Model):
    __tablename__ = 'admins'
    name = db.Column(db.String(255), primary_key=True)
    password = db.Column(db.String(255))


class Polls(db.Model):
    __tablename__ = 'polls'
    poll_id = db.Column(db.Integer, primary_key=True, )
    description = db.Column(db.String())
    author = db.Column(db.String(500))
    ForeignKeyConstraint((author,), [Admin.name], ondelete="CASCADE")


class PollsOptions(db.Model):
    """this table holds the data of each poll and the options for that poll"""
    __tablename__ = 'polloptions'
    poll_id = db.Column(db.Integer, primary_key=True)
    ans_num = db.Column(db.Integer, primary_key=True)
    ans_des = db.Column(db.String())
    ForeignKeyConstraint((poll_id,), [Polls.poll_id], ondelete="CASCADE")


class UserAnswers(db.Model):
    __tablename__ = 'useranswers'
    user_id = db.Column(db.Integer, primary_key=True, nullable=False)
    poll_id = db.Column(db.Integer, primary_key=True, nullable=False)
    ans_num = db.Column(db.Integer)
    ForeignKeyConstraint((user_id,), [User.chat_id], ondelete="CASCADE")
    ForeignKeyConstraint((poll_id,), [Polls.poll_id], ondelete="CASCADE")


class GeneratedPoll(db.Model):
    """each time a poll is sent to a user, a special poll id is generated for this poll and this user"""
    """we save this so we can use it when getting an answer from this user"""
    __tablename__ = 'generatedpolls'
    poll_id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, primary_key=True, nullable=False)
    generated_id = db.Column(db.BigInteger)
    ForeignKeyConstraint((poll_id,), [Polls.poll_id], ondelete="CASCADE")
    ForeignKeyConstraint((user_id,), [User.chat_id], ondelete="CASCADE")

def db_delete_generated_poll(generated_id):
    try:
        poll = GeneratedPoll.query.filter_by(generated_id=generated_id).first()
        if poll is not None:
            db.session.delete(poll)
            db.session.commit()
        else:
            return -1
    except Exception:
        db.session.rollback()
        return -1


def create_db(app):
    db.init_app(app)

def get_last_poll_id():
    all_polls = db_fetch_all_polls()
    if all_polls == -1:
        curr_poll = 1
    else:
        curr_poll = len(all_polls) + 1
    return curr_poll

def db_add_usr(chat_id, username):
    try:
        user = User(chat_id=chat_id, username=username)
        user_exists = User.query.filter_by(chat_id=chat_id).first()
        if user_exists is not None:
            if user_exists.username != username:
                return -2
            return -1
        db.session.add(user, username)
        db.session.commit()
    except Exception:
        db.session.rollback()


def add_first_admin():
    db_add_admin(username="admin", password="236369")



def db_fetch_all_polls():
    try:
        polls = Polls.query.all()
        if polls is None:
            return -1
        return polls
    except Exception:
        db.session.rollback()


def db_fetch_polls(adminName):
    try:
        print('admin name is: ', adminName)
        polls = Polls.query.filter_by(author=adminName)
        if polls is None:
            return -1
        return polls
    except Exception:
        db.session.rollback()


def db_add_admin(username, password):
    try:
        admin = Admin(password=password, name=username)
        admin_exists = Admin.query.filter_by(name=username).first()
        if admin_exists is not None:
            return -1
        db.session.add(admin, username)
        db.session.commit()
    except Exception:
        db.session.rollback()


def db_fetch_admins():
    try:
        admins = Admin.query.all()
        if admins is None:
            return -1
        return admins
    except Exception:
        db.session.rollback()


def format_admin(Admin):
    return {
        "name": Admin.name,
        "password": Admin.password
    }


def format_user(User):
    return {
        "name": User.username,
        "chat_id": User.chat_id
    }


def db_add_poll(poll_id, admin, description):
    try:
        poll = Polls(poll_id=poll_id, admin_name=admin.lower(), description=description)
        db.session.add(poll)
        db.session.commit()
    except Exception:
        db.session.rollback()


def db_add_poll_option(poll_id, ans_id, ans):
    try:
        polloption = PollsOptions(poll_id=poll_id, ans_num=ans_id, ans_des=ans)
        db.session.add(polloption)
        db.session.commit()
    except Exception:
        db.session.rollback()


def add_generated_id(poll_id, user_id, generated_id):
    try:
        generated = GeneratedPoll(poll_id=poll_id, user_id=user_id, generated_id=generated_id)
        db.session.add(generated)
        db.session.commit()
    except Exception:
        db.session.rollback()


def send_poll_to_user(poll_id, description, options, user_id, first_req):
    optionsList = []
    for option in options:
        optionsList.append(option["description"])
    req_data = {
        'chat_id': user_id,
        'question': description,
        'options': optionsList,
        'is_anonymous': False,
    }
    base_url = "https://api.telegram.org/bot5065858913:AAFMuph4soAvArtqdrwuIHqNb8CHLbz5pZE/sendPoll"
    resp = requests.post(url=base_url, json=req_data).json()
    if resp["ok"]:
        data = resp["result"]
        generated_id = data["poll"]["id"]
        add_generated_id(poll_id, user_id, generated_id)


def db_send_poll(poll_id, description, options, usersList):
    first_req = True
    for user in usersList:
        if user["isChecked"] == True:
            send_poll_to_user(poll_id, description, options, user["chat_id"], first_req)
            first_req = False


def db_fetch_poll_answers(poll_id):
    # def db_fetch_poll_answers():
    # try:
    #     #answers = UserAnswers.query.filter_by(UserAnswers.poll_id ==  poll_id).all()
    try:
        answers = UserAnswers.query.filter_by(poll_id=poll_id)
        if answers is None:
            return -1
        return answers
    except Exception:
        db.session.rollback()

def db_get_poll_id(chat_id, generated_id):
    poll = GeneratedPoll.query.filter_by(generated_id=generated_id).first()
    if poll.user_id == chat_id:
        poll_id = poll.poll_id
        return poll_id


def db_add_user_answer(chat_id, poll_id, answer):
    try:
        user_ans = UserAnswers(user_id=chat_id, poll_id=poll_id, ans_num=answer)
        db.session.add(user_ans)
        db.session.commit()
    except Exception:
        db.session.rollback()

def format_answer(UserAnswers):
    return {
        "user_id": UserAnswers.user_id,
        "poll_id": UserAnswers.poll_id,
        "ans_num": UserAnswers.ans_num
    }


def format_polls(Polls):
    return {
        "poll_id": Polls.poll_id,
        "description": Polls.description
    }


def db_fetch_users():
    try:
        users = User.query.all()
        if users is None:
            return -1
        return users
    except Exception:
        db.session.rollback()


def db_delete_usr(chat_id, username):
    try:
        user_chat = User.query.filter_by(chat_id=chat_id).first()
        if user_chat is not None:
            if user_chat.username != username:
                return -2
            db.session.delete(user_chat)
            db.session.commit()
        else:
            return -1
    except Exception:
        db.session.rollback()
        return -1


def create_db(app):
    db.init_app(app)
    db.create_all()
