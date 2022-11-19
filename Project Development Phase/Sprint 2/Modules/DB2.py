import ibm_db
from Modules import sessionCreation

def connectDB():
    global conn
    conn = ibm_db.connect("*****************************************************************************","", "")
    if conn :
        print('connected')
    else:
        print("failed to connect")

# print("DBS Name:", Server.DBMS_NAME)
# print("DB Version:", Server.DBMS_VER)
# print("DB Name:", Server.DB_NAME)

# createQuery = "create table Authentication (Username varchar(50) NOT NULL, Password varchar(20) NOT NULL)"

# create_table = ibm_db.exec_immediate(conn, createQuery)

def checkEmailExist(email):
    stmt = ibm_db.exec_immediate(conn, "select username from AUTHENTICATION where username='"+email+"';")
    entries = False
    while ibm_db.fetch_row(stmt) != False:
        entries = True
    return entries, "An Same Email is already Existing"

def createUserWithPassword(username, password):
    stmt = "insert into Authentication (Username, Password) values ('"+username+"', '"+ password+"');"
    if ibm_db.exec_immediate(conn, stmt):
        print("values Updated")

def getUsernameAndPasswords():
    stmt = ibm_db.exec_immediate(conn, "select * from Authentication")
    entries = 0
    while ibm_db.fetch_row(stmt) != False:
        entries += 1
        print("Username: ", ibm_db.result(stmt, 0))
    else:
        if(entries == 0):
            return "Not found"
    
    
def getCompanyDepartment(company_name):
    stmt = ibm_db.exec_immediate(conn,"select department_name from department where company_id = (select company_id from company where company_name = '"+ company_name +"');")
    department_name = []
    while ibm_db.fetch_row(stmt) != False:
        department_name.append(ibm_db.result(stmt, 0))
    dict = {'department': department_name}
    return dict
    
def getAgentDetails(department_name):
    stmt = ibm_db.exec_immediate(conn,"select agent_name, agent_mail from agentDetails where department='"+ department_name +"';")
    agent_name = []
    agent_mail = []
    while ibm_db.fetch_row(stmt) != False:
        agent_name.append(ibm_db.result(stmt, 0))
        agent_mail.append(ibm_db.result(stmt, 1))
    dict = { 'agentdetails': {'name': agent_name, 'mail': agent_mail}}
    return dict

def createUserProfile(name, email, number):
    stmt = "insert into UserProfileDetails (username , email , PhoneNumber) values ('"+name+"','"+email+"','"+number+"');"
    if ibm_db.exec_immediate(conn, stmt):
        print("values Inserted")

def getSessionDetails(session_id):
    stmt = ibm_db.exec_immediate(conn, "select username,email,phonenumber from userprofiledetails where email = (select username from AUTHENTICATION where session_logged = '"+ str(session_id) +"');")
    username = ''
    email = ''
    number = ''
    while ibm_db.fetch_row(stmt) != False:
        username = ibm_db.result(stmt, 0)
        email = ibm_db.result(stmt, 1)
        number = ibm_db.result(stmt, 2)
    dict = {'userDetails': {'name': username, 'mail': email, 'number': number} }
    return dict

def loginUser(username, password):
    stmt = ibm_db.exec_immediate(conn, "select password from AUTHENTICATION where username='"+username+"';")
    entries = 0
    while ibm_db.fetch_row(stmt) != False:
        entries += 1
        value = ibm_db.result(stmt, 0)
        print("Password: ", value)
        DBpassword = value
        if DBpassword != password:
            print("password Incorect")
            return False, "password Incorect"
        else:
            session_id = sessionCreation.createSession(username[:5])
            ibm_db.exec_immediate(conn, "UPDATE AUTHENTICATION SET SESSION_LOGGED ='"+ session_id +"' WHERE username='"+ username +"';")
            print(session_id)
            return True, "Success", session_id
    else:
        if(entries == 0):
            return "Not found"

def retrive_details(session_id):
    statement = ibm_db.exec_immediate(conn, "select username from AUTHENTICATION where SESSION_LOGGED='"+session_id+"';")
    while ibm_db.fetch_row(statement) != False:
        session_email = ibm_db.result(statement, 0)
        userDetailsStatement = ibm_db.exec_immediate(conn, "select * from UserProfileDetails where email='"+session_email+"';")
        while ibm_db.fetch_row(userDetailsStatement) != False:
            userDetails = {"Name : ": ibm_db.result(userDetailsStatement, 0), "Email ": ibm_db.result(userDetailsStatement, 1), "Number": ibm_db.result(userDetailsStatement, 2)}
    return userDetails

