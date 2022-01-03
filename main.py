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


# this function is called when we start the bot
def start(update: Update, context):
    name = update.message.chat.first_name
    greeting = "Hello, " + name + ".\n"
    update.message.reply_text(greeting)
    welcome = "Welcome to smart polling.\n Please choose one of the options:"
    update.message.reply_text(welcome)
    register_command = '/register <username> - Register to start answering polls via telegram\n' + name + ' in smart polling system\n \n'
    remove_command = '/remove <username> - To stop getting polls queries\n' + name + ' in smart polling system\n\n'
    start_command = '/start <username> - Use start anytime to see this menu again\n' + name + ' in smart polling system\n\n'
    update.message.reply_text(register_command + remove_command + start_command)


# this function is called when the user types register
def register(update: Update, context):
    chat_id = update.effective_chat.id
    chk = update.message.text.split(' ')
    if len(chk) == 1:
        update.message.reply_text('Please enter the command again, with your name')
        return
    username = update.message.text.split(' ')[1]
    rel_url = URL + '/register'
    data = {'chat_id': chat_id, 'username': username}
    response = requests.post(rel_url, params=data)
    update.message.reply_text(response.text)


# this function is called when the user types remove
def remove(update: Update, context):
    chat_id = update.effective_chat.id
    chk = update.message.text.split(' ')
    if len(chk) == 1:
        update.message.reply_text('Please enter the command again, with your name')
        return
    username = update.message.text.split(' ')[1]
    rel_url = URL + '/remove'
    data = {'chat_id': chat_id,'username' : username}
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
