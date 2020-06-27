'use strict';

(function () {
  var addOfferFormElement = document.querySelector('.ad-form');
  var addressInputElement = addOfferFormElement.querySelector('#address');
  var roomsNumberElement = addOfferFormElement.querySelector('#room_number');
  var roomCapacityElement = addOfferFormElement.querySelector('#capacity');
  var offerTypeInputElement = addOfferFormElement.querySelector('#type');
  var priceInputElement = addOfferFormElement.querySelector('#price');
  var offerCheckInInputElement = addOfferFormElement.querySelector('#timein');
  var offerCheckOutInputElement = addOfferFormElement.querySelector('#timeout');


  var fillAdressInput = function (location) {
    addressInputElement.value = location.x + ', ' + location.y;
  };

  var validateRoomToCapacity = function () {
    var ROOMS = window.data.ROOMS;
    var selectedRooms = parseInt(roomsNumberElement.value, 10);
    var selectedCapacity = parseInt(roomCapacityElement.value, 10);

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
    validateRoomToCapacity();
  };

  var onRoomCapacityElementChange = function () {
    validateRoomToCapacity();
  };

  var onOfferTypeElementChange = function () {
    var minPrice = window.data.getMinPrice(offerTypeInputElement.value);

    priceInputElement.min = minPrice;
    priceInputElement.placeholder = minPrice;
    if (Number(priceInputElement.value)) {
      priceInputElement.reportValidity();
    }
  };

  var onFormSubmit = function (evt) {
    if (!validateRoomToCapacity()) {
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

  var activateForm = function () {
    addOfferFormElement.classList.remove('ad-form--disabled');
    window.util.changeCollectionAttribute(addOfferFormElement.children, 'disabled', false);
    roomsNumberElement.addEventListener('change', onRoomsNumberElementChange);
    roomCapacityElement.addEventListener('change', onRoomCapacityElementChange);
    offerTypeInputElement.addEventListener('change', onOfferTypeElementChange);
    offerCheckInInputElement.addEventListener('change', onCheckInElementChange);
    offerCheckOutInputElement.addEventListener('change', onCheckOutElementChange);
    addOfferFormElement.addEventListener('submit', onFormSubmit);
    fillAdressInput(window.map.getMainPinVerticalBottomLocation);
  };

  var deActivateForm = function () {
    addOfferFormElement.classList.add('ad-form--disabled');
    window.util.changeCollectionAttribute(addOfferFormElement.children, 'disabled', true);
    roomsNumberElement.removeEventListener('change', onRoomsNumberElementChange);
    roomCapacityElement.removeEventListener('change', onRoomCapacityElementChange);
    offerTypeInputElement.removeEventListener('change', onOfferTypeElementChange);
    offerCheckInInputElement.removeEventListener('change', onCheckInElementChange);
    offerCheckOutInputElement.removeEventListener('change', onCheckOutElementChange);
    addOfferFormElement.removeEventListener('submit', onFormSubmit);
    fillAdressInput(window.map.getMainPinVerticalCenterLocation);
  };

  window.form = {
    activate: activateForm,
    deActivate: deActivateForm
  };

})();
