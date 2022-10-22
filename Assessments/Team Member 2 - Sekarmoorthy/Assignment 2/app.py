from flask_socketio import SocketIO, send, emit
from flask import Flask, render_template, request
import os

app = Flask(__name__)

app.config['SECRET'] = "secret!123"
socketio = SocketIO(app, cors_allowed_origins="*")

dict_user = {'12345':{},'54321':{}}

@socketio.on('message')
def handle_message(message):
    if message != "User connected!":
        message = message.split(" ",1)
        send(message, broadcast=True)

#handle user to server
def add_user(req,email,session):
    if req not in dict_user:
        return False
    if len(dict_user[req]) == 2:
        print("cannot add session")
        return False
    else:
        dict_user[req][email] = session
        return True

@socketio.on('username', namespace='/private')
def recieve_username(Data):
    result = add_user(Data['session_id'],Data['email'],request.sid)
    if result == True:
        print("User added!")
    if Data['session_id'] in dict_user:
        for server_client in dict_user[Data['session_id']]:
            if(server_client != Data['email']):
                print("sent = "+server_client)
                emit('server_client',server_client)

@socketio.on('private_message', namespace='/private')
def private_message(Values):
    recieve_session = dict_user[Values['session_id']][Values['email']]
    message = Values['message']
    emit('recieve_private_message', message, room=recieve_session)

def Chat():
    return render_template("Chatting.html")

app.add_url_rule("/Chat","Chat",Chat)

picFolder = os.path.join('static','Images')
    
app.config['UPLOAD_FOLDER'] = picFolder

def signup():
    return render_template('signup.html')

app.add_url_rule("/signup","signup",signup)
@app.route('/signup', methods = ['POST', 'GET'])

def login():
    return render_template('Login.html')

app.add_url_rule("/login","login",login)

def customer():
    return render_template('customer.html') 

app.add_url_rule("/customer","customer",customer)

@app.route("/")
def home():
    return render_template('index.html', favicon = os.path.join(app.config["UPLOAD_FOLDER"], 'fav.png'))

if __name__  == '__main__':
    socketio.run(app, host="localhost")