'use strict';

(function () {
  var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;
  var OFFERS_NUMBER = 4;
  var OFFER_TYPES = [
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
  var ROOMS = [
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
  var TYPE_PROPERTY_NAME = 'type';
  var MIN_PRICE_PROPERTY_NAME = 'minPrice';
  var TYPE_IN_RUSSIAN_NAME = 'typeInRussian';
  var CHECK_IN__OUT_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var PRICE_UNIT = '₽/ночь';


  var getAvatarLink = function (i) {
    var avatarNumber = '0' + (i + 1);
    return 'img/avatars/user' + avatarNumber + '.png';
  };

  var getSimilarOffer = function (i) {
    var locationX = window.util.getRandomInteger(0, MAP_WIDTH);
    var locationY = window.util.getRandomInteger(130, 630);

    return {
      author: {
        avatar: getAvatarLink(i)
      },
      offer: {
        title: 'Уютное гнездышко',
        address: locationX + ', ' + locationY,
        price: 42000,
        type: OFFER_TYPES[window.util.getRandomInteger(0, OFFER_TYPES.length - 1)].type,
        rooms: 3,
        guests: 6,
        checkInOut: window.util.getRandomArrayValue(CHECK_IN__OUT_TIMES),
        features: window.util.getRandomArray(FEATURES),
        description: 'Великолепный таун-хауз в центре Токио.',
        photos: window.util.getRandomArray(PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  };

  var getSimilarOffers = function (offersNumber) {
    var similarOffers = [];
    for (var i = 0; i < offersNumber; i++) {
      similarOffers.push(getSimilarOffer(i));
    }
    return similarOffers;
  };

  var getOfferTypeInRussian = function (offerTypeInEnglish) {
    return window.util.findArrayOfObjectsValue(
        OFFER_TYPES,
        TYPE_PROPERTY_NAME,
        offerTypeInEnglish,
        TYPE_IN_RUSSIAN_NAME
    );
  };

  var getMinPrice = function (offerType) {
    return window.util.findArrayOfObjectsValue(
        OFFER_TYPES,
        TYPE_PROPERTY_NAME,
        offerType,
        MIN_PRICE_PROPERTY_NAME);
  };


  window.data = {
    similarOffers: getSimilarOffers(OFFERS_NUMBER),
    getOfferTypeInRussian: getOfferTypeInRussian,
    getMinPrice: getMinPrice,
    OFFER_TYPES: OFFER_TYPES,
    PRICE_UNIT: PRICE_UNIT,
    ROOMS: ROOMS
  };

})();
