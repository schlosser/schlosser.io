from flask import Flask, redirect, render_template, \
	request, url_for, session, flash
from flask.ext.basicauth import BasicAuth
from flask.ext.assets import Environment, Bundle
from sys import argv
from data import flaskconfig
import hashlib, json

app = Flask(__name__)

# Debug configurations
debug =  len(argv) == 2 and argv[1] == "debug"

# SCSS rendering
assets = Environment(app)
assets.url = app.static_url_path
scss_base = Bundle('scss/colors.scss', 'scss/base.scss', 'scss/app.scss', filters='pyscss', output='css/base.css', depends='scss/colors.scss')
scss_blog =  Bundle('scss/colors.scss', 'scss/blog.scss', filters='pyscss', output='css/blog.css', depends='scss/colors.scss')
scss_admin = Bundle('scss/colors.scss', 'scss/admin.scss', 'scss/login.scss', filters='pyscss', output='css/admin.css', depends='scss/colors.scss')
assets.register('scss_base', scss_base)
assets.register('scss_blog', scss_blog)
assets.register('scss_admin', scss_admin)

# Authentication Setup
app.secret_key = flaskconfig.secret_key
basic_auth = BasicAuth(app)

# Load Data from JSON
json_string = json.dumps(json.loads(open("data/sentences.json", "r").read()))
sentences = json.loads(json_string)["sentences"]
next_id = max(sentences, key=lambda k:k["_id"])["_id"] + 1
blog_posts = json.loads(open("data/blogPosts.json", "r").read())


@app.route('/')
def home():
	return render_template("site.html", sentences = json_string)

@app.route('/blog')
def blog():
	return render_template("blog.html", sentences = json_string, posts=blog_posts)

@app.route('/blog/post-<post_id>')
def post(post_id):
	post = {}
	for p in blog_posts:
		if p["id"] == post_id:
			post = p
	return render_template("post.html", sentences=json_string, post=post)

@app.route('/admin/sentences')
def view_sentences():
	if not ("admin" in session and session["admin"]):
		return redirect(url_for("login"))
	return render_template('sentences.html', sentences = sentences)

@app.route('/admin/sentences/add', methods=["POST"])
def add_sentence():
	global next_id
	if not ("admin" in session and session["admin"]):
		return redirect(url_for("login"))
	new_sentence = {
		"_id": next_id,
		"verb": request.form["verb"],
		"obj": request.form["obj"],
		"prep": request.form["prep"],
		"noun": request.form["noun"],
	}
	next_id += 1
	sentences.append(new_sentence)
	update_json()
	return redirect(url_for("view_sentences"))

@app.route('/admin/sentences/delete/<_id>', methods=["POST"])
def delete_sentence(_id):
	should_update = False
	for sentence in sentences:
		if sentence["_id"] == int(_id):
			sentences.remove(sentence)
			should_update = True
	if should_update:
		update_json()
	return redirect(url_for("view_sentences"))

@app.route('/admin/posts')
def posts():
	if not ("admin" in session and session["admin"]):
		return redirect(url_for("login"))
	return render_template('posts.html')

@app.route('/admin')
def admin():
	if not ("admin" in session and session["admin"]):
		return redirect(url_for("login"))
	return render_template('admin.html')

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
	flash("Incorrect username / password combination.")
	return redirect(url_for("login"))

@app.route('/favicon.ico')
def icon():
	return url_for('static', filename='img/favicon.ico')

@app.route('/robots.txt')
def robots():
	return url_for('static', filename='robots.txt')

def checkCredentials(username, password):
	hashedUsername = hashlib.sha224(username).hexdigest()
	hashedPassword = hashlib.sha224(password).hexdigest()
	correctUsername = flaskconfig.userHash
	correctPassword = flaskconfig.passHash
	return hashedUsername == correctUsername and hashedPassword == correctPassword

def update_json():
	string = json.dumps({"sentences": sentences}, sort_keys=True, indent=4, separators=(',', ': '))
	with open("data/sentences.json", "w") as f:
		f.write(string)
	json_string = string

if __name__ == '__main__':
	if debug:
		app.run(debug=True, host="0.0.0.0")
	else:
		app.run()
