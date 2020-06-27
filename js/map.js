'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinDestinationElement = mapElement.querySelector('.map__pins');

  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapFiltersFormElement = mapElement.querySelector('.map__filters');

  var createSimilarOfferPinElement = function (offer, index) {
    var offerPinElement = pinTemplateElement.cloneNode(true);
    offerPinElement.style.left = offer.location.x + 'px';
    offerPinElement.style.top = offer.location.y + 'px';
    offerPinElement.style.transform = 'translate(-50%, -100%)';
    offerPinElement.dataset.id = index;
    offerPinElement.querySelector('img').src = offer.author.avatar;
    offerPinElement.querySelector('img').alt = offer.offer.title;
    return offerPinElement;
  };

  var getSimilarOfferPinsFragment = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.similarOffers.length; i++) {
      var offer = createSimilarOfferPinElement(window.data.similarOffers[i], i);
      fragment.append(offer);
    }
    return fragment;
  };

  var getElementLocation = function (element, isSharpEndMark) {
    var verticalOffset = (isSharpEndMark) ? (element.offsetTop + element.offsetHeight) : (element.offsetTop + element.offsetHeight / 2);
    return {
      x: Math.round(element.offsetLeft + element.offsetWidth / 2),
      y: Math.round(verticalOffset)
    };
  };

  var getMainPinVerticalCenterLocation = getElementLocation(mapPinMainElement, true);
  var getMainPinVerticalBottomLocation = getElementLocation(mapPinMainElement, false);

  var addMapPins = function () {
    var similarOfferPinsFragment = getSimilarOfferPinsFragment(window.data.similarOffers);
    pinDestinationElement.append(similarOfferPinsFragment);
  };

  var removeMapPins = function () {
    var mapPinElement = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinElement.forEach(function (item) {
      item.remove();
    });
  };

  var onMapPinMainElementMousedown = function (evt) {
    window.util.isLeftButtonMouseDown(evt, window.main.activatePage);
  };

  var onMapPinMainElementPressEnter = function (evt) {
    window.util.isEnterPressEvent(evt, window.main.activatePage);
  };

  var onPinClick = function (evt) {
    var pinButton = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (pinButton) {
      window.card.showOfferCardElement(pinButton.dataset.id);
    }
  };

  var activateMap = function () {
    addMapPins();
    mapElement.classList.remove('map--faded');
    window.util.changeCollectionAttribute(mapFiltersFormElement.children, 'disabled', false);
    mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMousedown);
    mapPinMainElement.removeEventListener('keydown', onMapPinMainElementPressEnter);
    pinDestinationElement.addEventListener('click', onPinClick);
  };

  var deActivateMap = function () {
    removeMapPins();
    mapElement.classList.add('map--faded');
    window.util.changeCollectionAttribute(mapFiltersFormElement.children, 'disabled', true);
    mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMousedown);
    mapPinMainElement.addEventListener('keydown', onMapPinMainElementPressEnter);
    pinDestinationElement.removeEventListener('click', onPinClick);
  };


  window.map = {
    activate: activateMap,
    deActivate: deActivateMap,
    getMainPinVerticalCenterLocation: getMainPinVerticalCenterLocation,
    getMainPinVerticalBottomLocation: getMainPinVerticalBottomLocation
  };

})();
