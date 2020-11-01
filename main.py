#!/usr/local/bin/python3.9
#
from bottle import Bottle, run, template, static_file, redirect, request, response, abort, ext, post
from tinydb import TinyDB, Query
import gunicorn, datetime, string, secrets

bottle = Bottle()

db = TinyDB('temporaldb.json')

@bottle.get("/")
def index():
    return template("templates/index")

@bottle.get("/p")
def p():
    return template("templates/p")

@bottle.get("/p<redir>")
def p_redir(redir):
    redirect("/p" + redir) # Redirect to catch any user mangling of URL ("/p%123...")

@bottle.get("/about")
def about():
    return template("templates/about")

@bottle.route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='./static')

@bottle.route('/robots.txt')
def serve_robots():
    return static_file('robots.txt', root='./static/')

@bottle.error(404)
def error404(error):
    return template("templates/404")

def make_pw_id():
    stringSource = string.ascii_letters \
        + string.digits \
        #+ string.punctuation
    password = secrets.choice(string.ascii_lowercase) \
        + secrets.choice(string.ascii_uppercase) \
        + secrets.choice(string.digits) \
        #+ secrets.choice(string.punctuation)

    for _ in range(7):
        password += secrets.choice(stringSource)

    char_list = list(password)
    secrets.SystemRandom().shuffle(char_list)
    password = ''.join(char_list)

    return password

@bottle.post("/new")
def new():
    ciphertext = request.POST.get("cipher").strip()
    days = int(request.POST.get("days").strip())

    if len(ciphertext) < 1 or len(ciphertext) > 8192 \
       or days < 1 or days > 30:
        abort(400, "Invalid options")

    ## Generate unique pw_id
    pw_id = make_pw_id()

    ## Compare to actual pw_id stored to be sure they're not already saved in the DB
    ## Generate new pw_id if so
    Password = Query()
    password = db.get(Password.pw_id == pw_id)

    if password:
        pw_result = password['pw_id']
        while (pw_id == pw_result):
            pw_id = make_pw_id()
            password = db.get(Password.pw_id == pw_id)
            if password:
                pw_result = password['pw_id']

    expire_date = datetime.datetime.now() + datetime.timedelta(days = days) 
    
    db.insert({'pw_id': pw_id, 'ciphertext': ciphertext, 'expire_date': str(expire_date)})
    
    return {"pw_id": pw_id}

@bottle.get("/get/<pw_id>")
def get(pw_id):
    Password = Query()
    password = db.get(Password.pw_id == pw_id)

    if not password:
        return {"cipher": None}

    expire_date = datetime.datetime.strptime(password['expire_date'], "%Y-%m-%d %H:%M:%S.%f")
    current_date = datetime.datetime.now()
    if expire_date < current_date: # Delete immediately if expired
        db.remove(Password.pw_id == pw_id)
        return {"cipher": None}

    db.remove(Password.pw_id == pw_id) # Only return encrypted password for a SINGLE viewing

    cipher = password['ciphertext']

    return {"cipher": cipher}


if __name__ == '__main__':
    run(bottle, host='0.0.0.0', port=8080, server='gunicorn')
    #run(bottle, host='localhost', port=8080, debug=True, reloader=True) # For local testing purposes only
