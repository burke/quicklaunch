(function(){
  var QuickLaunch;
  QuickLaunch = (function() {
    var qlInputChange, qlSubmit, qlform, qlinput;
    qlform = null;
    qlinput = null;
    qlInputChange = function(evt) {
      return true;
    };
    qlSubmit = function(evt) {
      return false;
    };
    return {
      // public ###########################################################
      trigger: function() {
        qlform.show();
        return qlinput.focus();
      },
      hide: function() {
        qlform.hide();
        return qlinput.blur().val("");
      },
      build: function() {
        $("body").append("<form id='quicklaunch'><input/></form>");
        qlform = $("#quicklaunch");
        qlinput = $("#quicklaunch input");
        qlinput.change(qlInputChange);
        qlinput.blur(this.hide);
        qlinput.keypress(qlInputChange);
        qlform.submit(qlSubmit);
        return qlform.hide();
      }
    };
  })();
  $(function() {
    QuickLaunch.build();
    return $(document).keyup(function(evt) {
      var _a;
      if ((_a = evt.keyCode) === 191) {
        // /
        QuickLaunch.trigger();
        return false;
      } else if (_a === 27) {
        // <esc>
        QuickLaunch.hide();
        return false;
      }
    });
  });
})();
