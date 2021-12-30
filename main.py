from flask import Flask
import telegram

TOKEN = '5048699289:AAGd1BysZFujGqZ1BDS4R64EJ-nyQ0De9pw'


def main():
    bot = telegram.Bot(token=TOKEN)


if __name__ == '__main__':
    main()

