from flask import Flask, Response, make_response, redirect, render_template, \
	request, url_for, send_from_directory, current_app, session, flash
from flask.ext.basicauth import BasicAuth
import hashlib, json
from data import flaskconfig

app = Flask(__name__)
data = json.loads(open("data/data.json", "r").read())
blogPosts = json.loads(open("data/blogPosts.json", "r").read())
app.secret_key = flaskconfig.secret_key
basic_auth = BasicAuth(app)

def checkCredentials(username, password):
	hashedUsername = hashlib.sha224(username).hexdigest()
	hashedPassword = hashlib.sha224(password).hexdigest()
	correctUsername = flaskconfig.userHash
	correctPassword = flaskconfig.passHash
	return hashedUsername == correctUsername and hashedPassword == correctPassword

class routes:
	
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

	@app.route('/blog/<post_id>/')
	def post(post_id=""):
		d = dict(page='blog',post_id=post_id)
		return redirect(url_for('home', **d))
	
	@app.route('/r/<resource>/')
	def resource(resource=""):
		return render_template('iframe.html', resource=resource)
	
	@app.route('/sp/<simplePage>/')
	def simplePage(simplePage=""):
		return render_template(simplePage+'.html')
	
 	@app.route('/dfa-demo/')
 	def dfa():
 		return render_template('dfa-demo.html')
		
	@app.route('/<tab>/')
	def yay(tab=""):
		redirects = ['dfa-demo', 'admin']
		if tab in redirects:
			return redirect(url_for(tab))
		d = dict(page=tab)
		return redirect(url_for('home', **d))

	@app.route('/favicon.ico')
	def icon():
		return url_for('static', filename='img/favicon.ico')
		
	@app.route('/')
	def home():
		print data["resources"][1]["html"]
		keys = request.args.keys()
		if len(keys):
			request.args.get("post_id")
			return render_template('index.html', data=data, blogPosts=blogPosts, page=request.args.get("page"), post_id=request.args.get("post_id"))
		return render_template('index.html', data=data, blogPosts=blogPosts)
	
if __name__ == '__main__':
    app.run(debug=True)
