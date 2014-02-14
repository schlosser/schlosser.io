[danrs.ch](http://danrs.ch)
===========================

This is my personal website.  You can find out more about me there.

Setup
------

(in the top level directory)

    virtualenv --no-site-packages .
    source bin/activate
    pip install -r requirements.txt

Running
-------
    python app.py debug # Development
    python app.py       # Deployment
    # runs on localhost:5000

Debugging errors
----------------

### virtualenv isn't recognized or installed:

	sudo pip install virtualenv

### pip isn't recognized or installed:

	sudo easy_install pip
