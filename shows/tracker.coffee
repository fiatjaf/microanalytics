(doc, req) ->
  widget = this.app.widget
  cuid = require 'lib/cuid'

  session = req.cookie.ma
  if not session
    session = cuid(req.uuid)

  return {
    code: 200
    body: widget
    headers:
      'Set-Cookie': "ma=#{session}; Max-Age=93312000"
      'Content-Type': 'application/javascript'
      'Cache-Control': 'max-age=86400; private'
  }
