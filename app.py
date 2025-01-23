from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game/<game_name>')
def game(game_name):
    return render_template(f'{game_name}.html')

if __name__ == '__main__':
    app.run(debug=True)
