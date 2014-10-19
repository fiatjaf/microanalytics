(doc) ->
  sep = doc._id.indexOf '-'
  tid = doc._id.substr(0, sep)
  date = doc._id.substr(sep+1)

  day = date.split('T')[0]
  emit [tid, day, doc.session]
