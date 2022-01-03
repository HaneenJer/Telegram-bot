from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    chat_id = db.Column(db.Integer, primary_key=True)


def db_add_usr(chat_id):
    try:
        user = User(chat_id=chat_id)
        db.session.add(user)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return -1


def db_delete_usr(chat_id):
    try:
        user = User.query.filter_by(chat_id=chat_id).first()
        if user is not None:
            db.session.delete(user)
            db.session.commit()
        else:
            return -1
    except Exception:
        db.session.rollback()
        return -1


def create_db(app):
    db.init_app(app)
    db.create_all()
