appName = 'basic-sequencer'
 
# Display logs
log = (html) ->
  console.log html
  $pre = $ '#log'
  if $pre
    if null == html then html = '[null]'
    html ?= '[undefined]'
    $pre.innerHTML += "\n#{appName}: " + indentLines escapeHTML html.toString()
    $pre.scrollTop = $pre.scrollHeight


# Display errors
error = (src, e) ->
  console.log "Error in #{src}:"
  console.log e
  $pre = $ '#log'
  if $pre
    $pre.innerHTML += "\n<em>Error in <b>#{src}</b>:
      \n  #{indentLines escapeHTML e.toString()}</em>"
    $pre.scrollTop = $pre.scrollHeight


# Various string helpers
escapeHTML = (html) ->
  html.replace /</g, '&lt;'

indentLines = (html) ->
  html.replace /\n/g, '\n  '


# Various DOM helpers (jQuery would be overkill for this simple app)
$  = document.querySelector.bind document # http://stackoverflow.com/a/12637169
$$ = document.querySelectorAll.bind document

make = (tag, attr, inner) ->
  el = document.createElement tag
  for k,v of attr
    el.setAttribute k, v
  if inner then el.innerHTML = inner
  return el

empty = (node) ->
  while node.hasChildNodes()
    node.removeChild node.lastChild
