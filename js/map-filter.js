'use strict';

(function () {
  var filterFormElement = document.querySelector('.map__filters');

  var filterElementIdToDataField = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'filter-wifi': 'features',
    'filter-dishwasher': 'features',
    'filter-parking': 'features',
    'filter-washer': 'features',
    'filter-elevator': 'features',
    'filter-conditioner': 'features'
  };

  var ALL_VALUES = 'any';

  var stringToNumberPrice = {
    'low':
      {
        min: 0,
        max: 10000
      },
    'middle':
      {
        min: 10000,
        max: 50000
      },
    'high':
      {
        min: 50000,
        max: Infinity
      }
  };

  var data = [];
  var filteredData = [];
  var filterParameters = {};

  var specialFieldToCheckPassFunction = {
    'price': function (elementData) {
      var choosenValue = filterParameters.price;
      var minRange = stringToNumberPrice[choosenValue].min;
      var maxRange = stringToNumberPrice[choosenValue].max;
      return (elementData.offer.price >= minRange && elementData.offer.price < maxRange);
    },

    'features': function (elementData) {
      var choosenValue = filterParameters.features;
      var dataValue = elementData.offer.features;
      return choosenValue.every(function (elem) {
        return dataValue.includes(elem);
      });
    }
  };

  var formatChosenValueToData = {
    'rooms': Number,
    'guests': Number
  };


  var formatChoosenValue = function (filterField, choosenValue) {
    if (formatChosenValueToData.hasOwnProperty(filterField)) {
      return formatChosenValueToData[filterField](choosenValue);
    }
    return choosenValue;
  };


  var updatefilterParameters = function (filterField, choosenValue, checkValue) {
    if (choosenValue === ALL_VALUES) {
      delete filterParameters[filterField];
    } else {
      var formattedValue = formatChoosenValue(filterField, choosenValue);
      // Не массив? - тупо присваиваем значение
      if (checkValue === undefined) {
        filterParameters[filterField] = formattedValue;
      } else {
        // Массив. Если нужно добавить элемент массива (checkValue = true), проверяем есть ли свойство,
        // если есть - concat, если нет - присваиваем
        if (checkValue) {
          if (filterParameters.hasOwnProperty(filterField)) {
            filterParameters[filterField].push(formattedValue);
          } else {
            filterParameters[filterField] = formattedValue.split();
          }
        } else {
          // чек убран (checkValue = false) - удаляем элемент массива, если он был единственный - удаляем свойство у объекта
          filterParameters[filterField].splice(filterParameters[filterField].indexOf(formattedValue), 1);
          if (filterParameters[filterField].length === 0) {
            delete filterParameters[filterField];
          }
        }
      }
    }
  };


  var onFilterChange = function (evt) {
    var filterField = filterElementIdToDataField[evt.target.id];
    var choosenValue = evt.target.value;
    var checkValue = evt.target.checked;

    updatefilterParameters(filterField, choosenValue, checkValue);
    window.card.hide();
    filterData(null, window.map.renderMapPins);
  };


  var getFilterPass = function (elementData) {
    for (var filterParameter in filterParameters) {
      // проверка спец-свойств из словаря specialFieldToCheckPassFunction (цена и фичи в нашем случае).
      // Если в словаре спецсвойств существует свойство из filterParameters, проверяем функцией из словаря
      if (specialFieldToCheckPassFunction.hasOwnProperty(filterParameter)) {
        var passResult = specialFieldToCheckPassFunction[filterParameter](elementData);
        if (!passResult) {
          return false;
        }
      } else {
        var choosenValue = filterParameters[filterParameter];
        var dataValue = elementData.offer[filterParameter];
        if (choosenValue !== dataValue) {
          return false;
        }
      }
    }

    return true;
  };


  var filterData = function (serverData, callback) {
    if (Array.isArray(serverData)) {
      data = serverData;
    }

    if (!window.util.isEmpty(filterParameters)) {
      filteredData = data.filter(getFilterPass);
    } else {
      filteredData = data.slice();
    }

    callback(filteredData);
  };


  var activateFilter = function () {
    window.util.changeCollectionAttribute(filterFormElement.children, 'disabled', false);
    filterFormElement.addEventListener('change', onFilterChange);
  };


  var deactivateFilter = function () {
    window.util.changeCollectionAttribute(filterFormElement.children, 'disabled', true);
    filterFormElement.removeEventListener('change', onFilterChange);
    filterFormElement.reset();
    data = [];
    filteredData = [];
    filterParameters = {};
  };


  window.mapFilter = {
    filterData: filterData,
    getFilteredData: function () {
      return filteredData;
    },
    activate: activateFilter,
    deactivate: deactivateFilter
  };

})();
