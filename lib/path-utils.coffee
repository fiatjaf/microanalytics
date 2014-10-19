getPathParts = (fullPathName) -> fullPathName.trim().split('/')
getHasRewrite = (pathParts) -> pathParts.indexOf('_rewrite') isnt -1
getBasePath = (pathParts, hasRewrite=true) ->
  if hasRewrite
    basePath = []
    for part in pathParts
      basePath.push part
      break if part == '_rewrite'
    return basePath.join '/'
  else
    return ''
getQuickBasePath = (fullPathName) ->
  pathParts = getPathParts fullPathName
  hasRewrite = getHasRewrite pathParts
  return getBasePath pathParts, hasRewrite

module.exports =
  getPathParts: getPathParts
  getHasRewrite: getHasRewrite
  getBasePath: getBasePath
  getQuickBasePath: getQuickBasePath
