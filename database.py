from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    chat_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))


def db_add_usr(chat_id, username):
    try:
        user = User(chat_id=chat_id, username=username)
        db.session.add(user, username)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return -1


def db_delete_usr(chat_id, username):
    try:
        user_chat = User.query.filter_by(chat_id=chat_id).first()

        if user_chat is not None:
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
