React = require 'react'
request = require 'superagent'

{div, pre} = React.DOM

Main = React.createClass
  getInitialState: ->
    events: []

  componentDidUpdate: ->
    request.get('http://couch.microanalytics.alhur.es/_all_docs')
           .set('Accept', 'application/json')
           .query(include_docs: true)
           .query(descending: true)
           .query(startkey: @props.tid + '-', endkey: @props.tid)
           .end (res) =>
      @setState events: res.body.rows

  render: ->
    (div {},
      (pre {}, JSON.stringify doc, null, 2) for doc in @state.events
    )

div = document.getElementById 'show'
React.renderComponent Main(div.tid), div
