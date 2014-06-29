# -*- encoding: utf-8 -*-

import requests
import random
import string
import json
import datetime
from uuid import uuid4 as uuid
from flask import Flask, session, jsonify, redirect, request, render_template, abort

app = Flask(__name__)
app.debug = True
app.secret_key = ',35çwo32rsaf wkbtasldçl2 '
app.permanent_session_lifetime = datetime.timedelta(60)

@app.route('/track', methods=['POST'])
def track():
    session['id'] = session.get('id', uuid())
    body = json.loads(request.body)
    _id = '%s-%s' % (body['i'], body['d'])
    doc = {
        '_id': _id,
        'tid': body['i'],
        'page': request.referrer,
        'ip': request.remote_addr,
        'user-agent': request.headers['User-agent'],
        'event': body['e'],
        'value': body.get('v', 1),
        'session': session['id'],
        'date': body['d']
    }
    r = requests.put('http://couch.microanalytics:43pbfibsalfk3q2b5rlw@microanalytics.alhur.es/%s' % _id)
    if r.ok:
        return 'ok'

@app.route('/')
def index():
    return render_template('index.html',
        tid=''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(15))
    )

@app.route('/<tid>')
def show(tid):
    return render_template('show.html', tid=tid)
