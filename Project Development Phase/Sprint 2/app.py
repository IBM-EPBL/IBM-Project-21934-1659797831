from flask_socketio import SocketIO, send, emit
from flask import Flask, render_template, request, jsonify, make_response
import os, json, datetime
from Modules import DB2
from Modules import sendMail as sm

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

@app.route('/sendmail', methods=['POST'])
def sendmail():
    print('send data')
    return "1234"

@socketio.on('username', namespace='/private')
def recieve_username(Data):
    result = add_user(Data['session_id'],Data['email'],request.sid)
    print(request.sid)
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

def ticketHistory():
    data = [
        {
            'name': 'sekarmoorthy',
            'date':'29-10-2022',
            'email': 'technical1220@gmail.com',
            'ticket_status': {'color':'green', 'message':'Opened'},
            'ticket_id': '000004',
            'query': 'Naanae Varuvaan Padi Romba Kaevalam Please go through it.',
            'company': 'avaada'
        },
        {
            'name': 'sekarmoorthy',
            'date':'30-10-2022',
            'email': 'ThejaC2000@gmail.com',
            'ticket_status': {'color':'yellow', 'message':'On Hold'},
            'ticket_id': '000005',
            'query': 'Maggi is missing for 5 years',
            'company': 'cuemath'
        },
        {
            'name': 'sekarmoorthy',
            'date':'31-10-2022',
            'email': 'venkatanand2002@gmail.com',
            'ticket_status': {'color':'green', 'message':'Opened'},
            'ticket_id': '000006',
            'query': 'Naanae Varuvaan Padi Romba Kaevalam Please go through it.',
            'company': 'Mitsubishi Electric'
        },
    ]
    return render_template("ticketHistory.html", data = data)

app.add_url_rule("/ticketHistory","ticketHistory",ticketHistory)

def agentPage():
    data = [
        {
            'name': 'sekarmoorthy',
            'date':'29-10-2022',
            'email': 'technical1220@gmail.com',
            'ticket_status': {'color':'green', 'message':'Opened'},
            'ticket_id': '000004',
            'query': 'Naanae Varuvaan Padi Romba Kaevalam Please go through it.',
            'company': 'avaada'
        },
        {
            'name': 'sekarmoorthy',
            'date':'30-10-2022',
            'email': 'ThejaC2000@gmail.com',
            'ticket_status': {'color':'yellow', 'message':'On Hold'},
            'ticket_id': '000005',
            'query': 'Maggi is missing for 5 years',
            'company': 'cuemath'
        },
        {
            'name': 'sekarmoorthy',
            'date':'31-10-2022',
            'email': 'venkatanand2002@gmail.com',
            'ticket_status': {'color':'green', 'message':'Opened'},
            'ticket_id': '000006',
            'query': 'Naanae Varuvaan Padi Romba Kaevalam Please go through it.',
            'company': 'Mitsubishi Electric'
        },
    ]
    return render_template("agentPage.html", data = data)

app.add_url_rule("/agentPage","agentPage",agentPage)

def CompanyRegistrationForm():
    return render_template("CompanyRegistrationForm.html")

app.add_url_rule("/CompanyRegistrationForm","CompanyRegistrationForm",CompanyRegistrationForm)

def QueryRaise():
    return render_template("QueryRaise.html")

app.add_url_rule("/QueryRaise","QueryRaise",QueryRaise)

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
    data = [
        {
            'name': 'sekarmoorthy',
            'date':'28-10-2022',
            'email': 'sekarmoorthy81@gmail.com',
            'ticket_status': {'color':'green', 'message':'Opened'},
            'ticket_id': '000001',
            'query': 'Maggi is missing for 5 years',
            'company': 'avaada'
        },
        {
            'name': 'sekarmoorthy',
            'date':'27-10-2022',
            'email': 'sekarmoorthy61@gmail.com',
            'ticket_status': {'color':'red', 'message':'Closed'},
            'ticket_id': '000002',
            'query': 'Naanae Varuvaan Padi Romba Kaevalam Please go through it.',
            'company': 'Arun'
        },
        {
            'name': 'sekarmoorthy',
            'date':'26-10-2022',
            'email': 'sekarmoorthy172002@gmail.com',
            'ticket_status': {'color':'yellow', 'message':'On Hold'},
            'ticket_id': '000003',
            'query': 'Maggi is missing for 5 years',
            'company': 'Vidial'
        },
    ]
    return render_template('adminMainPage.html' , data = data)

app.add_url_rule('/admin/32280/ccrfolks',"adminMainContent", adminMainPage)

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login_data():
    Email = request.form['email']
    Password = request.form['password']
    logged, message, session_id = DB2.loginUser(Email, Password)
    if logged:
        return render_template('customerlandingpage.html', email = Email, password = Password)
    else:
        NextDay_Date = datetime.datetime.today() + datetime.timedelta(days=1)
        resp = make_response(render_template('login.html'))
        resp.set_cookie('Message', message)
        resp.set_cookie('_id', session_id, expires=NextDay_Date)
        return resp

@app.route('/verify_mail', methods=['POST'])
def verify_mail():
    email = request.get_json()
    error, message = DB2.checkEmailExist(email['Email'])
    if error:
        data = [{'Error': message}]
        return jsonify(data)
    else:
        rand = sm.sendMail(email['Email'],email['Name'])
        data = [{'Success': 'Ok', 'Code': rand}]
        return jsonify(data)

@app.route('/session_info', methods=['POST'])
def session_info():
    session_id = request.get_json()
    getDetails = DB2.retrive_details(session_id['session_id'])
    return jsonify(getDetails)

@app.route('/getImages', methods=['GET'])
def getImages():    
    f = open ('IBM_Images.json', "r")
    data = json.loads(f.read())
    return jsonify(data)

@app.route('/getCompanyDepartment', methods=['POST'])
def getCompanyDepartment():
    name = request.get_json()
    dept = DB2.getCompanyDepartment(name['name'])
    return jsonify(dept)

@app.route('/getAgentDetails', methods=['POST'])
def getAgentDetails():
    name = request.get_json()
    dept = DB2.getAgentDetails(name['name'])
    return jsonify(dept)

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
        DB2.createUserWithPassword(email, password)
        DB2.createUserProfile(name, email, number)
        DB2.getUsernameAndPasswords()
        return render_template('login.html')

if __name__  == '__main__':
    socketio.run(app, host="localhost")