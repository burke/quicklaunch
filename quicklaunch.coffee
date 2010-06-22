QuickLaunch: (->
  qlform: null
  qlinput: null

  qlInputChange: (evt) ->
    true

  qlSubmit: (evt) ->
    false

  return { # public ###########################################################
    trigger: ->
      qlform.show()
      qlinput.focus()

    hide: ->
      qlform.hide()
      qlinput.blur().val("")

    build: ->
      $("body").append "<form id='quicklaunch'><input/></form>"
      qlform = $("#quicklaunch")
      qlinput = $("#quicklaunch input")
      qlinput.change qlInputChange
      qlinput.blur this.hide
      qlinput.keypress qlInputChange
      qlform.submit qlSubmit
      qlform.hide()
  }
)()

$ ->
  QuickLaunch.build()
  $(document).keyup (evt) ->
    switch evt.keyCode
      when 191 # /
        QuickLaunch.trigger()
        false
      when 27 # <esc>
        QuickLaunch.hide()
        false