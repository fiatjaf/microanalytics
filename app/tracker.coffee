post = require './micropost.coffee'

homeurl = document.getElementById('ma').src.split('/').slice(0, -1).join('/')

send = (event, value) ->
  info =
    e: event
    v: value
    i: window.mai
    d: (new Date).toISOString()
    r: document.referrer
  post homeurl + '/track', info, (text) ->
    console.log text

queue = window.maq
window.ma = (calling_args...) ->
  send.apply @, calling_args
for calling_args in queue
  send.apply @, calling_args
