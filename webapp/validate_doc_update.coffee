(_, _, user) ->
  throw forbidden: 'No one can ever upload anything.' if user.name isnt 'microanalytics'
