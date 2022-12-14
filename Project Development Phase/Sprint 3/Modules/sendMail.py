import sendgrid
import random
from sendgrid.helpers.mail import *
from Modules import verificationTemplate
from Modules import chatLinkSession

def context(contextArea, username, link = None):
    if (contextArea == "verify"):
        rand = random.randint(1111,9999)
        return verificationTemplate.verification(username,rand), rand
    elif (contextArea == "session"):
        return chatLinkSession.chatLinkSession(username, "Chat?session="+link), 0

def sendMail(email, username, contextArea, link = None):
    area = context(contextArea, username, link)
    sg = sendgrid.SendGridAPIClient('*****************************************')
    from_email = Email("customercareregistry1@gmail.com")
    to_email = To(email)
    if (contextArea == "verify"):
        subject = "Verification Code"
    if (contextArea == "session"):
        subject = "start chat"
    getClient, rand = area
    content = Content("text/html", getClient)
    mail = Mail(from_email, to_email, subject, content)
    sg.client.mail.send.post(request_body=mail.get())
    return rand
