class Seqin.Base
  I: 'Seqin.Base'
  toString: -> "[object #{@I}]"
  phase: 'init'

  constructor: (opt) ->
    @phase = 'construct'




