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

  var ANY_VALUE = 'any';

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

  var FilteredTagName = {
    SELECT: 'SELECT',
    INPUT: 'INPUT'
  };

  var FilteredTagType = {
    CHECKBOX: 'checkbox'
  };

  var filteredControlTypeSelector = {
    SELECT: 'SELECT',
    CHECKBOX: '[type=checkbox]'
  };


  var updateFilterParametersByControlType = {
    SELECT: function (elem, dataFieldName) {
      filterParameters[dataFieldName] = (elem.value === ANY_VALUE) ? null : elem.value;
    },
    CHECKBOX: function (elem, dataFieldName) {
      if (!filterParameters.hasOwnProperty(dataFieldName)) {
        filterParameters[dataFieldName] = [];
      }
      if (elem.checked) {
        filterParameters[dataFieldName].push(elem.value);
      }
    }
  };


  // динамическое формирование filterParameters по разметке при активации фильтра
  var initializeFilterParameters = function () {
    for (var control in filteredControlTypeSelector) {
      if (filteredControlTypeSelector.hasOwnProperty(control)) {
        var selectElements = filterFormElement.querySelectorAll(filteredControlTypeSelector[control]);
        selectElements.forEach(function (elem) {
          var dataFieldName = filterElementIdToDataField[elem.id];
          updateFilterParametersByControlType[control](elem, dataFieldName);
        });
      }
    }
  };


  var formatChoosenValue = function (filterField, choosenValue) {
    if (formatChosenValueToData.hasOwnProperty(filterField)) {
      return formatChosenValueToData[filterField](choosenValue);
    }
    return choosenValue;
  };


  var getChangedTagInfo = function (evt) {
    return {
      tagName: evt.target.tagName,
      type: evt.target.type
    };
  };


  var updatefilterParametersFromSelectTag = function (filterField, choosenValue) {
    filterParameters[filterField] = (choosenValue === ANY_VALUE) ? null : formatChoosenValue(filterField, choosenValue);
  };


  var updateFilterParametersFromCheckbox = function (filterField, choosenValue, shouldAddFilterParameter) {
    if (shouldAddFilterParameter) {
      filterParameters[filterField].push(choosenValue);
    } else {
      filterParameters[filterField].splice(filterParameters[filterField].indexOf(choosenValue), 1);
    }
  };


  var updatefilterParameters = function (evt) {
    var filterField = filterElementIdToDataField[evt.target.id];
    var choosenValue = evt.target.value;
    var changedTag = getChangedTagInfo(evt);

    if (changedTag.tagName === FilteredTagName.SELECT) {
      updatefilterParametersFromSelectTag(filterField, choosenValue);
    } else if (changedTag.tagName === FilteredTagName.INPUT && changedTag.type === FilteredTagType.CHECKBOX) {
      var shouldAddFilterParameter = evt.target.checked;
      updateFilterParametersFromCheckbox(filterField, choosenValue, shouldAddFilterParameter);
    }
  };


  var onFilterChange = function (evt) {
    window.debounce(function () {
      updatefilterParameters(evt);
      window.card.hide();
      filterData(null, window.map.renderMapPins);
    })();
  };


  var isFilterPassed = function (elementData) {
    for (var filterParameter in filterParameters) {
      if (filterParameters.hasOwnProperty(filterParameter)) {
        if ((filterParameters[filterParameter] !== null) ||
          (Array.isArray(filterParameters[filterParameter]) && filterParameters[filterParameter].length !== 0)) {
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
      }
    }

    return true;
  };


  var filterData = function (serverData, callback) {
    if (Array.isArray(serverData)) {
      data = serverData;
    }

    filteredData = (window.util.isEmpty(filterParameters)) ? data.slice() : data.filter(isFilterPassed);

    callback(filteredData);
  };


  var activateFilter = function () {
    window.util.changeCollectionAttribute(filterFormElement.children, 'disabled', false);
    filterFormElement.addEventListener('change', onFilterChange);
    initializeFilterParameters();
  };


  var clearState = function () {
    data = [];
    filteredData = [];
    filterParameters = {};
  };


  var deactivateFilter = function () {
    window.util.changeCollectionAttribute(filterFormElement.children, 'disabled', true);
    filterFormElement.removeEventListener('change', onFilterChange);
    filterFormElement.reset();
    clearState();
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
