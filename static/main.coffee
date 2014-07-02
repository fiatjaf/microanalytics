React = require 'react'
request = require 'superagent'

{div, pre, canvas,
 h3} = React.DOM

chartOptions =
  scaleShowGridLines: true
  scaleGridLineColor : "rgba(0,0,0,.05)"
  scaleGridLineWidth : 1
  bezierCurve : true
  bezierCurveTension : 0.2
  pointDotRadius : 4
  pointDotStrokeWidth : 1
  datasetStroke : true
  datasetStrokeWidth : 2
  datasetFill : true
  legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

Main = React.createClass
  getInitialState: ->
    events: []
    pageViews: []

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
    request.get('http://microanalytics.couchappy.com/_design/webapp/_view/page-views')
           .set('Accept', 'application/json')
           .query(startkey: '["' + @props.tid + '"]')
           .query(endkey: '["' + @props.tid + '", {}]')
           .query(reduce: true, group_level: 2)
           .end (res) =>
      @setState pageViews: res.body.rows, ->
        @drawChart @state.pageViews, @refs.pageViewsCanvas

  fetchSessions: ->
    request.get('http://microanalytics.couchappy.com/_design/webapp/_list/unique-sessions/page-views')
           .set('Accept', 'application/json')
           .query(startkey: '["' + @props.tid + '"]')
           .query(endkey: '["' + @props.tid + '", {}]')
           .query(reduce: true, group_level: 3)
           .end (res) =>
      @setState uniqueSessions: res.body.rows, ->
        @drawChart @state.uniqueSessions, @refs.uniqueSessionsCanvas

  drawChart: (rows, canvasRef) ->
    if rows.length
      valueIndex = {}
      for r in rows
        valueIndex[r.key[1]] = r.value
      stringMinDay = rows[0].key[1]
      stringMaxDay = (new Date()).toISOString().split('T')[0]

      iterDay = new Date(Date.parse stringMinDay)
      iterDay.setDate iterDay.getDate()-1
      days = []
      values = []
      while iterDay.setDate(iterDay.getDate()+1)
        stringDay = iterDay.toISOString().split('T')[0]
        days.push "#{stringDay.split('-')[2]}/#{stringDay.split('-')[1]}"
        values.push valueIndex[stringDay] or 0
        if stringDay == stringMaxDay
          break

      ctx = canvasRef.getDOMNode().getContext('2d')
      chart = new Chart(ctx).Line
        labels: days
        datasets: [
          data: values
        ]
      , chartOptions

  render: ->
    (div {},
      (div {},
        (h3 {}, 'Total page views'),
        (canvas ref: 'pageViewsCanvas')
      )
      (div {},
        (h3 {}, 'Total unique sessions'),
        (canvas ref: 'uniqueSessionsCanvas')
      )
      (div {},
        (h3 {}, 'Events'),
        (pre {}, JSON.stringify doc, null, 2) for doc in @state.events
      )
    )

elem = document.getElementById 'show'
React.renderComponent Main(tid: elem.dataset.tid), elem
