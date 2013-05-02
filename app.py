from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/<page>/')
@app.route('/')
def home(page=""):
    validPages = ['home', 'about', 'projects', 'resources', 'blog']
    if page in validPages: 
        return render_template('index.html', page=page)
    return render_template('index.html')

if __name__ == '__main__':
    app.run()