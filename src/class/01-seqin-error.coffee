###*
 * @class Custom error class to inform where an error is from
###
class Seqin.Error extends Error
  constructor: (instance, message) ->
    message = message.replace /\n\s+/g, '\n' # tidy up multiline strings
    @message = "#{instance.I} #{instance.phase}: #{message}"
