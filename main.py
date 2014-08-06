# -*- encoding: utf-8 -*-

import requests
import random
import string
import datetime
import json
from uuid import uuid4 as uuid
from flask import Flask, session, redirect, request, render_template, abort

app = Flask(__name__)
app.debug = True
app.secret_key = ',35çwo32rsaf wkbtasldçl2 '
app.permanent_session_lifetime = datetime.timedelta(60)

@app.before_request
def option():
    if request.method == 'OPTIONS':
        resp = app.make_default_options_response()
        headers = None
        if 'ACCESS_CONTROL_REQUEST_HEADERS' in request.headers:
            headers = request.headers['ACCESS_CONTROL_REQUEST_HEADERS']
        h = resp.headers
        h['Access-Control-Allow-Origin'] = request.headers['Origin']
        h['Access-Control-Allow-Methods'] = request.headers['Access-Control-Request-Method']
        h['Access-Control-Max-Age'] = "1000"
        if headers is not None:
            h['Access-Control-Allow-Headers'] = headers
        h['Access-Control-Allow-Credentials'] = 'true'
        return resp

@app.after_request
def set_allow_origin(resp):
    h = resp.headers
    if request.method != 'OPTIONS' and 'Origin' in request.headers:
        h['Access-Control-Allow-Origin'] = request.headers['Origin']
        h['Access-Control-Allow-Credentials'] = 'true'
    return resp

@app.route('/track', methods=['POST'])
def track():
    session['id'] = session.get('id', str(uuid()))
    request.get_data()
    body = request.json
    _id = '%s-%s' % (body['i'], body['d'])
    doc = {
        '_id': _id,
        'tid': body['i'],
        'page': request.referrer,
        'referrer': body['r'],
        'ip': request.remote_addr,
        'user-agent': request.headers['User-agent'],
        'event': body['e'],
        'value': body.get('v', 1),
        'session': session['id'],
        'date': body['d']
    }
    r = requests.put('http://spooner.alhur.es:5984/microanalytics/%s' % _id,
                     data=json.dumps(doc),
                     auth=('microanalytics', '43pbfibsalfk3q2b5rlw'))
    if r.ok:
        return 'ok'
    return r.text

@app.route('/')
def index():
    return render_template('index.html',
        tid=''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(15))
    )

@app.route('/<tid>')
def show(tid):
    return render_template('show.html', tid=tid)
