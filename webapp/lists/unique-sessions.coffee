->
  start
    headers:
      'content-type': 'application/json'
  send '{"rows":[\n  '
  currentDay = null
  firstRow = true
  while row = getRow()
    if row.key[1] != currentDay
      if currentDay isnt null
        send ',\n  ' if not firstRow
        send """{"key": ["#{row.key[0]}", "#{row.key[1]}"], "value": #{sessionCount}}"""
        firstRow = false
      sessionCount = 1
      currentDay = row.key[1]
    else
      sessionCount += 1
  send '\n]}'

###
 to be called as

http://microanalytics.couchappy.com/_design/webapp/_list/unique-sessions/page-views?startkey=[tid]&endkey=[tid, {}]&reduce=true&group_level=3

###
