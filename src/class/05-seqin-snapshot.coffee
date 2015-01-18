# A Seqin sequencer can change its state continually.
# This class is used to record a snapshot of the current state.

class Seqin.Snapshot extends Seqin.Base
  I: 'Seqin.Snapshot'
  toString: -> "[object #{@I}]"
  phase: 'init'

  constructor: (opt) ->
    @phase = 'construct'
    @initObject()      # ensure `_app.masters` and `_app.masterlut` exist
    @parseOptions opt  # validate options, and record them as properties
    @takeSnapshot()    # take a snapshot when `Seqin.Snapshot` is constructed



  # Construct the model
  initObject: ->
    _app.masters   ?= []
    _app.masterLut ?= {}

  parseOptions: (opt) ->
    if 'undefined' == typeof opt then throw new Seqin.Error @,
      "The `opt` object was not passed to #{@I}, eg: \n`foo = new #{@I}({...})`"
    if 'object' != typeof opt    then throw new Seqin.Error @,
      "The `opt` argument passed to #{@I} has type '#{typeof opt}' not 'object'"
    @format = @validFormat opt.format

  takeSnapshot: ->
    @model =
      masters:   []
      masterLut: {}
    for master in _app.masters
      @model.masters.push @model.masterLut[master.id] = master.takeSnapshot()



  # Helpers for `parseOptions()`
  validFormat: (format) ->
    if 'undefined' == typeof format then throw new Seqin.Error @,
      "`format` is missing"
    if 'string' != typeof format    then throw new Seqin.Error @,
      "`format` is type '#{typeof format}', not 'string'"
    if ! renderers[format]          then throw new Seqin.Error @,
      "`format` '#{format}' is invalid. \nPlease use #{Object.keys renderers}"
    format



  # Render styles
  renderers =
    raw: (model) ->
      model
    arrays: (model) ->
      master: model.masters
    luts: (model) ->
      master: model.masterLut
    plain: (model) ->
      out = '\nSeqin.Master:'
      for master,i in model.masters
        out += "\n  ##{i} #{master.trackCount}-track '#{master.id}'"
      out

  render: ->
    renderers[@format](@model)


