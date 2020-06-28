'use strict';

(function () {
  var handleElement;
  var draggedElement;
  var callback;

  var onHandleMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftCoords = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      draggedElement.style.left = (draggedElement.offsetLeft - shiftCoords.x) + 'px';
      draggedElement.style.top = (draggedElement.offsetTop - shiftCoords.y) + 'px';

      callback();
    };


    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var activate = function (handle, dragged, cb) {
    handleElement = handle;
    draggedElement = (dragged) ? dragged : (handle);
    callback = cb;

    handleElement.addEventListener('mousedown', onHandleMouseDown);
  };

  var deactivate = function () {
    if (handleElement) {
      handleElement.removeEventListener('mousedown', onHandleMouseDown);
    }
  };

  window.drag = {
    activate: activate,
    deactivate: deactivate
  };

})();
