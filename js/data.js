'use strict';

(function () {
  var TYPE_PROPERTY_NAME = 'type';
  var MIN_PRICE_PROPERTY_NAME = 'minPrice';
  var TYPE_IN_RUSSIAN_NAME = 'typeInRussian';
  var PRICE_UNIT = '₽/ночь';

  var OfferTypes = [
    {
      type: 'palace',
      typeInRussian: 'Дворец',
      minPrice: 10000
    },
    {
      type: 'flat',
      typeInRussian: 'Квартира',
      minPrice: 1000
    },
    {
      type: 'house',
      typeInRussian: 'Дом',
      minPrice: 5000
    },
    {
      type: 'bungalo',
      typeInRussian: 'Бунгало',
      minPrice: 0
    },
  ];
  var Rooms = [
    {
      quantity: 1,
      minGuests: 1,
      maxGuests: 1,
      wrongCapacityMessage: '1 комната — «для 1 гостя»'
    }, {
      quantity: 2,
      minGuests: 1,
      maxGuests: 2,
      wrongCapacityMessage: '2 комнаты — «для 2 гостей» или «для 1 гостя»'
    }, {
      quantity: 3,
      minGuests: 1,
      maxGuests: 3,
      wrongCapacityMessage: '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»'
    }, {
      quantity: 100,
      minGuests: 0,
      maxGuests: 0,
      wrongCapacityMessage: '100 комнат — «не для гостей»'
    }
  ];

  var similarOffers = [];


  var updateSimilarOffers = function (data) {
    similarOffers = data;
  };

  var getSimilarOffers = function () {
    return similarOffers;
  };

  var getSimilarOffersFromServer = function (callback) {
    var onSuccess = function (data) {
      callback(data);
      updateSimilarOffers(data);
    };

    var onError = function (data) {
      window.messages.showError(data);
    };

    window.backend.load(onSuccess, onError);
  };

  var getOfferTypeInRussian = function (offerTypeInEnglish) {
    return window.util.findArrayOfObjectsValue(
        OfferTypes,
        TYPE_PROPERTY_NAME,
        offerTypeInEnglish,
        TYPE_IN_RUSSIAN_NAME
    );
  };

  var getMinPrice = function (offerType) {
    return window.util.findArrayOfObjectsValue(
        OfferTypes,
        TYPE_PROPERTY_NAME,
        offerType,
        MIN_PRICE_PROPERTY_NAME);
  };


  window.data = {
    getSimilarOffers: getSimilarOffers,
    getSimilarOffersFromServer: getSimilarOffersFromServer,
    getOfferTypeInRussian: getOfferTypeInRussian,
    getMinPrice: getMinPrice,
    PRICE_UNIT: PRICE_UNIT,
    Rooms: Rooms
  };

})();
