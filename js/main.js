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

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinDestination = document.querySelector('.map__pins');


// Глобальные функции

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
  return resultArray;
};


// Функции блока

var getAvatarLink = function (i) {
  var avatarNumber = '0' + (i + 1);
  return 'img/avatars/user' + avatarNumber + '.png';
};

var getSimilarOffer = function (i) {
  var locationX = getRandomInteger(0, MAP_WIDTH);
  var locationY = getRandomInteger(130, 630);

  return {
    author: {
      avatar: getAvatarLink(i)
    },
    offer: {
      title: 'Уютное гнездышко для молодоженов',
      address: locationX + ', ' + locationY,
      price: 42000,
      type: getRandomArrayValue(OFFER_TYPE),
      rooms: 3,
      guests: 6,
      checkin: getRandomArrayValue(CHECK_IN_TIMES),
      checkout: getRandomArrayValue(CHECK_OUT_TIMES),
      features: getRandomArray(FEATURES),
      description: 'Великолепный таун-хауз в центре Токио.',
      photos: getRandomArray(PHOTOS)
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

var createSimilarOfferPin = function (offerObject) {
  var offerPin = pinTemplate.cloneNode(true);
  offerPin.style.left = offerObject.location.x + 'px';
  offerPin.style.top = offerObject.location.y + 'px';
  offerPin.style.transform = 'translate(-50%, -100%)';
  offerPin.querySelector('img').src = offerObject.author.avatar;
  offerPin.querySelector('img').alt = offerObject.offer.title;
  return offerPin;
};

var getSimilarOfferPinsFragment = function (similarOffersArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarOffersArray.length; i++) {
    var offer = createSimilarOfferPin(similarOffersArray[i]);
    fragment.append(offer);
  }
  return fragment;
};

// mock
document.querySelector('.map').classList.remove('map--faded');

var similarOffersArray = getSimilarOffers(OFFERS_NUMBER);
var similarOfferPinsFragment = getSimilarOfferPinsFragment(similarOffersArray);
pinDestination.append(similarOfferPinsFragment);
