from flask import Flask, Response, make_response, redirect, render_template, \
	request, url_for, send_from_directory, current_app
from flask.ext.basicauth import BasicAuth
import hashlib, json

app = Flask(__name__)
data = json.loads(open("data/data.json", "r").read())
blogPosts = json.loads(open("data/blogPosts.json", "r").read())
auth_keys = open("data/auth_keys", "r").read().split("\n")
app.config['BASIC_AUTH_USERNAME'] = auth_keys[0]
app.config['BASIC_AUTH_PASSWORD'] = auth_keys[1]

basic_auth = BasicAuth(app)

def _checkHashCredentials(self, username, password):
	hashedUsername = hashlib.sha224(username).hexdigest()
	hashedPassword = hashlib.sha224(password).hexdigest()
	correctUsername = current_app.config['BASIC_AUTH_USERNAME']
	correctPassword = current_app.config['BASIC_AUTH_PASSWORD']
	print username, password, hashedUsername, hashedPassword, correctUsername, correctPassword
	return hashedUsername == correctUsername and hashedPassword == correctPassword

BasicAuth.check_credentials = _checkHashCredentials

class routes:
	
	@app.route('/admin/')
	@basic_auth.required
	def admin():
		return render_template('admin.html')
	
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
