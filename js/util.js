'use strict';

(function () {
  var KeyCodes = {
    ENTER: 13,
    ESCAPE: 27
  };

  var getRandomInteger = function (min, max) {
    var randomNumber = min + Math.random() * (max + 1 - min);
    return Math.floor(randomNumber);
  };

  var getRandomArrayValue = function (arr) {
    return arr[getRandomInteger(0, arr.length - 1)];
  };

  var getRandomArray = function (arr) {
    var resultArray = [];
    for (var i = 0; i < arr.length; i++) {
      if (Math.random() >= 0.5) {
        resultArray.push(arr[i]);
      }
    }
    if (resultArray.length === 0) {
      resultArray = null;
    }
    return resultArray;
  };

  var changeCollectionAttribute = function (collection, attrName, attrValue) {
    for (var i = 0; i < collection.length; i++) {
      collection[i][attrName] = attrValue;
    }
  };

  // поиск в массиве объектов до первого соответствия
  var findArrayOfObjectsValue = function (arr, keyName, keyValue, returnKeyName) {
    var resultValue;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][keyName] === keyValue) {
        resultValue = arr[i][returnKeyName];
        break;
      }
    }
    return resultValue;
  };

  // поиск в массиве объектов до первого соответствия. Возвращает объект
  var findArrayOfObjectsObject = function (arr, keyName, keyValue) {
    var resultValue;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][keyName] === keyValue) {
        resultValue = arr[i];
        break;
      }
    }
    return resultValue;
  };

  var isEscapePressEvent = function (evt, callback) {
    if (evt.keyCode === KeyCodes.ESCAPE) {
      callback();
    }
  };

  var isEnterPressEvent = function (evt, callback) {
    if (evt.keyCode === KeyCodes.ENTER) {
      callback();
    }
  };

  var isLeftButtonMouseDown = function (evt, callback) {
    if (evt.which === 1) {
      callback();
    }
  };

  window.util = {
    getRandomInteger: getRandomInteger,
    getRandomArrayValue: getRandomArrayValue,
    getRandomArray: getRandomArray,
    changeCollectionAttribute: changeCollectionAttribute,
    findArrayOfObjectsValue: findArrayOfObjectsValue,
    findArrayOfObjectsObject: findArrayOfObjectsObject,
    isEscapePressEvent: isEscapePressEvent,
    isEnterPressEvent: isEnterPressEvent,
    isLeftButtonMouseDown: isLeftButtonMouseDown
  };

})();
