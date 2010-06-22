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

  QuickLaunch = (function() {
    var modules, qlInputChange, qlSubmit, qldrawer, qlform, qlinput;
    qlform = null;
    qlinput = null;
    qldrawer = null;
    // The timeout is necessary here for the event to run after
    // the character is inserted... Not to mention not blocking the UI.
    qlInputChange = function(evt) {
      setTimeout((function() {
        var _a, _b, _c, _d, module, text;
        text = qlinput.val();
        _a = []; _c = modules;
        for (_b = 0, _d = _c.length; _b < _d; _b++) {
          module = _c[_b];
          _a.push(module.relevance(text) !== 0 ? $("body").append("I'm relevant.") : null);
        }
        return _a;
      }), 0);
      return true;
    };
    qlSubmit = function(evt) {
      modules[0].performAction(qlinput.val());
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
        return qlinput.val("").focus();
      },
      hide: function() {
        qlform.fadeOut();
        qldrawer.fadeOut();
        return qlinput.blur();
      },
      build: function() {
        $("body").append("<div id='quicklaunchcontainer'><form id='quicklaunch'><input/></form><div id='quicklaunchdrawer'></div></div>");
        qlform = $("#quicklaunch");
        qlinput = $("#quicklaunch input");
        qldrawer = $("#quicklaunchdrawer");
        qlinput.change(qlInputChange);
        qlinput.blur(this.hide);
        qlinput.keypress(qlInputChange);
        qlform.submit(qlSubmit);
        qlform.hide();
        return qldrawer.hide();
      }
    };
  })();
  new QuickLaunchModule("lookup customer by id", "/images/icons/customer.png", (function(text) {
    if (isNaN(text)) {
      return 0;
    } else {
      return 1;
    }
  }), (function(text) {
    return alert(("going to customer number " + text));
  }));
  $(function() {
    QuickLaunch.build();
    return $(document).keyup(function(evt) {
      var _a;
      if ((_a = evt.keyCode) === 191) {
        // /
        QuickLaunch.show();
        return false;
      } else if (_a === 27) {
        // <esc>
        QuickLaunch.hide();
        return false;
      }
    });
  });
})();
