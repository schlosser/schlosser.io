from flask import Flask, redirect, render_template, \
	request, url_for, send_from_directory, session, flash
from flask.ext.basicauth import BasicAuth
import hashlib, json
from sys import argv
from data import flaskconfig

app = Flask(__name__)

# Debug configurations
debug =  len(argv) == 2 and argv[1] == "debug"
# SCSS rendering
from flask.ext.assets import Environment, Bundle
assets = Environment(app)
assets.url = app.static_url_path
scss_base = Bundle('scss/base.scss', 'scss/app.scss', filters='pyscss', output='css/base.css')
scss_blog =  Bundle('scss/blog.scss', filters='pyscss', output='css/blog.css')
assets.register('scss_base', scss_base)
assets.register('scss_blog', scss_blog)

# Authentication Setup
app.secret_key = flaskconfig.secret_key
basic_auth = BasicAuth(app)

sentences = json.dumps(json.loads(open("data/sentences.json", "r").read()))
blog_posts = json.loads(open("data/blogPosts.json", "r").read())
@app.route('/')
def home():
	return render_template("site.html", sentences = sentences)

@app.route('/blog')
def blog():
	return render_template("blog.html", sentences = sentences, posts=blog_posts)

@app.route('/blog/post-<post_id>')
def post(post_id):
	post = {}
	for p in blog_posts:
		if p["id"] == post_id:
			post = p
	return render_template("post.html", sentences=sentences, post=post)

@app.route('/all')
def all():
	return render_template("all.html", sentences = json.loads(sentences)["sentences"])

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
	if debug:
		app.run(debug=True, host="0.0.0.0")
	else:
		app.run()
