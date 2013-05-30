from flask import Flask, Blueprint, Response, make_response, redirect, render_template, \
	request, url_for, send_from_directory

app = Flask(__name__)
app.config['SERVER_NAME'] = 'danrs.ch'
app.url_map.default_subdomain = 'www'

www = Blueprint('www', 'www', subdomain='www')
# apps = Blueprint('apps', 'apps', subdomain='apps')
# 
# @apps.route('/')
# def apps():
# 	return render_template('apps.html')

@www.route('/rss.xml')
def rss():
	return send_from_directory(app.static_folder, request.path[1:])
	
@www.route('/admin/')
def admin():
	return render_template('admin.html')

@www.route('/blog/<post_id>/')
def post(post_id=""):
	d = dict(page='blog',post_id=post_id)
	return redirect(url_for('home', **d))

@www.route('/r/<resource>/')
def resource(resource=""):
	return render_template('iframe.html', resource=resource)

	@www.route('/dfa-demo/')
	def dfa():
		return render_template('dfa-demo.html')
	
@www.route('/<tab>/')
def yay(tab=""):
	redirects = ['dfa-demo', 'admin']
	if tab in redirects:
		return redirect(url_for(tab))
	d = dict(page=tab)
	return redirect(url_for('home', **d))

@www.route('/favicon.ico')
def icon():
	return url_for('static', filename='img/favicon.ico')
	
@www.route('/')
def home():
	keys = request.args.keys()
	if len(keys):
		request.args.get("post_id")
		return render_template('index.html', page=request.args.get("page"), post_id=request.args.get("post_id"))
	return render_template('index.html')


app.register_blueprint(www)
# app.register_blueprint(apps)
	
if __name__ == '__main__':
    app.run(debug=True)
