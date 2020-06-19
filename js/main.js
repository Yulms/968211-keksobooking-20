'use strict';

var OFFERS_NUMBER = 4;
var MAP_WIDTH = document.querySelector('.map__pins').offsetWidth;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_IN__OUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PRICE_UNIT = '₽/ночь';
var offerTypesInRussian = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var offerTypesMinPrices = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalo: 0
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

var createSimilarOfferPin = function (offerObject) {
  var offerPin = pinTemplateElement.cloneNode(true);
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
  return 'Заезд после ' + similarOffer.offer.checkInOut + ', выезд до ' + similarOffer.offer.checkInOut + '.';
};

var createOfferCard = function (similarOffers) {
  var offerCard = cardTemplateElement.cloneNode(true);

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

var onMapPinMainElementMousedown = function (evt) {
  if (evt.which === 1) {
    activatePage();
  }
};

var onMapPinMainElementPressEnter = function (evt) {
  if (evt.key === 'Enter') {
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
  if (selectedRooms === 100 && selectedCapacity !== 0) {
    roomCapacityElement.setCustomValidity('100 комнат не рассчитано на прием гостей');
  } else if (selectedCapacity === 0 && selectedRooms !== 100) {
    roomCapacityElement.setCustomValidity('Не для гостей может быть только 100 комнат');
  } else if (selectedCapacity > selectedRooms) {
    roomCapacityElement.setCustomValidity('Гостей не может быть больше комнат');
  } else {
    roomCapacityElement.setCustomValidity('');
  }
  roomCapacityElement.reportValidity();

  return roomCapacityElement.checkValidity();
};

var onRoomsNumberElementChange = function () {
  validateRoomToCapacity(+roomsNumberElement.value, +roomCapacityElement.value);
};

var onRoomCapacityElementChange = function () {
  validateRoomToCapacity(+roomsNumberElement.value, +roomCapacityElement.value);
};

var onOfferTypeElementChange = function () {
  var minPrice = offerTypesMinPrices[offerTypeInputElement.value];
  priceInputElement.min = minPrice;
  priceInputElement.placeholder = 'минимум: ' + minPrice;
  if (+priceInputElement.value) {
    priceInputElement.reportValidity();
  }
};

var onFormSubmit = function (evt) {
  if (!validateRoomToCapacity(+roomsNumberElement.value, +roomCapacityElement.value)) {
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


var activatePage = function () {
  var similarOffers = getSimilarOffers(OFFERS_NUMBER);
  var similarOfferPinsFragment = getSimilarOfferPinsFragment(similarOffers);
  pinDestinationElement.append(similarOfferPinsFragment);
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

  fillAdressInput(getElementLocation(mapPinMainElement, true));

  // метод отрисовки карточки можно закомментировать до тех пор, пока вы не доберётесь до 2-й части задания, чтобы eslint не ругался
  // var offerCard = createOfferCard(similarOffers);
  // cardDestinationElement.before(offerCard);
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

  fillAdressInput(getElementLocation(mapPinMainElement, false));
};


deactivatePage();
