'use strict';

(function () {
  var handleElement;
  var draggedElement;
  var callback;

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

  var checkMoveValidation = function () {
    // условия валидности по x:
    // center:
    // targetCSSPosition.left >= -draggedElement.offsetWidth / 2
    // targetCSSPosition.left <= draggedElement.offsetParent.offsetWidth - draggedElement.offsetWidth / 2
    // border:
    // targetCSSPosition.left >= 0
    // targetCSSPosition.left <= draggedElement.offsetParent.offsetWidth - draggedElement.offsetWidth

    // условия валидности по y:
    // center:
    // targetCSSPosition.top >= -draggedElement.offsetHeight / 2
    // targetCSSPosition.top <= draggedElement.offsetParent.offsetHeight - draggedElement.offsetHeight / 2
    // border:
    // targetCSSPosition.top >= 0
    // targetCSSPosition.top <= draggedElement.offsetParent.offsetHeight - draggedElement.offsetHeight
    // custom:
    //

    var validationResult = {};

    if (
      targetCSSPosition.left >= -draggedElement.offsetWidth / 2 &&
      targetCSSPosition.left <= draggedElement.offsetParent.offsetWidth - draggedElement.offsetWidth / 2
    ) {
      validationResult.x = true;
    } else {
      validationResult.x = false;
    }

    if (
      targetCSSPosition.top >= -draggedElement.offsetHeight / 2 &&
      targetCSSPosition.top <= draggedElement.offsetParent.offsetHeight - draggedElement.offsetHeight / 2
    ) {
      validationResult.y = true;
    } else {
      validationResult.y = false;
    }

    return validationResult;
  };

  var changeCSSPosition = function (isHorizontal, isVertical) {
    if (isHorizontal) {
      draggedElement.style.left = (targetCSSPosition.left) + 'px';
    }
    if (isVertical) {
      draggedElement.style.top = (targetCSSPosition.top) + 'px';
    }
  };


  var moveHandle = function (evt) {
    updateShiftCursorCoords(evt);
    updateTargetCSSPosition();

    var validationResult = checkMoveValidation();
    changeCSSPosition(validationResult.x, validationResult.y);
    if (validationResult.x || validationResult.y) {
      updateStartCursorCoords(evt);
      callback();
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
