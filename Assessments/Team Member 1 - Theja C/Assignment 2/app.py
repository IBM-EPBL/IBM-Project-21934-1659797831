from flask_socketio import SocketIO, send, emit
from flask import Flask, render_template
import os

app = Flask(__name__)

app.config['SECRET'] = "secret!123"
socketio = SocketIO(app, cors_allowed_origins="*")

# @socketio.on('message')
# def handle_message(message):
#     print("Recieved message: "+ message)
#     if message != "User connected!":
#         message = message.split(" ",1)
#         print(message)
#         send(message, broadcast=True)

# def Chat():
#     return render_template("Chatting.html")

# app.add_url_rule("/Chat","Chat",Chat)

picFolder = os.path.join('static','Images')
    
app.config['UPLOAD_FOLDER'] = picFolder

def signup():
    return render_template('signup.html')

app.add_url_rule("/signup","signup",signup)
@app.route('/signup', methods = ['POST', 'GET'])

def login():
    return render_template('Login.html')

app.add_url_rule("/login","login",login)

# def customer():
#     return render_template('customer.html') 

# app.add_url_rule("/customer","customer",customer)

@app.route("/")
def home():
    return render_template('index.html', favicon = os.path.join(app.config["UPLOAD_FOLDER"], 'fav.png'))

if __name__  == '__main__':
    socketio.run(app, host="localhost")