React = require 'react'
request = require 'superagent'

{div, pre} = React.DOM

Main = React.createClass
  getInitialState: ->
    events: []

  componentDidMount: ->
    @fetchPageViews()
    @fetchSessions()
    @fetchEvents()
  
  fetchEvents: ->
    request.get('http://microanalytics.couchappy.com/_all_docs')
           .set('Accept', 'application/json')
           .query(include_docs: true)
           .query(startkey: '"' + @props.tid + '-"')
           .query(endkey: '"' + @props.tid + '-\uffff"')
           .end (res) =>
      @setState events: res.body.rows

  fetchPageViews: ->
    

  fetchSessions: ->
    


  render: ->
    (div {},
      (pre {}, JSON.stringify doc, null, 2) for doc in @state.events
    )

elem = document.getElementById 'show'
React.renderComponent Main(tid: elem.dataset.tid), elem
