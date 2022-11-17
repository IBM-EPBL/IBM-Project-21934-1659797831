import datetime

def createSession(name):
    add = 0
    for i in [*name]:
        add += ord(i)
    ct = datetime.datetime.now()
    return str(int(ct.timestamp()))+str(add)
