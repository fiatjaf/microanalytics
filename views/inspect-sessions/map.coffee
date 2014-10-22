(doc) ->
  sep = doc._id.indexOf '-'
  tid = doc._id.substr(0, sep)
  date = doc._id.substr(sep+1)

  emit [tid, date, doc.session, doc.event], doc.value
