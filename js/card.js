'use strict';

(function () {
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var cardDestinationElement = document.querySelector('.map__filters-container');
  var onCloseCallback;

  var getCapacity = function (similarOffer) {
    return similarOffer.offer.rooms + ' комнаты для ' + similarOffer.offer.guests + ' гостей';
  };

  var getTime = function (similarOffer) {
    return 'Заезд после ' + similarOffer.offer.checkInOut + ', выезд до ' + similarOffer.offer.checkInOut + '.';
  };

  var addOfferCardFeatures = function (offerCard, features) {
    var offerFeaturesList = offerCard.querySelector('.popup__features');
    offerFeaturesList.innerHTML = '';
    if (Array.isArray(features) && features.length > 0) {
      features.forEach(function (feature) {
        var featureModClassName = 'popup__feature--' + feature;
        var newFeatureListItem = document.createElement('li');
        newFeatureListItem.classList.add('popup__feature');
        newFeatureListItem.classList.add(featureModClassName);
        offerFeaturesList.append(newFeatureListItem);
      });
    } else {
      offerFeaturesList.remove();
    }
  };

  var addOfferCardThumbnails = function (offerCard, imageSources) {
    if (Array.isArray(imageSources) && imageSources.length > 0) {
      var offerPhoto = offerCard.querySelector('.popup__photo');
      imageSources.forEach(function (imageSource) {
        var photoElement = offerPhoto.cloneNode(true);
        photoElement.src = imageSource;
        offerPhoto.after(photoElement);
      });
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

  var onPopupCloseClick = function () {
    deleteOfferCardElement();
  };

  var onPopupCloseEscPress = function (evt) {
    window.util.isEscapePressEvent(evt, deleteOfferCardElement);
  };

  var createOfferCardElement = function (offerData) {
    var offerCardElement = cardTemplateElement.cloneNode(true);

    addContentOrRemove(offerCardElement, '.popup__title', 'textContent', offerData.offer.title);
    addContentOrRemove(offerCardElement, '.popup__text--address', 'textContent', offerData.offer.address);
    addContentOrRemove(offerCardElement, '.popup__text--price', 'textContent', offerData.offer.price + window.data.PRICE_UNIT);
    addContentOrRemove(offerCardElement, '.popup__type', 'textContent', window.data.getOfferTypeInRussian(offerData.offer.type));
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

  var showOfferCardElement = function (offerID, closeCallback) {
    deleteOfferCardElement();
    var offerData = window.mapFilter.getFilteredData()[offerID];
    var offerCardElement = createOfferCardElement(offerData);
    cardDestinationElement.before(offerCardElement);
    onCloseCallback = closeCallback;
  };

  var deleteOfferCardElement = function () {
    var openedOfferElement = document.querySelector('.map__card');
    if (openedOfferElement) {
      openedOfferElement.remove();
      onCloseCallback();
      document.removeEventListener('keydown', onPopupCloseEscPress);
    }
  };

  window.card = {
    show: showOfferCardElement,
    hide: deleteOfferCardElement
  };

})();
