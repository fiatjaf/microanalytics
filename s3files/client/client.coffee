post = require './micropost.coffee'

send = (event, value) ->
  info =
    e: event
    v: value
    i: window.mai
    r: document.referrer
  post 'http://microanalytics.alhur.es/track', info, (text) ->
    console.log text

queue = window.maq
window.ma = (calling_args...) ->
  send.apply @, calling_args
for calling_args in queue
  send.apply @, calling_args
