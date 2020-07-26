'use strict';

(function () {
  var MessageType = {
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
    if (messageType === MessageType.ERROR) {
      openedMessageElement.querySelector('.error__button').addEventListener('click', closeMessage);
    }
  };

  var removeHandlers = function () {
    document.removeEventListener('keydown', onDocumentEscPress);
  };

  var showMessage = function (messageType, text) {
    switch (messageType) {
      case MessageType.SUCCESS:
        openedMessageElement = successTemplate.cloneNode(true);
        addHandlers(MessageType.SUCCESS);
        break;

      case MessageType.ERROR:
        openedMessageElement = errorTemplate.cloneNode(true);
        if (text) {
          openedMessageElement.querySelector('.error__message').textContent = text;
        }
        addHandlers(MessageType.ERROR);
        break;
    }

    destinationElement.append(openedMessageElement);
  };

  var showSuccess = function () {
    showMessage(MessageType.SUCCESS);
  };

  var showError = function () {
    showMessage(MessageType.ERROR);
  };


  window.messages = {
    showSuccess: showSuccess,
    showError: showError
  };

})();
