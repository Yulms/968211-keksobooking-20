'use strict';

(function () {
  var addOfferFormElement = document.querySelector('.ad-form');
  var addressInputElement = addOfferFormElement.querySelector('#address');
  var roomsNumberElement = addOfferFormElement.querySelector('#room_number');
  var roomCapacityElement = addOfferFormElement.querySelector('#capacity');
  var offerTypeInputElement = addOfferFormElement.querySelector('#type');
  var offerTypeInputElementDefaultValue = offerTypeInputElement.value;
  var priceInputElement = addOfferFormElement.querySelector('#price');
  var offerCheckInInputElement = addOfferFormElement.querySelector('#timein');
  var offerCheckOutInputElement = addOfferFormElement.querySelector('#timeout');
  var avatarInputElement = addOfferFormElement.querySelector('#avatar');
  var avatarImageElement = addOfferFormElement.querySelector('#avatar-image');


  var fillAdressInput = function (location) {
    addressInputElement.value = location.x + ', ' + location.y;
  };

  var fillActiveFormAddressInput = function () {
    return fillAdressInput(window.map.getMainPinVerticalBottomLocation());
  };

  var fillNotActiveFormAddressInput = function () {
    return fillAdressInput(window.map.getMainPinVerticalCenterLocation());
  };

  var validateRoomToCapacity = function () {
    var rooms = window.data.Rooms;
    var selectedRooms = parseInt(roomsNumberElement.value, 10);
    var selectedCapacity = parseInt(roomCapacityElement.value, 10);

    roomCapacityElement.setCustomValidity('');
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].quantity === selectedRooms) {
        if (selectedCapacity < rooms[i].minGuests || selectedCapacity > rooms[i].maxGuests) {
          roomCapacityElement.setCustomValidity(rooms[i].wrongCapacityMessage);
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

  var setPriceElementAttribures = function () {
    var minPrice = window.data.getMinPrice(offerTypeInputElement.value);

    priceInputElement.min = minPrice;
    priceInputElement.placeholder = minPrice;
  };

  var validatePriceElement = function () {
    if (Number(priceInputElement.value)) {
      priceInputElement.reportValidity();
    }
  };

  var onOfferTypeElementChange = function () {
    setPriceElementAttribures();
    validatePriceElement();
  };

  var onPriceElementChange = function () {
    setPriceElementAttribures();
  };

  var onFormSubmit = function (evt) {
    var onFormSendSuccess = function () {
      window.main.deactivatePage();
      window.messages.showSuccess();
    };

    var onFormSendError = function (data) {
      window.messages.showError(data);
    };

    if (!validateRoomToCapacity()) {
      evt.preventDefault();
    }

    var formData = new FormData(addOfferFormElement);
    window.backend.save(formData, onFormSendSuccess, onFormSendError);
    evt.preventDefault();
  };

  var onFormReset = function () {
    offerTypeInputElement.value = offerTypeInputElementDefaultValue;
    setPriceElementAttribures();
    setTimeout(window.main.deactivatePage, 0);
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
    priceInputElement.addEventListener('change', onPriceElementChange);
    offerTypeInputElement.addEventListener('change', onOfferTypeElementChange);
    offerCheckInInputElement.addEventListener('change', onCheckInElementChange);
    offerCheckOutInputElement.addEventListener('change', onCheckOutElementChange);
    addOfferFormElement.addEventListener('submit', onFormSubmit);
    addOfferFormElement.addEventListener('reset', onFormReset);
    fillActiveFormAddressInput();
    setPriceElementAttribures();

    window.imageInjection.activate(avatarInputElement, avatarImageElement);
  };

  var deactivateForm = function () {
    addOfferFormElement.classList.add('ad-form--disabled');
    window.util.changeCollectionAttribute(addOfferFormElement.children, 'disabled', true);
    roomsNumberElement.removeEventListener('change', onRoomsNumberElementChange);
    roomCapacityElement.removeEventListener('change', onRoomCapacityElementChange);
    priceInputElement.removeEventListener('change', onPriceElementChange);
    offerTypeInputElement.removeEventListener('change', onOfferTypeElementChange);
    offerCheckInInputElement.removeEventListener('change', onCheckInElementChange);
    offerCheckOutInputElement.removeEventListener('change', onCheckOutElementChange);
    addOfferFormElement.removeEventListener('submit', onFormSubmit);
    addOfferFormElement.removeEventListener('reset', onFormReset);
    fillNotActiveFormAddressInput();

    window.imageInjection.deactivate();
  };

  var resetForm = function () {
    addOfferFormElement.reset();
  };

  window.form = {
    activate: activateForm,
    deactivate: deactivateForm,
    fillActiveFormAddressInput: fillActiveFormAddressInput,
    reset: resetForm
  };

})();