def fetchTicket():
    array = []
    stmt = ibm_db.exec_immediate(conn, "select * from TICKET;")
    while ibm_db.fetch_row(stmt) != False:
        stmt2 = ibm_db.exec_immediate(conn, "select * from CUSTOMER;")
        while ibm_db.fetch_row(stmt2) != False:
            if ibm_db.result(stmt2, 0) == ibm_db.result(stmt, 1):
                color = ''
                color_stmt = ibm_db.result(stmt, 2)
                if color_stmt == 'Opened':
                    color = 'green'
                elif color_stmt == 'Closed':
                    color = 'red'
                elif color_stmt == 'On Hold':
                    color = 'yellow'
                stmt3 = ibm_db.exec_immediate(conn, "select * from COMPANY;")
                while ibm_db.fetch_row(stmt3) != False:
                    if ibm_db.result(stmt3, 0) == ibm_db.result(stmt, 3):
                        data = {
                            'name': ibm_db.result(stmt2, 1),
                            'date':ibm_db.result(stmt, 5),
                            'email': ibm_db.result(stmt2, 2),
                            'ticket_status': {'color':color, 'message':ibm_db.result(stmt, 2)},
                            'ticket_id': ibm_db.result(stmt, 0),
                            'query': ibm_db.result(stmt, 4),
                            'company': ibm_db.result(stmt3, 1)
                        }
                        array.append(data)
    return array

def fetchAgentHistory(user):
    array = []
    stmt = ibm_db.exec_immediate(conn, "select * from ticket where ticket_id in (select TICKET_ID from AGENTTICKETS where Agent_id = (select AGENT_ID from AGENTDETAILS where AGENT_MAIL = (select username from AUTHENTICATION where SESSION_LOGGED = '"+ user +"')));")
    while ibm_db.fetch_row(stmt) != False:
        stmt2 = ibm_db.exec_immediate(conn, "select * from CUSTOMER;")
        while ibm_db.fetch_row(stmt2) != False:
            if ibm_db.result(stmt2, 0) == ibm_db.result(stmt, 1):
                color = ''
                color_stmt = ibm_db.result(stmt, 2)
                if color_stmt == 'Opened':
                    color = 'green'
                elif color_stmt == 'Closed':
                    color = 'red'
                elif color_stmt == 'On Hold':
                    color = 'yellow'
                stmt3 = ibm_db.exec_immediate(conn, "select * from COMPANY;")
                while ibm_db.fetch_row(stmt3) != False:
                    if ibm_db.result(stmt3, 0) == ibm_db.result(stmt, 3):
                        data = {
                            'name': ibm_db.result(stmt2, 1),
                            'date':ibm_db.result(stmt, 5),
                            'email': ibm_db.result(stmt2, 2),
                            'ticket_status': {'color':color, 'message':ibm_db.result(stmt, 2)},
                            'ticket_id': ibm_db.result(stmt, 0),
                            'query': ibm_db.result(stmt, 4),
                            'company': ibm_db.result(stmt3, 1)
                        }
                        array.append(data)
    return array


def fetchTicketHistory(user):
    array = []
    stmt = ibm_db.exec_immediate(conn, "select * from ticket where customer_id = (select customer_id from Customer where CUSTOMER_MAIL = (select username from AUTHENTICATION where SESSION_LOGGED = '"+ str(user) +"'))")
    while ibm_db.fetch_row(stmt) != False:
        stmt2 = ibm_db.exec_immediate(conn, "select * from CUSTOMER;")
        while ibm_db.fetch_row(stmt2) != False:
            if ibm_db.result(stmt2, 0) == ibm_db.result(stmt, 1):
                color = ''
                color_stmt = ibm_db.result(stmt, 2)
                if color_stmt == 'Opened':
                    color = 'green'
                elif color_stmt == 'Closed':
                    color = 'red'
                elif color_stmt == 'On Hold':
                    color = 'yellow'
                stmt3 = ibm_db.exec_immediate(conn, "select * from COMPANY;")
                while ibm_db.fetch_row(stmt3) != False:
                    if ibm_db.result(stmt3, 0) == ibm_db.result(stmt, 3):
                        data = {
                            'name': ibm_db.result(stmt2, 1),
                            'date':ibm_db.result(stmt, 5),
                            'email': ibm_db.result(stmt2, 2),
                            'ticket_status': {'color':color, 'message':ibm_db.result(stmt, 2)},
                            'ticket_id': ibm_db.result(stmt, 0),
                            'query': ibm_db.result(stmt, 4),
                            'company': ibm_db.result(stmt3, 1)
                        }
                        array.append(data)
    return array

