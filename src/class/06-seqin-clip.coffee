class Seqin.Clip extends Seqin.Base
  I: 'Seqin.Clip'
  toString: -> "[object #{@I}]"
  phase: 'init'

  constructor: (opt) ->
    @phase = 'construct'
    @initObject()        # ensure `_app.clips` and `_app.clipLut` exist
    @parseOptions opt    # validate options, and record them as properties
    @recordInstance()    # make this instance available in `_app`

    @validUA()           # ensure the user agent (usually a browser) is ready
    @buildElement()      # create the Web Audio nodes



  # Construct the model
  initObject: ->
    _app.clips   ?= []
    _app.clipLut ?= {}

  parseOptions: (opt) ->
    if 'undefined' == typeof opt then throw new Seqin.Error @,
      "The `opt` object was not passed to #{@I}, eg: \n
      `foo = new #{@I}({ id:'bar', ctx:MyCtx, trackCount:2 })`"
    if 'object' != typeof opt    then throw new Seqin.Error @,
      "The `opt` argument passed to #{@I} has type '#{typeof opt}' not 'object'"
    @id         = @validId         opt.id
    @src        = @validSrc        opt.src

  recordInstance: ->
    _app.clips.push @
    _app.clipLut[@id] = @



  # Helpers for `parseOptions()`
  validId: (id) ->
    idrx = /^[a-z][-a-z0-9]+$/
    if 'undefined' == typeof id then throw new Seqin.Error @,
      "#{@I} `id` is missing"
    if 'string' != typeof id    then throw new Seqin.Error @,
      "#{@I} `id` is type '#{typeof id}', not 'string'"
    if ! idrx.test id           then throw new Seqin.Error @,
      "#{@I} `id` '#{id}' fails #{idrx}"
    if _app.clipLut[id]        then throw new Seqin.Error @,
      "Duplicate #{@I} `id` '#{id}'"
    id

  validSrc: (src) ->
    srcrx = /^\[object AudioNode\]$/
    if 'undefined' == typeof src then throw new Seqin.Error @,
      "`src` of #{@I} `#{@id}` is missing."
    if 'object' != typeof src    then throw new Seqin.Error @,
      "`src` of #{@I} `#{@id}` has type '#{typeof src}' not 'object'"
    if ! ctxrx.test src          then throw new Seqin.Error @,
      "`src` of #{@I} `#{@id}` is invalid. It fails #{ctxrx}"
    src

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
    @$visual = make 'div', { class:'seqin clip', id:"clip-#{@id}" },
      "Seqin Clip #{@id}"
    $container.appendChild @$visual

  unvisualise: ->
    empty @$visual # @todo necessary?
    @$container.removeChild @$visual
    delete @$visual
    log @$visual



 