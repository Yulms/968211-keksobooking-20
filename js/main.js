'use strict';

(function () {
  var activatePage = function () {
    window.map.activate();
    window.form.activate();
  };

  var deActivatePage = function () {
    window.map.deActivate();
    window.form.deActivate();
  };

  window.main = {
    activatePage: activatePage,
    deActivatePage: deActivatePage,

  };

  deActivatePage();

})();
