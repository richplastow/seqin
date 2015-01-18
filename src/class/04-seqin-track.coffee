class Seqin.Track extends Seqin.Base
  I: 'Seqin.Track'
  toString: -> "[object #{@I}]"
  phase: 'init'

  constructor: (opt) ->
    @phase = 'construct'
    @initObject()        # ensure `_app.tracks` and `_app.trackLut` exist
    @parseOptions opt    # validate options, and record them as properties
    @recordInstance()    # make this instance available in `_app`

    @validUA()           # ensure the user agent (usually a browser) is ready
    @buildElement()      # create the Web Audio nodes



  # Construct the model
  initObject: ->
    _app.tracks   ?= []
    _app.trackLut ?= {}

  parseOptions: (opt) ->
    if 'undefined' == typeof opt then throw new Seqin.Error @,
      "The `opt` object was not passed to #{@I}, eg: \n
      `foo = new #{@I}({ id:'bar', ctx:MyCtx, trackCount:2 })`"
    if 'object' != typeof opt    then throw new Seqin.Error @,
      "The `opt` argument passed to #{@I} has type '#{typeof opt}' not 'object'"
    @id         = @validId         opt.id
    @parent     = @validParent     opt.parent

  recordInstance: ->
    _app.tracks.push @
    _app.trackLut[@id] = @



  # Helpers for `parseOptions()`
  validId: (id) ->
    idrx = /^[a-z][-a-z0-9]+$/
    if 'undefined' == typeof id then throw new Seqin.Error @,
      "#{@I} `id` is missing"
    if 'string' != typeof id    then throw new Seqin.Error @,
      "#{@I} `id` is type '#{typeof id}', not 'string'"
    if ! idrx.test id           then throw new Seqin.Error @,
      "#{@I} `id` '#{id}' fails #{idrx}"
    if _app.trackLut[id]        then throw new Seqin.Error @,
      "Duplicate #{@I} `id` '#{id}'"
    id

  validParent: (parent) ->
    parentrx = /^\[object Seqin.Grid\]$/
    if 'undefined' == typeof parent then throw new Seqin.Error @,
      "`parent` of #{@I} `#{@id}` is missing. \nMust be a Seqin.Grid instance"
    if 'object' != typeof parent    then throw new Seqin.Error @,
      "`parent` of #{@I} `#{@id}` has type '#{typeof parent}' not 'object'"
    if ! parentrx.test parent       then throw new Seqin.Error @,
      "`parent` of #{@I} `#{@id}` is invalid. \nIt fails #{parentrx}"
    parent



  # Construct the view
  validUA: ->
    if 'complete' != document.readyState then throw new Seqin.Error @,
      "`document.readyState` is currently '#{document.readyState}'. \n
      Please wait for 'complete', eg `window.addEventListener('load', ...)`"
    # @todo throw an error if the user agent is not capable

  buildElement: ->
    log "buildElement #{@id}"



  # @todo add more status information
  takeSnapshot: ->
    id: @id

  visualise: ($container) ->
    @$container = $container
    @$visual = make 'div', { class:'seqin track', id:"seqin-#{@id}" },
      "Seqin Track #{@id}"
    $container.appendChild @$visual

  unvisualise: ->
    empty @$visual # @todo necessary?
    @$container.removeChild @$visual
    delete @$visual
    log @$visual


 