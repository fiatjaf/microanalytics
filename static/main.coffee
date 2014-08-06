ReactLineChart = require 'react-charts-line'
request = require 'superagent'

{div,
 table, thead, th, tbody, td, tr,
 ul, li, p, h3} = React.DOM

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
      @setState uniqueSessions: res.body.rows

  render: ->
    data = ({
      x: Date.parse(r.key[1])
      y: r.value
    } for r in @state.uniqueSessions)

    (div {},
      (div {},
        (h3 {}, 'Total unique sessions'),
        (ReactLineChart
          data: data
          width: 960
          height: 300
          series:
            x:
              scale: 'time'
            y:
              scale: 'linear'
        )
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
