(doc) ->
  if doc.event == 'pageView' and doc.page
    sep = doc._id.indexOf '-'
    tid = doc._id.substr(0, sep)

    url = require('views/lib/urlparser').parse doc.page

    emit [tid, url.hostname, url.pathname, url.search, url.hash]
