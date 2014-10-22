(newDoc, oldDoc, userCtx, secObj) ->
  throw forbidden: 'You can\'t modify documents.' if oldDoc

  v = require 'lib/validator'

  for key, val of newDoc
    if key[0] is '_'
      continue

    if val and typeof val is 'object'
      throw forbidden: key + ' is an object and this is forbidden.'

    if val.toString().length > 250 and key isnt 'page'
      throw forbidden: key + ' is too big.'

    switch key
      when 'date' then throw forbidden: 'date is not a real date.' unless v.isDate val
      when 'event' then throw forbidden: 'event is null.' if v.isNull val
      when 'ip' then throw forbidden: 'ip is not a real ip.' unless v.isIP val
      when 'page' then throw forbidden: 'page is not an URL.' unless v.isURL val
      when 'referrer' then throw forbidden: 'referrer is not an URL.' unless v.isURL val
      when 'value', 'user-agent', 'session', 'tid' then null
      else throw forbidden: key + ' is not an allowed key.'
