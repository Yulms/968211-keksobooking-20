'use strict';

var OFFERS_NUMBER = 4;
var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;
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
var TYPE_PROPERTY_NAME = 'type';
var TYPE_IN_RUSSIAN_NAME = 'typeInRussian';
var MIN_PRICE_PROPERTY_NAME = 'minPrice';
var CHECK_IN__OUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PRICE_UNIT = '₽/ночь';
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
var KeyCodes = {
  ENTER: 13,
  ESCAPE: 27
};

var mapElement = document.querySelector('.map');
var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
var pinDestinationElement = mapElement.querySelector('.map__pins');
var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
var cardDestinationElement = mapElement.querySelector('.map__filters-container');
var mapFiltersFormElement = mapElement.querySelector('.map__filters');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');

var addOfferFormElement = document.querySelector('.ad-form');
var addressInputElement = addOfferFormElement.querySelector('#address');
var roomsNumberElement = addOfferFormElement.querySelector('#room_number');
var roomCapacityElement = addOfferFormElement.querySelector('#capacity');
var offerTypeInputElement = addOfferFormElement.querySelector('#type');
var priceInputElement = addOfferFormElement.querySelector('#price');
var offerCheckInInputElement = addOfferFormElement.querySelector('#timein');
var offerCheckOutInputElement = addOfferFormElement.querySelector('#timeout');


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
      type: OFFER_TYPES[getRandomInteger(0, OFFER_TYPES.length - 1)].type,
      rooms: 3,
      guests: 6,
      checkInOut: getRandomArrayValue(CHECK_IN__OUT_TIMES),
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

var similarOffers = getSimilarOffers(OFFERS_NUMBER);

var createSimilarOfferPin = function (offer, index) {
  var offerPin = pinTemplateElement.cloneNode(true);
  offerPin.style.left = offer.location.x + 'px';
  offerPin.style.top = offer.location.y + 'px';
  offerPin.style.transform = 'translate(-50%, -100%)';
  offerPin.dataset.id = index;
  offerPin.querySelector('img').src = offer.author.avatar;
  offerPin.querySelector('img').alt = offer.offer.title;
  return offerPin;
};

var getSimilarOfferPinsFragment = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarOffers.length; i++) {
    var offer = createSimilarOfferPin(similarOffers[i], i);
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
  return 'Заезд после ' + similarOffer.offer.checkInOut + ', выезд до ' + similarOffer.offer.checkInOut + '.';
};

var createOfferCardElement = function (offerData) {
  var offerCardElement = cardTemplateElement.cloneNode(true);

  addContentOrRemove(offerCardElement, '.popup__title', 'textContent', offerData.offer.title);
  addContentOrRemove(offerCardElement, '.popup__text--address', 'textContent', offerData.offer.address);
  addContentOrRemove(offerCardElement, '.popup__text--price', 'textContent', offerData.offer.price + PRICE_UNIT);
  addContentOrRemove(offerCardElement, '.popup__type', 'textContent', findArrayOfObjectsValue(OFFER_TYPES, TYPE_PROPERTY_NAME, offerData.offer.type, TYPE_IN_RUSSIAN_NAME));
  addContentOrRemove(offerCardElement, '.popup__text--capacity', 'textContent', getCapacity(offerData));
  addContentOrRemove(offerCardElement, '.popup__text--time', 'textContent', getTime(offerData));
  addContentOrRemove(offerCardElement, '.popup__description', 'textContent', offerData.offer.description);
  addContentOrRemove(offerCardElement, '.popup__avatar', 'src', offerData.author.avatar);
  addOfferCardFeatures(offerCardElement, offerData.offer.features);
  addOfferCardThumbnails(offerCardElement, offerData.offer.photos);

  offerCardElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
  document.addEventListener('keydown', onPopupCloseEscPress);

  return offerCardElement;
};

var onPopupCloseClick = function () {
  deleteOfferCardElement();
};

var onPopupCloseEscPress = function (evt) {
  if (evt.keyCode === KeyCodes.ESCAPE) {
    deleteOfferCardElement();
  }
};

var deleteOfferCardElement = function () {
  var openedOfferElement = document.querySelector('.map__card');
  if (openedOfferElement) {
    openedOfferElement.remove();
    document.removeEventListener('keydown', onPopupCloseEscPress);
  }
};

var onMapPinMainElementMousedown = function (evt) {
  if (evt.which === 1) {
    activatePage();
  }
};

var onMapPinMainElementPressEnter = function (evt) {
  if (evt.keyCode === KeyCodes.ENTER) {
    activatePage();
  }
};

var getElementLocation = function (element, isSharpEndMark) {
  var verticalOffset = (isSharpEndMark) ? (element.offsetTop + element.offsetHeight) : (element.offsetTop + element.offsetHeight / 2);
  return {
    x: Math.round(element.offsetLeft + element.offsetWidth / 2),
    y: Math.round(verticalOffset)
  };
};

