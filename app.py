from flask import Flask, Response, make_response, redirect, render_template, \
	request, url_for, send_from_directory

app = Flask(__name__)

class routes:
	
	@app.route('/rss.xml')
	def rss():
		return send_from_directory(app.static_folder, request.path[1:])
		
	@app.route('/admin/')
	def admin():
		return render_template('admin.html')
	
	@app.route('/blog/<post_id>/')
	def post(post_id=""):
		d = dict(page='blog',post_id=post_id)
		return redirect(url_for('home', **d))
	
	@app.route('/r/<resource>/')
	def resource(resource=""):
		return render_template('iframe.html', resource=resource)
	
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
		keys = request.args.keys()
		if len(keys):
			request.args.get("post_id")
			return render_template('index.html', page=request.args.get("page"), post_id=request.args.get("post_id"))
		return render_template('index.html')
	
if __name__ == '__main__':
    app.run(debug=True)
