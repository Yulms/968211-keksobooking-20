'use strict';

(function () {

  var CLOSE_EXCEPTION_CLASSES = ['.success__message', '.error__message'];

  var MessageTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
  };

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var destinationElement = document.querySelector('main');
  var openedMessageElement;

  var closeMessage = function () {
    removeHandlers();
    openedMessageElement.remove();
  };

  var onDocumentEscPress = function (evt) {
    window.util.isEscapePressEvent(evt, closeMessage);
  };

  var onMessageClick = function (evt) {
    var isClickOnException = false;

    CLOSE_EXCEPTION_CLASSES.forEach(function (item) {
      if (evt.target.closest(item)) {
        isClickOnException = true;
      }
    });

    if (!isClickOnException) {
      closeMessage();
    }
  };

  var addHandlers = function (messageType) {
    document.addEventListener('keydown', onDocumentEscPress);
    openedMessageElement.addEventListener('click', onMessageClick);
    if (messageType === MessageTypes.ERROR) {
      openedMessageElement.querySelector('.error__button').addEventListener('click', closeMessage);
    }
  };

  var removeHandlers = function () {
    document.removeEventListener('keydown', onDocumentEscPress);
  };

  var showSuccess = function () {
    openedMessageElement = successTemplate.cloneNode(true);
    addHandlers(MessageTypes.SUCCESS);
    destinationElement.append(openedMessageElement);
  };

  var showError = function () {
    openedMessageElement = errorTemplate.cloneNode(true);
    addHandlers(MessageTypes.ERROR);
    destinationElement.append(openedMessageElement);
  };


  window.messages = {
    showSuccess: showSuccess,
    showError: showError
  };
})();
