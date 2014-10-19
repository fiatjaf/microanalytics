(doc, req) ->
  try
    data = JSON.parse req.body
  catch e
    data = req.form

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
