from flask_sqlalchemy import SQLAlchemy

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
    poll_id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500))

class UserAnswers(db.Model):
    __tablename__ = 'userAnswers'
    user_id = db.Column(db.Integer,db.ForeignKey('users.chat_id'),primary_key = True)
    poll_id = db.Column(db.Integer, db.ForeignKey('polls.poll_id'), primary_key=True)
    ans_num = db.Column(db.Integer)



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


def db_fetch_polls():
    try:
        polls = Polls.query.all()
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

def db_fetch_poll_answers(poll_id):
#def db_fetch_poll_answers():
    # try:
    #     #answers = UserAnswers.query.filter_by(UserAnswers.poll_id ==  poll_id).all()
    try:
        answers = UserAnswers.query.filter_by(poll_id=poll_id)
        if answers is None:
            print('answer is none')
            return -1
        return answers
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
