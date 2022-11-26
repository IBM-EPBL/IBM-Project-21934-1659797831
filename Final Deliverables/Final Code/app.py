from flask import Flask, render_template, request, jsonify, flash, redirect
from werkzeug.utils import secure_filename
from flask_socketio import SocketIO, send, emit
import os, json, requests, ibm_boto3
from Modules import sendMail as sm
from ibm_botocore.client import Config, ClientError

app = Flask(__name__)

app.config['SECRET'] = "secret!123"
socketio = SocketIO(app, cors_allowed_origins="*")

dict_user = {'12345': {}}
global company
company=0

UPLOAD_FOLDER = 'static/uploads/'
 
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
 
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
    print(response)
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

@app.errorhandler(404)
def page_not_found(e):
    # note that i set the 404 status explicitly
    return render_template('error.html'), 404

def signup():
    return render_template('signup.html')
    
app.add_url_rule("/signup","signup",signup)

def service():
    return render_template('home.html')
    
app.add_url_rule("/service","service",service)

def faq():
    return render_template('home.html')
    
app.add_url_rule("/faq","faq",faq)

def about():
    return render_template('home.html')
    
app.add_url_rule("/about","about",about)

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

@app.route('/uploadAgents', methods=['POST'])
def uploadAgents():
    try:
        prev = request.get_json()
        print(prev)
        params = { "name" : prev["name"], "mail": prev["mail"], "dept": prev["dept"], "company_id": prev["company_id"] }
        URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/insertAgentDetails.json"
        r = requests.get(url = URL, params = params)
        response = r.json()
        return jsonify({'message': response})
    except Exception as e:
        return jsonify({'message':'Failed'})

@app.route('/uploadCompany', methods=['POST'])
def uploadCompany():
    global company
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # print('upload_image filename: ' + filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        name = request.form["name"]
        email = request.form["email"]
        desc = request.form["desc"]
        number = request.form["number"]
        url = request.form["url"]
        params = { "name" : name, "email": email, "desc": desc, "number": number }
        URL = "https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/insertCompanyDetails.json"
        r = requests.get(url = URL, params = params)
        response = r.json()
        # print(response, params)
        company = response["id"]
        # print(company)
        if( company != 0 ):
            cos = ibm_boto3.resource("s3",
                ibm_api_key_id="xvCr40jBo0L5DBwqgqjYR6Mdn5T2Ix0Py-8Hhw7p2yxv",
                ibm_service_instance_id="crn:v1:bluemix:public:cloud-object-storage:global:a/ed1ba8ed327c43b4a5cff9c96489fd22:c75dbb13-1f2b-4c39-8527-756d80e4be6d::",
                config=Config(signature_version="oauth"),
                endpoint_url="https://s3.jp-tok.cloud-object-storage.appdomain.cloud"
            )
            filename = (request.files['file'].filename).replace(" ","_")
            ext = '.' in request.files['file'].filename and request.files['file'].filename.rsplit('.', 1)[1].lower()
            item_name = name+"."+ext
            bucket_name = 'company-logos'
            try:
                # print("Starting file transfer for {0} to bucket: {1}\n".format(item_name, bucket_name))
                # set 5 MB chunks
                part_size = 1024 * 1024 * 5

                # set threadhold to 15 MB
                file_threshold = 1024 * 1024 * 15

                # set the transfer threshold and chunk size
                transfer_config = ibm_boto3.s3.transfer.TransferConfig(
                    multipart_threshold=file_threshold,
                    multipart_chunksize=part_size
                )
                # the upload_fileobj method will automatically execute a multi-part upload
                # in 5 MB chunks for all files over 15 MB
                static = os.path.join(os.getcwd(), 'static')
                uploads = os.path.join(static, 'uploads')
                currentDir = os.path.join(uploads, '')
                with open(currentDir+filename, "rb") as file_data:
                    cos.Object(bucket_name, item_name).upload_fileobj(
                        Fileobj=file_data,
                        Config=transfer_config
                    )

                # print("Transfer for {0} Complete!\n".format(item_name))
            except ClientError as be:
                print("CLIENT ERROR: {0}\n".format(be))
                return jsonify({'message':'Failed'})
            except Exception as e:
                print("Unable to complete multi-part upload: {0}".format(e))
                return jsonify({'message':'Failed'})
        # rand = sm.sendMail(email, name, "confirm", url)
        print(company)
        return jsonify({'message':'success', 'company': company})
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')
        return redirect(request.url)

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