'use strict';

window.drag = (function () {
  return function () {

    var MAX_DRAG_DEFAULT_LIMIT = {
      top: -10000,
      right: 10000,
      bottom: 10000,
      left: -10000,
    };

    var dragLimit = {
      top: MAX_DRAG_DEFAULT_LIMIT.top,
      right: MAX_DRAG_DEFAULT_LIMIT.right,
      bottom: MAX_DRAG_DEFAULT_LIMIT.bottom,
      left: MAX_DRAG_DEFAULT_LIMIT.left
    };

    var handleElement;
    var draggedElement;
    var callback;
    var startPosition = {};

    var startCursorCoords = {};
    var shiftCursorCoords = {};
    var targetCSSPosition = {};


    var updateStartCursorCoords = function (evt) {
      startCursorCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
    };

    var updateShiftCursorCoords = function (evt) {
      shiftCursorCoords = {
        x: startCursorCoords.x - evt.clientX,
        y: startCursorCoords.y - evt.clientY
      };
    };

    var updateTargetCSSPosition = function () {
      targetCSSPosition = {
        left: draggedElement.offsetLeft - shiftCursorCoords.x,
        top: draggedElement.offsetTop - shiftCursorCoords.y
      };
    };

    var changeCSSPosition = function (isValidX, isValidY) {
      if (isValidX) {
        draggedElement.style.left = (targetCSSPosition.left) + 'px';
      }
      if (isValidY) {
        draggedElement.style.top = (targetCSSPosition.top) + 'px';
      }
    };

    var moveHandle = function (evt) {
      updateShiftCursorCoords(evt);
      updateTargetCSSPosition();

      var isValidX = targetCSSPosition.left >= dragLimit.left && targetCSSPosition.left <= dragLimit.right;
      var isValidY = targetCSSPosition.top >= dragLimit.top && targetCSSPosition.top <= dragLimit.bottom;

      if (isValidX || isValidY) {
        changeCSSPosition(isValidX, isValidY);
        updateStartCursorCoords(evt);
        if (typeof callback === 'function') {
          callback();
        }
      }
    };

    var onHandleMouseDown = function (evt) {
      evt.preventDefault();
      updateStartCursorCoords(evt);

      var onMouseMove = function (moveEvt) {
        moveHandle(moveEvt);
      };

      var onMouseUp = function (upEvt) {
        moveHandle(upEvt);
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
      startPosition.left = draggedElement.style.left;
      startPosition.top = draggedElement.style.top;

      handleElement.addEventListener('mousedown', onHandleMouseDown);
    };

    var deactivate = function () {
      if (draggedElement) {
        draggedElement.style.left = startPosition.left;
        draggedElement.style.top = startPosition.top;
      }
      if (handleElement) {
        handleElement.removeEventListener('mousedown', onHandleMouseDown);
      }
    };

    var setDragLimit = function (limits) {
      dragLimit = {
        top: limits.top,
        right: limits.right,
        bottom: limits.bottom,
        left: limits.left
      };
    };

    return {
      activate: activate,
      deactivate: deactivate,
      setDragLimit: setDragLimit
    };
  };
})();
