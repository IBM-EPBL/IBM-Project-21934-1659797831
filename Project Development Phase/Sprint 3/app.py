from flask import Flask, render_template, request, jsonify, make_response
from flask_socketio import SocketIO, send, emit
import os, json, datetime, requests
from Modules import sendMail as sm

app = Flask(__name__)

app.config['SECRET'] = "secret!123"
socketio = SocketIO(app, cors_allowed_origins="*")

dict_user = {'12345': {}}

@socketio.on('message')
def handle_message(message):
    print(message)
    if message != "User connected!":
        message = message.split(" ",1)
        send(message, broadcast=True)

#handle user to server
def add_user(req,email,session):
    if req not in dict_user:
        return False
    if len(dict_user[req]) == 2:
        dict_user[req][email] = session
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

@socketio.on('getUser', namespace='/getUser')
def recieve_username(Data):
    if Data['session_id'] in dict_user:
        for server_client in dict_user[Data['session_id']]:
            if(server_client != Data['email']):
                print("sent = "+server_client)
                print(dict_user)
                emit('server_client',server_client)

@socketio.on('private_message', namespace='/private')
def private_message(Values):
    recieve_session = dict_user[Values['session_id']][Values['email']]
    message = Values['message']
    emit('recieve_private_message', message, room=recieve_session)

@app.route('/sendmail', methods=['POST'])
def sendmail():
    print('send data')
    return "1234"

def Chat():
    URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getSessionValues.json"
    r = requests.get(url = URL)
    response = r.json()
    data = response["array"]
    for i in data:
        dict_user[i]={}
    return render_template("Chatting.html")

app.add_url_rule("/Chat","Chat",Chat)

def ticketHistory():
    name = request.cookies.get('_id')
    params = { 'user' : name }
    URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getTicketHistory.json"
    r = requests.get(url = URL, params = params)
    response = r.json()
    data = response["tickets"]
    return render_template("ticketHistory.html", data = data)

app.add_url_rule("/ticketHistory","ticketHistory",ticketHistory)

def tempLogin():
    return render_template("tempLogin.html")

app.add_url_rule("/tempLogin","tempLogin",tempLogin)

def agentPage():
    name = request.cookies.get('_id')
    params = { 'user' : str(name) }
    URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getAgentTickets.json"
    r = requests.get(url = URL, params = params)
    response = r.json()
    data = response["tickets"]
    return render_template("agentPage.html", data = data)

app.add_url_rule("/agentPage","agentPage",agentPage)

def CompanyRegistrationForm():
    return render_template("CompanyRegistrationForm.html")

app.add_url_rule("/CompanyRegistrationForm","CompanyRegistrationForm",CompanyRegistrationForm)

def signup():
    return render_template('signup.html')
    
app.add_url_rule("/signup","signup",signup)

def login():
    return render_template('Login.html')

app.add_url_rule("/login","login",login)

def customer():
    return render_template('customer.html') 

app.add_url_rule("/customer","customer",customer)


def custland():
    return render_template("customerlandingpage.html")

app.add_url_rule('/home',"custland", custland)

def adminMainPage():
    res = requests.get('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getTickets.json')
    response = json.loads(res.text)
    data = response['tickets']
    return render_template('adminMainPage.html' , data = data)

app.add_url_rule('/admin/32280/ccrfolks',"adminMainContent", adminMainPage)

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/verify_mail', methods=['POST'])
def verify_mail():
    email = request.get_json()
    rand = sm.sendMail(email['Email'],email['Name'], email["Status"])
    data = [{'Success': 'Ok', 'Code': rand}]
    return jsonify(data)

@app.route('/sendSessionLink', methods=['POST'])
def sendSessionLink():
    user = request.get_json()
    rand = sm.sendMail(user['Email'], user['Name'], user["Status"], user["Link"])
    data = [{'Success': 'Ok', 'Code': rand}]
    return jsonify(data)

@app.route('/getImages', methods=['GET'])
def getImages():    
    f = open ('IBM_Images.json', "r")
    data = json.loads(f.read())
    return jsonify(data)

@app.route('/getCompanyDepartment', methods=['POST'])
def getCompanyDepartment():
    name = request.get_json()
    params = { 'user' : name['name'] }
    URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getCompanyDepartment.json"
    r = requests.get(url = URL, params = params)
    response = r.json()
    return jsonify(response)

@app.route('/getAgentDetails', methods=['POST'])
def getAgentDetails():
    name = request.get_json()
    params = { 'user' : name['name'] }
    URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getAgentDetails.json"
    r = requests.get(url = URL, params = params)
    response = r.json()
    return jsonify(response)

@app.route('/getCompany', methods=['GET'])
def getCompany():    
    f = open ('Companies.json', "r")
    data = json.loads(f.read())
    return jsonify(data)

@app.route('/signup_form', methods=['POST'])
def signup_data():
    data = request.get_json()
    name = data['name']
    email = data['email']
    number = data['number']
    password = data['password']
    CPassword = data['Cpassword']
    if name == "" or email == "" or number == "" or password == "" or CPassword == "":
        return render_template('signup.html' , error="Validation error")
    else:
        return render_template('login.html')

if __name__  == '__main__':
    app.run(host="0.0.0.0", port=5000)