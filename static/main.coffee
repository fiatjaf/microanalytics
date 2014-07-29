React = require 'react'
request = require 'superagent'

{div, canvas,
 table, thead, th, tbody, td, tr,
 ul, li, p, h3} = React.DOM

chartOptions =
  scaleShowGridLines: true
  scaleGridLineColor : "rgba(0,0,0,.05)"
  scaleGridLineWidth : 1
  bezierCurve : true
  bezierCurveTension : 7
  pointDotRadius : 4
  pointDotStrokeWidth : 1
  datasetStroke : true
  datasetStrokeWidth : 2
  datasetFill : true

Main = React.createClass
  getInitialState: ->
    events: []
    uniqueSessions: []

  componentDidMount: ->
    @fetchSessions()
    @fetchEvents()
  
  fetchEvents: ->
    request.get('http://spooner.alhur.es:5984/microanalytics/_all_docs')
           .set('Accept', 'application/json')
           .query(include_docs: true)
           .query(descending: true)
           .query(endkey: '"' + @props.tid + '-"')
           .query(startkey: '"' + @props.tid + '-\uffff"')
           .query(limit: 100)
           .end (res) =>
      @setState events: res.body.rows

  fetchSessions: ->
    request.get('http://spooner.alhur.es:5984/microanalytics/_design/webapp/_list/unique-sessions/page-views')
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
        (h3 {}, 'Total unique sessions'),
        (canvas ref: 'uniqueSessionsCanvas', width: 800)
      )
      (div {},
        (h3 {}, 'Events'),
        (table className: 'pure-table pure-table-horizontal',
          (thead {},
            (th {}, 'Event'),
            (th {}, 'Value'),
            (th {}, 'Date'),
            (th {}, 'Page'),
            (th {}, 'Session'),
            (th {}, 'Referrer')
          )
          (tbody {},
            (tr key: row.doc._id,
              (td {}, row.doc.event)
              (td {}, row.doc.value)
              (td {}, new Date(Date.parse row.doc.date).toString().split(' ').slice(1, -2).join(' '))
              (td {}, row.doc.page)
              (td {}, row.doc.session.slice(0, 7))
              (td {}, row.doc.referrer or '')
            ) for row in @state.events
          )
        )
      )
    )

elem = document.getElementById 'show'
React.renderComponent Main(tid: elem.dataset.tid), elem
