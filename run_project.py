import os
import subprocess


def run():
    os.environ['WERKZEUG_RUN_MAIN'] = 'true'

    "execute child programs in a new process"
    try:
        init_command = 'conda activate Telegram-bot'
        init_bot = subprocess.Popen(f'{init_command}  && python main.py', shell=True)
        init_flask = subprocess.Popen(f'{init_command}  && python server/flask_app.py', shell=True)
        npm_run_dev = subprocess.Popen('npm run dev --prefix ./', shell=True)
        npm_start = subprocess.Popen('npm start --prefix ./', shell=True)

        while True:
            init_bot.poll()
            init_flask.poll()
            npm_run_dev.poll()
            npm_start.poll()

    except Exception:
        init_bot.kill()
        init_flask.kill()
        npm_run_dev.kill()
        npm_start.kill()


if __name__ == '__main__':
    run()
