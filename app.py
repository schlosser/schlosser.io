from flask import Flask
from flask import render_template
from flask import redirect
from flask import url_for
from flask import request
from flask import make_response
from flask import Response

app = Flask(__name__)

# @app.route('/about/')
# def about():
#   print "There"
#   return redirect('/#about')
# 
# @app.route('/home/', alias=True)
# @app.route('/projects/', alias=True)
# @app.route('/resources/', alias=True)
# @app.route('/blog/', alias=True)
# @app.route('/index.html/', alias=True)

class routes:
	@app.route('/<tab>')
	def yay(tab=""):
		import sys
		sys.stdout.flush()
		d = dict(page=tab)
		print "request path:", request.path 
		print "recognizing tab:", tab
		print "d: ", d
		return redirect(url_for('home', **d))

	@app.route('/favicon.ico')
	def icon():
		return url_for('static', filename='img/favicon.ico')
		
		
	@app.route('/')
	def home():
		print "function: home"
		print "request.args = ", request.args
		keys = request.args.keys()
		if len(keys):
			print "passing key"
			return render_template('index.html', page=request.args.get("page"))
		print "no key"
		return render_template('index.html')
	
if __name__ == '__main__':
    app.run()