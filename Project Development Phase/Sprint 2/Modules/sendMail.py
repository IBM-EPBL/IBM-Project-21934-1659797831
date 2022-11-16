import sendgrid
import random
from sendgrid.helpers.mail import *
from Modules import verificationTemplate

def sendMail(email, username):
    sg = sendgrid.SendGridAPIClient('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')
    from_email = Email("customercareregistry1@gmail.com")
    to_email = To(email)
    subject = "Verification Code"
    rand = random.randint(1111,9999)
    getClient = verificationTemplate.verification(username,rand)
    content = Content("text/html", getClient)
    mail = Mail(from_email, to_email, subject, content)
    sg.client.mail.send.post(request_body=mail.get())
    return rand