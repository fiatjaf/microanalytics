(doc, req) ->
  try
    data = JSON.parse req.body
  catch e
    data = req.form

  # try to get the date from the headers, then from a request parameter
  date = Date.parse(req.headers['Date'])
  if isNaN(date)
    date = Date.parse(data.d)

  # don't accept it if it is too strange
  if not isNaN(date) and 200000 > Math.abs (new Date).getTime() - date
    date = new Date(date).toISOString()
  else
    # fallback on our own date here
    date = (new Date).toISOString()

  doc =
    _id: data.i + '-' + date
    event: data.e
    value: data.v or 1
    ip: req.peer
    page: req.headers['Referer']
    session: data.s
    'user-agent': req.headers['User-agent']

  if data.r
    doc.referrer = data.r

  return [doc, 'ok']
