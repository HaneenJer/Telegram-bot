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


@app.before_first_request
def init():
    with app.app_context():
        create_db(app)
        add_first_admin()


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
    print(admins)
    admins_list = []
    for admin in admins:
        admins_list.append(format_admin(admin))
    print("this is the list of admins returned to react: ", admins_list)
    return {'admins': admins_list}


@app.route('/admins', methods=['POST'])
def add_admin():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    status = db_add_admin(username=username, password=password)
    if status == -1:
        return Response("this admin is already registered", status=CONFLICT)
    return Response("admin added", status=OK)


class admin_data:
    userId = "789789",
    password = "236369",
    name = "Admin",
    username = "admin",
    isAdmin = True

# static user details
admin = admin_data()



# require('dotenv').config();
# express = require('express');
# cors = require('cors');
# bodyParser = require('body-parser');
# jwt = require('jsonwebtoken');
# utils = require('./utils');


# # enable CORS
# app.use(cors());
# # parse application/json
# app.use(bodyParser.json());
# # parse application/x-www-form-urlencoded
# app.use(bodyParser.urlencoded({ extended: true }));



# TODO: check the functions
#middleware that checks if JWT token exists and verifies it if it does exist.
#In all future routes, this helps to know if the request is authenticated or not.

# def validate_user(err, user):
#     if err:
#       return res.status(401).json({
#         error: true,
#         message: "Invalid user."
#       })
#     else:
#       req.user = user #set the user to req so other routes can use it
#       next()
#
#
#
# @app.route('/login', methods=['GET'])
# def is_token():
#     token = req.headers['authorization']
#     if (token == None):
#         return next()  # if no token, continue
#     jwt.verify(token, process.env.JWT_SECRET, validate_user(err,user))
#     pass
#
#
# @app.route('/login', methods=['POST'])
# def validate_user_cardentials():
#     user = req.body.username
#     pwd = req.body.password
#
#
#     # return 400 status if username/password is not exist
#     if (user == None or pwd == None):
#         return res.status(400).json({
#             error: true,
#             message: "Username or Password required."
#         })
#     else:
#         if (user != userData.username or pwd != userData.password):
#             return res.status(401).json({
#                 error: true,
#                 message: "Username or Password is Wrong."
#             })
#     # generate token
#     token = utils.generateToken(userData)
#     # get basic user details
#     userObj = utils.getCleanUser(userData)
#     # return the token along with user details
#     return res.json({user: userObj, token: token})
#     pass
#
#
# def validate_token(err, user):
#     if (err):
#         return res.status(401).json({
#             error: true,
#             message: "Invalid token."
#             })
#     # return 401 status if the userId does not match.
#     if (user.userId != userData.userId):
#         return res.status(401).json({
#             error: true,
#             message: "Invalid user."
#         })
#     # get basic user details
#     userObj = utils.getCleanUser(userData);
#     return res.json({user: userObj, token: token})
#
# @app.route('/login', methods=['GET'])
# def verify_token():
#     # check header or url parameters or post parameters for token
#     token = req.body.token or req.query.token
#     if (token == None):
#         return res.status(400).json({
#             error: true,
#             message: "Token is required."
#         })
#     # check token that was passed by decoding token using secret
#     jwt.verify(token, process.env.JWT_SECRET, validate_token(err, user))
#     pass

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)
