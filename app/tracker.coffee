post = require './micropost.coffee'
cuid = require 'lib/cuid'

homeurl = document.getElementById('ma').src.split('/').slice(0, -1).join('/')
session = localStorage.s
if not session
  session = cuid.slug()
  localStorage.s = session

send = (event, value) ->
  info =
    e: event
    v: value
    i: window.mai
    r: document.referrer
    s: session
  post homeurl + '/track', info, (text) ->
    console.log text

queue = window.maq
window.ma = (calling_args...) ->
  send.apply @, calling_args
for calling_args in queue
  send.apply @, calling_args
