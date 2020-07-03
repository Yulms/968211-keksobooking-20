'use strict';

(function () {
  var activatePage = function () {
    window.map.activate();
    window.form.activate();
  };

  var deactivatePage = function () {
    window.map.deactivate();
    window.form.deactivate();
  };

  window.main = {
    activatePage: activatePage,
    deactivatePage: deactivatePage
  };

  deactivatePage();

})();
