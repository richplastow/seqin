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

    # Create a Grid
    grid0 = new Seqin.Grid
      id:'g0'
      ctx: new window.AudioContext
      trackCount: 2

    # track0 = new Seqin.Track
    #   id:'t0'
    #   someParam: 'I am some kind of Track parameter'

    # grid0.attach track0, 123

    # clip0 = new Seqin.Clip
    #   id:'c0'
    #   someParam: 'I am some kind of Clip parameter'

    # track0.attach clip0, 123


    # grid1 = new Seqin.Grid
    #   id:'g1'
    #   ctx: new OfflineAudioContext 2, 44100*3, 44100
    #   trackCount: 1

    # Show a summary of the current Seqin setup
    log Seqin.list()

    # Visualise the Grid
    grid0.visualise _app.$container


  catch e
    error '04-basic-sequencer-init.coffee', e
