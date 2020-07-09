'use strict';

(function () {

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

  var onMessageClick = function () {
    closeMessage();
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

  var showMessage = function (messageType, text) {
    switch (messageType) {
      case MessageTypes.SUCCESS:
        openedMessageElement = successTemplate.cloneNode(true);
        addHandlers(MessageTypes.SUCCESS);
        break;

      case MessageTypes.ERROR:
        openedMessageElement = errorTemplate.cloneNode(true);
        if (text) {
          openedMessageElement.querySelector('.error__message').textContent = text;
        }
        addHandlers(MessageTypes.ERROR);
        break;
    }

    destinationElement.append(openedMessageElement);
  };

  var showSuccess = function () {
    showMessage(MessageTypes.SUCCESS);
  };

  var showError = function () {
    showMessage(MessageTypes.ERROR);
  };


  window.messages = {
    showSuccess: showSuccess,
    showError: showError
  };

})();
