class QuickLaunchModule
  constructor: (name, icon, relevance, performAction) ->
    QuickLaunch.registerModule(this)
    @name:          name
    @icon:          icon
    @relevance:     relevance
    @performAction: performAction
  drawerLi: ->
    "<li><img src='icons/$@icon'/>$@name</li>"
  titleIcon: ->
    "<img src='icons/$@icon'/>"

QuickLaunch: (->
  qlform:   null
  qlinput:  null
  qldrawer: null
  qltitleimage: null

  drawerItems: ["asdf", "zxcv"]
  drawerSelection: 0
  drawerIsDirty: true

  redrawDrawer: ->
    if drawerIsDirty
      qldrawer.children("li").remove()
      for item in drawerItems
        qldrawer.append(item.drawerLi())
      drawerIsDirty: false
    qldrawer.children("li").removeClass('selected')
    qldrawer.children("li:nth($drawerSelection)").addClass('selected')
    qltitleimage.children().remove()
    if drawerItems.length > 0
      qltitleimage.append(drawerItems[drawerSelection].titleIcon())

  drawerDrillDown: ->
    false

  drawerDrillUp: ->
    false

  moveDrawerSelectionUp: ->
    drawerSelection -= 1
    drawerSelection = 0 if drawerSelection < 0
    redrawDrawer()

  moveDrawerSelectionDown: ->
    drawerSelection += 1
    len = drawerItems.length
    drawerSelection = len-1 if drawerSelection > len-1
    redrawDrawer()

  qlInputDrawerEvents: (evt) ->
    switch evt.which
      when 37 # left
        drawerDrillUp()
        false
      when 38 # up
        moveDrawerSelectionUp()
        redrawDrawer()
      when 39 # right
        drawerDrillDown()
        false
      when 40 # down
        moveDrawerSelectionDown()
        false
      else
        true

  # The timeout is necessary here for the event to run after
  # the character is inserted... Not to mention not blocking the UI.
  qlInputChange: (evt) ->
    setTimeout((->
      drawerIsDirty: true
      drawerSelection: 0
      drawerItems: []
      text = qlinput.val()
      for module in modules
        if module.relevance(text) != 0
          drawerItems.push(module)
      drawerItems: _.sortBy(drawerItems, (e) -> e.relevance(text)) # TODO don't calculate this twice
      redrawDrawer()
    ), 0)
    true

  qlSubmit: (evt) ->
    modules[drawerSelection].performAction(qlinput.val())
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
      qltitleimage.fadeIn()
      qlinput.val("").focus()

    hide: ->
      qlform.fadeOut()
      qldrawer.fadeOut()
      qltitleimage.fadeOut()
      qlinput.blur()

    build: ->
      $("body").append "<div id='quicklaunchcontainer'><div id='quicklaunchtitleimage'></div><form id='quicklaunch'><input/></form><ul id='quicklaunchdrawer'></div></div>"
      qlform = $("#quicklaunch")
      qlinput = $("#quicklaunch input")
      qldrawer = $("#quicklaunchdrawer")
      qltitleimage = $("#quicklaunchtitleimage")
      qlinput.blur this.hide
      qlinput.keydown  qlInputDrawerEvents
      qlinput.keypress qlInputChange
      qlform.submit qlSubmit
      qlform.hide()
      qldrawer.hide()
  }
)()


new QuickLaunchModule \
  "lookup customer by id",
  "customer.png",
  ((text) ->
    if isNaN(text)
      0
    else 1),
  ((text) -> alert("going to customer number $text"))

new QuickLaunchModule \
  "search for customer",
  "customer.png",
  (-> 0.5)
  ((text) -> alert("Searching for customer with '$text'"))

new QuickLaunchModule \
  "lookup product by id",
  "product.png",
  ((text) ->
    if isNaN(text)
      0
    else 1),
  ((text) -> alert("going to product number $text"))

$ ->
  QuickLaunch.build()
  $(document).keyup (evt) ->
    switch evt.keyCode
      when 191 # /
        return true if evt.shiftKey or evt.ctrlKey
        QuickLaunch.show()
        false
      when 27 # <esc>
        QuickLaunch.hide()
        false
      else true