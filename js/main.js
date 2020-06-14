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
var PRICE_UNIT = '₽/ночь';
var offerTypesInRussian = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

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
  if (resultArray.length === 0) {
    resultArray = null;
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

var getSimilarOfferPinsFragment = function (similarOffers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarOffers.length; i++) {
    var offer = createSimilarOfferPin(similarOffers[i]);
    fragment.append(offer);
  }
  return fragment;
};

var addOfferCardFeatures = function (offerCard, features) {
  var offerFeaturesList = offerCard.querySelector('.popup__features');
  offerFeaturesList.innerHTML = '';
  if (Array.isArray(features) && features.length > 0) {
    for (var i = 0; i < features.length; i++) {
      var featureModClassName = 'popup__feature--' + features[i];
      var newFeatureListItem = document.createElement('li');
      newFeatureListItem.classList.add('popup__feature');
      newFeatureListItem.classList.add(featureModClassName);
      offerFeaturesList.append(newFeatureListItem);
    }
  } else {
    offerFeaturesList.remove();
  }
};

var addOfferCardThumbnails = function (offerCard, imageSources) {
  if (Array.isArray(imageSources) && imageSources.length > 0) {
    var offerPhoto = offerCard.querySelector('.popup__photo');

    for (var i = 0; i < imageSources.length; i++) {
      var photoElement = offerPhoto.cloneNode(true);
      photoElement.src = imageSources[i];
      offerPhoto.after(photoElement);
    }
    offerPhoto.remove();
  } else {
    offerCard.querySelector('.popup__photos').remove();
  }
};

var addContentOrRemove = function (parentElement, childSelector, property, content) {
  var childElement = parentElement.querySelector(childSelector);

  if (content) {
    childElement[property] = content;
  } else {
    childElement.remove();
  }
};

var getCapacity = function (similarOffer) {
  return similarOffer.offer.rooms + ' комнаты для ' + similarOffer.offer.guests + ' гостей';
};

var getTime = function (similarOffer) {
  return 'Заезд после ' + similarOffer.offer.checkin + ', выезд до ' + similarOffer.offer.checkout + '.';
};

var createOfferCard = function (similarOffers) {
  var offerCard = cardTemplate.cloneNode(true);

  addContentOrRemove(offerCard, '.popup__title', 'textContent', similarOffers[0].offer.title);
  addContentOrRemove(offerCard, '.popup__text--address', 'textContent', similarOffers[0].offer.address);
  addContentOrRemove(offerCard, '.popup__text--price', 'textContent', similarOffers[0].offer.price + PRICE_UNIT);
  addContentOrRemove(offerCard, '.popup__type', 'textContent', offerTypesInRussian[similarOffers[0].offer.type]);
  addContentOrRemove(offerCard, '.popup__text--capacity', 'textContent', getCapacity(similarOffers[0]));
  addContentOrRemove(offerCard, '.popup__text--time', 'textContent', getTime(similarOffers[0]));
  addContentOrRemove(offerCard, '.popup__description', 'textContent', similarOffers[0].offer.description);
  addContentOrRemove(offerCard, '.popup__avatar', 'src', similarOffers[0].author.avatar);
  addOfferCardFeatures(offerCard, similarOffers[0].offer.features);
  addOfferCardThumbnails(offerCard, similarOffers[0].offer.photos);
  return offerCard;
};

// mock
document.querySelector('.map').classList.remove('map--faded');

var similarOffers = getSimilarOffers(OFFERS_NUMBER);
var similarOfferPinsFragment = getSimilarOfferPinsFragment(similarOffers);
pinDestination.append(similarOfferPinsFragment);

var offerCard = createOfferCard(similarOffers);
cardDestination.before(offerCard);
