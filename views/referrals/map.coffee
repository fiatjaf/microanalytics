(doc) ->
  if doc.event == 'pageView' and doc.referrer
    sep = doc._id.indexOf '-'
    tid = doc._id.substr(0, sep)

    url = require('views/lib/urlparser').parse doc.referrer

    emit [tid, url.hostname, url.pathname, url.search, url.hash]
