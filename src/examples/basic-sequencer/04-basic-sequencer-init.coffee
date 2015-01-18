# Set up the 'Basic Sequencer' example
window.addEventListener 'load', ->
  try
    # log 'Begin init...'

    # Get a reference to the app container
    _app.$container = $ '.basic-sequencer'
    if ! _app.$container then throw new Error "
      Cannot find the `.basic-sequencer` container element on the page.
      \nPlease add an HTML element like `<div class=\"basic-sequencer\"></div>`"

    # Get a reference to the Seqin sequencer library
    Seqin = window.Seqin
    if ! Seqin then throw new Error "
      Cannot find the `Seqin` sequencer library.
      \nLoad it before this script, eg `<script src=\"js/seqin.js\"></script>`"

    # Create an Audio Context, and connect it to the output speakers
    ctx = new window.AudioContext

    # Create a stereo Master track
    master0 = new Seqin.Master
      id:'m0'
      ctx: new window.AudioContext
      trackCount: 2

    # master1 = new Seqin.Master
    #   id:'m1'
    #   ctx: new OfflineAudioContext 2, 44100*3, 44100
    #   trackCount: 1

    # Show a summary of the current Seqin setup
    log Seqin.list()

    # Visualise the Master track
    master0.visualise _app.$container


  catch e
    error '04-basic-sequencer-init.coffee', e
