'use strict';

(function () {
  var KeyCode = {
    ENTER: 13,
    ESCAPE: 27
  };

  var getRandomInteger = function (min, max) {
    var randomNumber = min + Math.random() * (max + 1 - min);
    return Math.floor(randomNumber);
  };

  var changeCollectionAttribute = function (collection, attrName, attrValue) {
    // функция работает также с nodeList, поэтому forEach не применял
    for (var i = 0; i < collection.length; i++) {
      collection[i][attrName] = attrValue;
    }
  };

  // поиск в массиве объектов до первого соответствия
  var findArrayOfObjectsValue = function (arr, keyName, keyValue, returnKeyName) {
    var filteredArray = arr.filter(function (elem) {
      return elem[keyName] === keyValue;
    });

    return filteredArray[0][returnKeyName];
  };

  var isEscapePressEvent = function (evt, callback) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      callback();
    }
  };

  var isEnterPressEvent = function (evt, callback) {
    if (evt.keyCode === KeyCode.ENTER) {
      callback();
    }
  };

  var isLeftButtonMouseDown = function (evt, callback) {
    if (evt.which === 1) {
      callback();
    }
  };

  var isEmpty = function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  window.util = {
    getRandomInteger: getRandomInteger,
    changeCollectionAttribute: changeCollectionAttribute,
    findArrayOfObjectsValue: findArrayOfObjectsValue,
    isEscapePressEvent: isEscapePressEvent,
    isEnterPressEvent: isEnterPressEvent,
    isLeftButtonMouseDown: isLeftButtonMouseDown,
    isEmpty: isEmpty
  };

})();
