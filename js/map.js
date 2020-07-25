'use strict';

(function () {
  var MAX_PINS_NUMBER = 5;
  var MAIN_PIN_EXTRA_OFFSET_X = 0;
  var MAIN_PIN_EXTRA_OFFSET_Y = 22;
  var DRAG_LIMIT_VERTICAL = {
    top: 130,
    bottom: 630
  };


  var mapElement = document.querySelector('.map');
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinDestinationElement = mapElement.querySelector('.map__pins');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mainPinDrag = window.drag();


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

  var getSimilarOfferPinsFragment = function (data) {
    var fragment = document.createDocumentFragment();
    var addedPins = 0;

    for (var i = 0; i < data.length; i++) {
      if (addedPins < MAX_PINS_NUMBER && data[i].offer) {
        var offer = createSimilarOfferPinElement(data[i], i);
        fragment.append(offer);
        addedPins++;
      } else {
        break;
      }
    }

    return fragment;
  };

  var makeElementLocationCallback = function (element, isSharpEndMark, extraOffsetX, extraOffsetY) {
    extraOffsetX = extraOffsetX || 0;
    extraOffsetY = extraOffsetY || 0;
    return function () {
      var verticalOffset = (isSharpEndMark) ?
        (element.offsetTop + element.offsetHeight + extraOffsetY) :
        (element.offsetTop + extraOffsetY + element.offsetHeight / 2);
      var horizontalOffset = element.offsetLeft + extraOffsetX + element.offsetWidth / 2;

      return {
        x: Math.round(horizontalOffset),
        y: Math.round(verticalOffset)
      };
    };
  };

  var renderMapPins = function (data) {
    removeMapPins();
    var similarOfferPinsFragment = getSimilarOfferPinsFragment(data);
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

  var clearPins = function () {
    var activePin = document.querySelector('.map__pin--active');
    activePin.classList.remove('map__pin--active');
  };

  var onPinClick = function (evt) {
    var pinButton = evt.target.closest('.map__pin:not(.map__pin--main)');

    if (pinButton) {
      window.card.show(pinButton.dataset.id, clearPins);
      pinButton.classList.add('map__pin--active');
    }
  };


  var activateMap = function () {
    window.data.getSimilarOffersFromServer(function (data) {
      window.mapFilter.activate();
      window.mapFilter.filterData(data, renderMapPins);
    });

    mapElement.classList.remove('map--faded');
    mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMousedown);
    mapPinMainElement.removeEventListener('keydown', onMapPinMainElementPressEnter);
    pinDestinationElement.addEventListener('click', onPinClick);

    var dragLimits = {
      top: DRAG_LIMIT_VERTICAL.top - mapPinMainElement.offsetHeight - MAIN_PIN_EXTRA_OFFSET_Y,
      right: mapPinMainElement.offsetParent.offsetWidth - mapPinMainElement.offsetWidth / 2,
      bottom: DRAG_LIMIT_VERTICAL.bottom - mapPinMainElement.offsetHeight - MAIN_PIN_EXTRA_OFFSET_Y,
      left: -mapPinMainElement.offsetWidth / 2
    };
    mainPinDrag.setDragLimit(dragLimits);
    mainPinDrag.activate(mapPinMainElement, mapPinMainElement, window.form.fillActiveFormAddressInput);
  };

  var deactivateMap = function () {
    window.card.hide();
    removeMapPins();
    mapElement.classList.add('map--faded');
    window.mapFilter.deactivate();
    mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMousedown);
    mapPinMainElement.addEventListener('keydown', onMapPinMainElementPressEnter);
    pinDestinationElement.removeEventListener('click', onPinClick);
    mainPinDrag.deactivate();
  };


  window.map = {
    activate: activateMap,
    deactivate: deactivateMap,
    getMainPinVerticalCenterLocation: makeElementLocationCallback(mapPinMainElement, false),
    getMainPinVerticalBottomLocation: makeElementLocationCallback(
        mapPinMainElement,
        true,
        MAIN_PIN_EXTRA_OFFSET_X,
        MAIN_PIN_EXTRA_OFFSET_Y
    ),
    renderMapPins: renderMapPins
  };

})();
