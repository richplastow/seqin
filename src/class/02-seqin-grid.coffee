class Seqin.Grid extends Seqin.Base
  I: 'Seqin.Grid'
  toString: -> "[object #{@I}]"
  phase: 'init'

  constructor: (opt) ->
    @phase = 'construct'
    @initObject()        # ensure `_app.grids` and `_app.gridLut` exist
    @parseOptions opt    # validate options, and record them as properties
    @recordInstance()    # make this instance available in `_app`

    @validUA()           # ensure the user agent (usually a browser) is ready
    @initTracks()      # create the initial Tracks



  # Construct the model
  initObject: ->
    _app.grids   ?= []
    _app.gridLut ?= {}

  parseOptions: (opt) ->
    if 'undefined' == typeof opt then throw new Seqin.Error @,
      "The `opt` object was not passed to #{@I}, eg:\n
      `foo = new #{@I}({ id:'bar', ctx:MyCtx, trackCount:2 })`"
    if 'object' != typeof opt    then throw new Seqin.Error @,
      "The `opt` argument passed to #{@I} has type '#{typeof opt}' not 'object'"
    @id         = @validId         opt.id
    @ctx        = @validCtx        opt.ctx
    @trackCount = @validTrackCount opt.trackCount

  recordInstance: ->
    _app.grids.push @
    _app.gridLut[@id] = @



  # Helpers for `parseOptions()`
  validId: (id) ->
    idrx = /^[a-z][-a-z0-9]+$/
    if 'undefined' == typeof id then throw new Seqin.Error @,
      "#{@I} `id` is missing"
    if 'string' != typeof id    then throw new Seqin.Error @,
      "#{@I} `id` is type '#{typeof id}', not 'string'"
    if ! idrx.test id           then throw new Seqin.Error @,
      "#{@I} `id` '#{id}' fails #{idrx}"
    if _app.gridLut[id]       then throw new Seqin.Error @,
      "Duplicate #{@I} `id` '#{id}'"
    id

  validCtx: (ctx) ->
    ctxrx = /^\[object (Offline)?AudioContext\]$/
    if 'undefined' == typeof ctx then throw new Seqin.Error @,
      "`ctx` of #{@I} `#{@id}` is missing."
    if 'object' != typeof ctx    then throw new Seqin.Error @,
      "`ctx` of #{@I} `#{@id}` has type '#{typeof ctx}' not 'object'"
    if ! ctxrx.test ctx          then throw new Seqin.Error @,
      "`ctx` of #{@I} `#{@id}` is invalid. It fails #{ctxrx}"
    ctx

  validTrackCount: (trackCount) ->
    if 'undefined' == typeof trackCount then throw new Seqin.Error @,
      "`trackCount` of #{@I} `#{@id}` is missing"
    if 'number' != typeof trackCount    then throw new Seqin.Error @,
      "`trackCount` of #{@I} `#{@id}` has type '#{typeof ctx}' not 'number'"
    if ! (1 <= trackCount <= 24)        then throw new Seqin.Error @,
      "`trackCount` of #{@I} `#{@id}` is `#{trackCount}`. Must be from 1 to 24"
    if trackCount % 1                   then throw new Seqin.Error @,
      "`trackCount` of #{@I} `#{@id}` is `#{trackCount}`. Must be an integer"
    trackCount



  # Construct the view
  validUA: ->
    if 'complete' != document.readyState then throw new Seqin.Error @,
      "`document.readyState` is currently '#{document.readyState}'. \n
      Please wait for 'complete', eg `window.addEventListener('load', ...)`"
    # @todo throw an error if the user agent is not capable

  initTracks: ->
    @tracks = []
    for i in [0..@trackCount-1]
      @tracks.push new Seqin.Track
        id: "#{@id}-track-#{i}"
        parent: @
    # log "initTracks #{@id}"



  # @todo add more status information
  takeSnapshot: ->
    id: @id
    trackCount: @trackCount

  visualise: ($container) ->
    @$container = $container
    @$visual = make 'div', { class:'seqin-grid', id:"seqin-#{@id}" },
      "Seqin Grid #{@id}"
    for track in @tracks
      track.visualise @$visual
    $container.appendChild @$visual

  unvisualise: ->
    for track in @tracks
      track.unvisualise
    empty @$visual # @todo necessary?
    @$container.removeChild @$visual
    delete @$visual
    log @$visual

