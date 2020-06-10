'use strict';

var OFFERS_NUMBER = 4;
var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_TYPE_RUSSIAN = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};
var CHECK_IN_TIMES = ['12:00', '13:00', '14:00'];
var CHECK_OUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PRICE_UNIT = '₽/ночь';

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinDestination = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var cardDestination = document.querySelector('.map__filters-container');


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
      title: 'Уютное гнездышко',
      address: locationX + ', ' + locationY,
      price: 42000,
      getFullPrice: function () {
        return this.price + PRICE_UNIT;
      },
      type: getRandomArrayValue(OFFER_TYPE),
      getTypeInRussian: function () {
        return OFFER_TYPE_RUSSIAN[this.type];
      },
      rooms: 3,
      guests: 6,
      getCapacity: function () {
        return this.rooms + ' комнаты для ' + this.guests + ' гостей';
      },
      checkin: getRandomArrayValue(CHECK_IN_TIMES),
      checkout: getRandomArrayValue(CHECK_OUT_TIMES),
      getTime: function () {
        return 'Заезд после ' + this.checkin + ', выезд до ' + this.checkout + '.';
      },
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

var createOfferCard = function (similarOffersArray) {
  var offerCard = cardTemplate.cloneNode(true);

  var removeExcessFeatures = function (featuresArray) {
    var offerFeaturesListItems = offerCard.querySelectorAll('.popup__features .popup__feature');

    for (var i = 0; i < offerFeaturesListItems.length; i++) {
      var isFound = false;
      for (var j = 0; j < featuresArray.length; j++) {
        if (offerFeaturesListItems[i].className.match(featuresArray[j])) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        offerFeaturesListItems[i].remove();
      }
    }
  };

  var addThumbnails = function (srcArray) {
    var offerPhoto = offerCard.querySelector('.popup__photo');

    for (var i = 0; i < srcArray.length; i++) {
      var photoElement = offerPhoto.cloneNode(true);
      photoElement.src = srcArray[i];
      offerPhoto.after(photoElement);
    }
    offerPhoto.remove();
  };

  offerCard.querySelector('.popup__title').textContent = similarOffersArray[0].offer.title;
  offerCard.querySelector('.popup__text--address').textContent = similarOffersArray[0].offer.address;
  offerCard.querySelector('.popup__text--price').textContent = similarOffersArray[0].offer.getFullPrice();
  offerCard.querySelector('.popup__type').textContent = similarOffersArray[0].offer.getTypeInRussian();
  offerCard.querySelector('.popup__text--capacity').textContent = similarOffersArray[0].offer.getCapacity();
  offerCard.querySelector('.popup__text--time').textContent = similarOffersArray[0].offer.getTime();
  offerCard.querySelector('.popup__description').textContent = similarOffersArray[0].offer.description;
  offerCard.querySelector('.popup__avatar').src = similarOffersArray[0].author.avatar;
  removeExcessFeatures(similarOffersArray[0].offer.features);
  addThumbnails(similarOffersArray[0].offer.photos);

  return offerCard;
};


// mock
document.querySelector('.map').classList.remove('map--faded');

var similarOffersArray = getSimilarOffers(OFFERS_NUMBER);
var similarOfferPinsFragment = getSimilarOfferPinsFragment(similarOffersArray);
pinDestination.append(similarOfferPinsFragment);

var offerCard = createOfferCard(similarOffersArray);
cardDestination.before(offerCard);
