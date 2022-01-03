from telegram import *
from telegram.ext import *
import requests
import logging

TOKEN = '5048699289:AAGd1BysZFujGqZ1BDS4R64EJ-nyQ0De9pw'
# flask app runs on port 5000
URL = 'http://localhost:5000'

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def echo(update: Update, context) -> None:
    """Echo the user message."""
    update.message.reply_text(update.message.text)


# this function is called when we start the bot
def start(update: Update, context):
    update.message.reply_text("hi! just checking!")


# this function is called when the user types register
def register(update: Update, context):
    chat_id = update.effective_chat.id
    username = update.message.chat.first_name
    rel_url = URL + '/register'
    data = {'chat_id': chat_id, 'username': username}
    response = requests.post(rel_url, params=data)
    update.message.reply_text(response.text)


# this function is called when the user types remove
def remove(update: Update, context):
    chat_id = update.effective_chat.id
    rel_url = URL + '/remove'
    data = {'chat_id': chat_id}
    response = requests.delete(rel_url, params=data)
    update.message.reply_text(response.text)


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
