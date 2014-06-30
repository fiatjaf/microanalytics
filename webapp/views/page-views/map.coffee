(doc) ->
  if doc.event == 'pageView'
    day = doc.date.split('T')[0]
    emit [doc.tid, day, doc.session]
