from flask import Flask
from flask import render_template
from flask import redirect
from flask import url_for
from flask import request
from flask import make_response
from flask import Response

app = Flask(__name__)

class routes:
 	@app.route('/dfa-demo')
 	def dfa():
 		print "dfa"
 		return render_template('dfa-demo.html')
		
	@app.route('/<tab>')
	def yay(tab=""):
		if tab == "dfa-demo":
			return redirect(url_for('dfa-demo'))
		print "tabbing to ", tab
		d = dict(page=tab)
		return redirect(url_for('home', **d))

	@app.route('/favicon.ico')
	def icon():
		return url_for('static', filename='img/favicon.ico')
		
	@app.route('/')
	def home():
		keys = request.args.keys()
		if len(keys):
			return render_template('index.html', page=request.args.get("page"))
		return render_template('index.html')
	
if __name__ == '__main__':
    app.run()