var fillAdressInput = function (location) {
  addressInputElement.value = location.x + ', ' + location.y;
};

var validateRoomToCapacity = function (selectedRooms, selectedCapacity) {
  roomCapacityElement.setCustomValidity('');
  for (var i = 0; i < ROOMS.length; i++) {
    if (ROOMS[i].quantity === selectedRooms) {
      if (selectedCapacity < ROOMS[i].minGuests || selectedCapacity > ROOMS[i].maxGuests) {
        roomCapacityElement.setCustomValidity(ROOMS[i].wrongCapacityMessage);
        break;
      }
    }
  }
  roomCapacityElement.reportValidity();

  return roomCapacityElement.checkValidity();
};

var onRoomsNumberElementChange = function () {
  validateRoomToCapacity(parseInt(roomsNumberElement.value, 10), parseInt(roomCapacityElement.value, 10));
};

var onRoomCapacityElementChange = function () {
  validateRoomToCapacity(parseInt(roomsNumberElement.value, 10), parseInt(roomCapacityElement.value, 10));
};

var onOfferTypeElementChange = function () {
  var minPrice = findArrayOfObjectsValue(OFFER_TYPES, TYPE_PROPERTY_NAME, offerTypeInputElement.value, MIN_PRICE_PROPERTY_NAME);

  priceInputElement.min = minPrice;
  priceInputElement.placeholder = minPrice;
  if (+priceInputElement.value) {
    priceInputElement.reportValidity();
  }
};

var onFormSubmit = function (evt) {
  if (!validateRoomToCapacity(parseInt(roomsNumberElement.value, 10), parseInt(roomCapacityElement.value, 10))) {
    evt.preventDefault();
  }
};

var synchronizeTimeElements = function (baseElement, syncronizedElement) {
  syncronizedElement.value = baseElement.value;
};

var onCheckInElementChange = function () {
  synchronizeTimeElements(offerCheckInInputElement, offerCheckOutInputElement);
};

var onCheckOutElementChange = function () {
  synchronizeTimeElements(offerCheckOutInputElement, offerCheckInInputElement);
};

var addMapPins = function () {
  var similarOfferPinsFragment = getSimilarOfferPinsFragment(similarOffers);
  pinDestinationElement.append(similarOfferPinsFragment);
};

var onMapClick = function (evt) {
  var pinButton = evt.target.closest('.map__pin:not(.map__pin--main)');
  if (pinButton) {
    deleteOfferCardElement();
    var clickedPinData = similarOffers[pinButton.dataset.id];
    var offerCardElement = createOfferCardElement(clickedPinData);
    cardDestinationElement.before(offerCardElement);
  }
};


var activatePage = function () {
  addMapPins();
  mapElement.classList.remove('map--faded');
  addOfferFormElement.classList.remove('ad-form--disabled');
  changeCollectionAttribute(addOfferFormElement.children, 'disabled', false);
  changeCollectionAttribute(mapFiltersFormElement.children, 'disabled', false);

  mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMousedown);
  mapPinMainElement.removeEventListener('keydown', onMapPinMainElementPressEnter);
  roomsNumberElement.addEventListener('change', onRoomsNumberElementChange);
  roomCapacityElement.addEventListener('change', onRoomCapacityElementChange);
  offerTypeInputElement.addEventListener('change', onOfferTypeElementChange);
  offerCheckInInputElement.addEventListener('change', onCheckInElementChange);
  offerCheckOutInputElement.addEventListener('change', onCheckOutElementChange);
  addOfferFormElement.addEventListener('submit', onFormSubmit);
  pinDestinationElement.addEventListener('click', onMapClick);

  fillAdressInput(getElementLocation(mapPinMainElement, true));
};

var deactivatePage = function () {
  mapElement.classList.add('map--faded');
  addOfferFormElement.classList.add('ad-form--disabled');
  changeCollectionAttribute(addOfferFormElement.children, 'disabled', true);
  changeCollectionAttribute(mapFiltersFormElement.children, 'disabled', true);

  mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMousedown);
  mapPinMainElement.addEventListener('keydown', onMapPinMainElementPressEnter);
  roomsNumberElement.removeEventListener('change', onRoomsNumberElementChange);
  roomCapacityElement.removeEventListener('change', onRoomCapacityElementChange);
  offerTypeInputElement.removeEventListener('change', onOfferTypeElementChange);
  offerCheckInInputElement.removeEventListener('change', onCheckInElementChange);
  offerCheckOutInputElement.removeEventListener('change', onCheckOutElementChange);
  addOfferFormElement.removeEventListener('submit', onFormSubmit);
  pinDestinationElement.removeEventListener('click', onMapClick);

  fillAdressInput(getElementLocation(mapPinMainElement, false));
};


deactivatePage();
