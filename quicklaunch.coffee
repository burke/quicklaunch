class QuickLaunchModule
  constructor: (name, icon, relevance, performAction) ->
    QuickLaunch.registerModule(this)
    @name:          name
    @icon:          icon
    @relevance:     relevance
    @performAction: performAction

QuickLaunch: (->
  qlform:   null
  qlinput:  null
  qldrawer: null

  # The timeout is necessary here for the event to run after
  # the character is inserted... Not to mention not blocking the UI.
  qlInputChange: (evt) ->
    setTimeout((->
      text = qlinput.val()
      for module in modules
        if module.relevance(text) != 0
          $("body").append("I'm relevant.")
    ), 0)
    true

  qlSubmit: (evt) ->
    modules[0].performAction(qlinput.val())
    true

  modules: []

  return { # public ###########################################################
    registerModule: (module) ->
      modules.push(module)

    showDrawer: ->
      qldrawer.fadeIn()

    show: ->
      qlform.fadeIn()
      qldrawer.fadeIn()
      qlinput.val("").focus()

    hide: ->
      qlform.fadeOut()
      qldrawer.fadeOut()
      qlinput.blur()

    build: ->
      $("body").append "<div id='quicklaunchcontainer'><form id='quicklaunch'><input/></form><div id='quicklaunchdrawer'></div></div>"
      qlform = $("#quicklaunch")
      qlinput = $("#quicklaunch input")
      qldrawer = $("#quicklaunchdrawer")
      qlinput.change qlInputChange
      qlinput.blur this.hide
      qlinput.keypress qlInputChange
      qlform.submit qlSubmit
      qlform.hide()
      qldrawer.hide()
  }
)()


new QuickLaunchModule \
  "lookup customer by id",
  "/images/icons/customer.png",
  ((text) ->
    if isNaN(text)
      0
    else 1),
  ((text) -> alert("going to customer number $text"))

$ ->
  QuickLaunch.build()
  $(document).keyup (evt) ->
    switch evt.keyCode
      when 191 # /
        QuickLaunch.show()
        false
      when 27 # <esc>
        QuickLaunch.hide()
        false