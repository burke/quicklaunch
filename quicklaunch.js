(function(){
  var QuickLaunch, QuickLaunchModule;
  QuickLaunchModule = function(name, icon, relevance, performAction) {
    QuickLaunch.registerModule(this);
    this.name = name;
    this.icon = icon;
    this.relevance = relevance;
    this.performAction = performAction;
    return this;
  };
  QuickLaunchModule.prototype.drawerLi = function() {
    return "<li><img src='icons/" + this.icon + "'/>" + this.name + "</li>";
  };
  QuickLaunchModule.prototype.titleIcon = function() {
    return "<img src='icons/" + this.icon + "'/>";
  };

  QuickLaunch = (function() {
    var drawerDrillDown, drawerDrillUp, drawerIsDirty, drawerItems, drawerSelection, modules, moveDrawerSelectionDown, moveDrawerSelectionUp, qlInputChange, qlInputDrawerEvents, qlSubmit, qldrawer, qlform, qlinput, qltitleimage, redrawDrawer;
    qlform = null;
    qlinput = null;
    qldrawer = null;
    qltitleimage = null;
    drawerItems = ["asdf", "zxcv"];
    drawerSelection = 0;
    drawerIsDirty = true;
    redrawDrawer = function() {
      var _a, _b, _c, item;
      if (drawerIsDirty) {
        qldrawer.children("li").remove();
        _b = drawerItems;
        for (_a = 0, _c = _b.length; _a < _c; _a++) {
          item = _b[_a];
          qldrawer.append(item.drawerLi());
        }
        drawerIsDirty = false;
      }
      qldrawer.children("li").removeClass('selected');
      qldrawer.children(("li:nth(" + drawerSelection + ")")).addClass('selected');
      qltitleimage.children().remove();
      if (drawerItems.length > 0) {
        return qltitleimage.append(drawerItems[drawerSelection].titleIcon());
      }
    };
    drawerDrillDown = function() {
      return false;
    };
    drawerDrillUp = function() {
      return false;
    };
    moveDrawerSelectionUp = function() {
      drawerSelection -= 1;
      if (drawerSelection < 0) {
        drawerSelection = 0;
      }
      return redrawDrawer();
    };
    moveDrawerSelectionDown = function() {
      var len;
      drawerSelection += 1;
      len = drawerItems.length;
      if (drawerSelection > len - 1) {
        drawerSelection = len - 1;
      }
      return redrawDrawer();
    };
    qlInputDrawerEvents = function(evt) {
      var _a;
      if ((_a = evt.which) === 37) {
        // left
        drawerDrillUp();
        return false;
      } else if (_a === 38) {
        // up
        moveDrawerSelectionUp();
        return redrawDrawer();
      } else if (_a === 39) {
        // right
        drawerDrillDown();
        return false;
      } else if (_a === 40) {
        // down
        moveDrawerSelectionDown();
        return false;
      } else {
        return true;
      }
    };
    // The timeout is necessary here for the event to run after
    // the character is inserted... Not to mention not blocking the UI.
    qlInputChange = function(evt) {
      setTimeout((function() {
        var _a, _b, _c, module, text;
        drawerIsDirty = true;
        drawerSelection = 0;
        drawerItems = [];
        text = qlinput.val();
        _b = modules;
        for (_a = 0, _c = _b.length; _a < _c; _a++) {
          module = _b[_a];
          module.relevance(text) !== 0 ? drawerItems.push(module) : null;
        }
        drawerItems = _.sortBy(drawerItems, function(e) {
          return e.relevance(text);
        });
        // TODO don't calculate this twice
        return redrawDrawer();
      }), 0);
      return true;
    };
    qlSubmit = function(evt) {
      modules[drawerSelection].performAction(qlinput.val());
      return true;
    };
    modules = [];
    return {
      // public ###########################################################
      registerModule: function(module) {
        return modules.push(module);
      },
      showDrawer: function() {
        return qldrawer.fadeIn();
      },
      show: function() {
        qlform.fadeIn();
        qldrawer.fadeIn();
        qltitleimage.fadeIn();
        return qlinput.val("").focus();
      },
      hide: function() {
        qlform.fadeOut();
        qldrawer.fadeOut();
        qltitleimage.fadeOut();
        return qlinput.blur();
      },
      build: function() {
        $("body").append("<div id='quicklaunchcontainer'><div id='quicklaunchtitleimage'></div><form id='quicklaunch'><input/></form><ul id='quicklaunchdrawer'></div></div>");
        qlform = $("#quicklaunch");
        qlinput = $("#quicklaunch input");
        qldrawer = $("#quicklaunchdrawer");
        qltitleimage = $("#quicklaunchtitleimage");
        qlinput.blur(this.hide);
        qlinput.keydown(qlInputDrawerEvents);
        qlinput.keypress(qlInputChange);
        qlform.submit(qlSubmit);
        qlform.hide();
        return qldrawer.hide();
      }
    };
  })();
  new QuickLaunchModule("lookup customer by id", "customer.png", (function(text) {
    if (isNaN(text)) {
      return 0;
    } else {
      return 1;
    }
  }), (function(text) {
    return alert(("going to customer number " + text));
  }));
  new QuickLaunchModule("search for customer", "customer.png", (function() {
    return 0.5;
  }), (function(text) {
    return alert(("Searching for customer with '" + text + "'"));
  }));
  new QuickLaunchModule("lookup product by id", "product.png", (function(text) {
    if (isNaN(text)) {
      return 0;
    } else {
      return 1;
    }
  }), (function(text) {
    return alert(("going to product number " + text));
  }));
  $(function() {
    QuickLaunch.build();
    return $(document).keyup(function(evt) {
      var _a;
      if ((_a = evt.keyCode) === 191) {
        // /
        if (evt.shiftKey || evt.ctrlKey) {
          return true;
        }
        QuickLaunch.show();
        false;
      } else if (_a === 27) {
        // <esc>
        QuickLaunch.hide();
        false;
      } else {
        true;
      }
    });
  });
})();
