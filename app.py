from flask import Flask, redirect, render_template, \
	request, url_for, send_from_directory, session, flash
from flask.ext.basicauth import BasicAuth
import hashlib
from sys import argv
from data import flaskconfig

app = Flask(__name__)


# Debug configurations
if len(argv) == 2 and argv[1] == "debug":
	app.config['DEBUG'] = True
	app.config['HOST'] = "0.0.0.0"

# SCSS rendering
if app.debug:
	from flask.ext.assets import Environment, Bundle
	assets = Environment(app)
	assets.url = app.static_url_path
	scss_base = Bundle('scss/base.scss', 'scss/app.scss', filters='pyscss', output='css/base.css')
	scss_blog =  Bundle('scss/blog.scss', filters='pyscss', output='css/blog.css')
	scss_home =  Bundle('scss/home.scss',  filters='pyscss', output='css/blog.css')
	assets.register('scss_base', scss_base)
	assets.register('scss_blog', scss_blog)
	assets.register('scss_home', scss_home)

# Authentication Setup
app.secret_key = flaskconfig.secret_key
basic_auth = BasicAuth(app)

@app.route('/')
def home():
	return render_template("index.html")

@app.route('/admin/')
def admin():
	if ("admin" in session and session["admin"]):
		return render_template('admin.html')
	return redirect(url_for("login"))

@app.route("/login", methods=["GET"])
def login():
	if ("admin" in session and session["admin"]):
		return redirect(url_for("admin"))
	return render_template('login.html')

@app.route("/login", methods=["POST"])
def validate():
	if checkCredentials(request.form.get("username"), request.form.get("password")):
		session["admin"] = True
		return redirect(url_for("admin"))
	flash("You typed an incorrect username / password combination.  Please try again.")
	return redirect(url_for("login"))

@app.route('/rss.xml')
def rss():
	return send_from_directory(app.static_folder, request.path[1:])

@app.route('/r/<resource>/')
def resource(resource=""):
	return render_template('iframe.html', resource=resource)

@app.route('/favicon.ico')
def icon():
	return url_for('static', filename='img/favicon.ico')

def checkCredentials(username, password):
	hashedUsername = hashlib.sha224(username).hexdigest()
	hashedPassword = hashlib.sha224(password).hexdigest()
	correctUsername = flaskconfig.userHash
	correctPassword = flaskconfig.passHash
	return hashedUsername == correctUsername and hashedPassword == correctPassword


if __name__ == '__main__':
	app.run()
