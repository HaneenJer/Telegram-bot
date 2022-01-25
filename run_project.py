from subprocess import Popen
import os
from time import sleep


def run():
    os.environ['WERKZEUG_RUN_MAIN'] = 'true'

    "execute child programs in a new process"
    init_command = 'conda activate Telegram-bot'
    init_bot = Popen(f'{init_command}  && python main.py', shell=True)
    init_flask = Popen(f'{init_command}  && python server/flask_app.py', shell=True)
    npm_run_dev = Popen('npm run dev --prefix ./', shell=True)
    npm_start = Popen('npm start --prefix ./', shell=True)

    try:
        while True:
            init_bot.poll()
            init_flask.poll()
            npm_run_dev.poll()
            npm_start.poll()

            "without sleep we get error"
            sleep(30)

    except Exception:
        init_bot.kill()
        init_flask.kill()
        npm_run_dev.kill()
        npm_start.kill()


if __name__ == '__main__':
    run()
