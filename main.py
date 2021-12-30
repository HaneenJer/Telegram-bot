from telegram import *
from telegram.ext import *
import requests

TOKEN = '5048699289:AAGd1BysZFujGqZ1BDS4R64EJ-nyQ0De9pw'
# flask app runs on port 5000
URL = 'http://localhost:5000'


# this function is called when we start the bot
def start(update: Update, context):
    update.message.reply_text("hi! just checking!")


# this function is called when the user types register
def register(update: Update, context):
    chat_id = update.effective_chat.id
    rel_url = URL + '/register'
    data = {'chat_id': chat_id}
    try:
        requests.post(rel_url, data)
    except requests.exceptions.ConnectionError:
        print("Connection refused")
    # TODO: check why connection is not working!! 
    update.message.reply_text("Welcome!! ")


# this function is called when the user types remove
def remove(update: Update, context):

    update.message.reply_text("")


def polls_bot():
    # the updater object enables us to do anything with the bot
    updater = Updater(TOKEN, use_context=True)
    disp = updater.dispatcher

    disp.add_handler(CommandHandler("start", start))
    disp.add_handler(CommandHandler("register", register))
    disp.add_handler(CommandHandler("remove", remove))

    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    polls_bot()
