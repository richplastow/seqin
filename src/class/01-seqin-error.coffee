class Seqin.Error extends Error
  constructor: (instance, message) ->
    message = message.replace /\n\s+/g, '\n' # tidy up multiline strings
    @message = "#{instance.I} #{instance.phase}: #{message}"
