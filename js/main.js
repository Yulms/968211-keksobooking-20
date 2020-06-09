'use strict';

var OFFERS_NUMBER = 4;
var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_IN_TIMES = ['12:00', '13:00', '14:00'];
var CHECK_OUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];


//
//
// Глобальные функции

var getRadomInteger = function (min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
};

var getRadomArrayValue = function (arr) {
  return arr[getRadomInteger(0, arr.length - 1)];
};

var getRadomArray = function (arr) {
  var resultArray = [];
  for (var i = 0; i < arr.length; i++) {
    if (Math.random() >= 0.5) {
      resultArray.push(arr[i]);
    }
  }
  return resultArray;
};


//
//
// Функции блока

var getAvatarLink = function (i) {
  var avatarNumber = '0' + (i + 1);
  return 'img/avatars/user' + avatarNumber + '.png';
};

var getSimilarOffer = function (i) {
  var locationX = getRadomInteger(0, MAP_WIDTH);
  var locationY = getRadomInteger(130, 630);

  return {
    author: {
      avatar: getAvatarLink(i)
    },
    offer: {
      title: 'Уютное гнездышко для молодоженов',
      address: locationX + ', ' + locationY,
      price: 42000,
      type: getRadomArrayValue(OFFER_TYPE),
      rooms: 3,
      guests: 6,
      checkin: getRadomArrayValue(CHECK_IN_TIMES),
      checkout: getRadomArrayValue(CHECK_OUT_TIMES),
      features: getRadomArray(FEATURES),
      description: 'Великолепный таун-хауз в центре Токио.',
      photos: getRadomArray(PHOTOS)
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


// mock
document.querySelector('.map').classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var createSimilarOffer = function (obj) {
  var offer = pinTemplate.cloneNode(true);
  offer.style.left = obj.location.x + 'px';
  offer.style.top = obj.location.y + 'px';
  offer.style.transform = 'translate(-50%, -100%)';
  offer.querySelector('img').src = obj.author.avatar;
  offer.querySelector('img').alt = obj.offer.title;
  return offer;
};

var renderSimilarOffers = function () {
  var fragment = document.createDocumentFragment();
  var similarOffersArray = getSimilarOffers(OFFERS_NUMBER);

  for (var i = 0; i < similarOffersArray.length; i++) {
    var offer = createSimilarOffer(similarOffersArray[i]);
    fragment.append(offer);
  }

  var pinDestination = document.querySelector('.map__pins');
  pinDestination.append(fragment);
};

renderSimilarOffers();
