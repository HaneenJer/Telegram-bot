from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    chat_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))

class Admin(db.Model):
    __tablename__ = 'admins'
    name = db.Column(db.String(255),primary_key=True)
    password = db.Column(db.String(255))

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

def db_add_Admin(username, password):
    try:
        admin = Admin(password=password, username=username)
        admin_exists = Admin.query.filter_by(username=username).first()
        if admin_exists is not None:
            return -1
        db.session.add(admin, username)
        db.session.commit()
    except Exception:
        db.session.rollback()

def db_fetch_Admins():
    try:
        return Admin.query.all()
    except Exception:
        db.session.rollback()

def format_admin(Admin):
    return{
        "name": Admin.username,
        "password": Admin.password
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
