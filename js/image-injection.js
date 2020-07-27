'use strict';

window.imageInjection = (function () {

  return function () {

    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
    var imageInput;
    var imageElement;
    var imageElementDefaultSource;
    var imageParentElement;
    var addedImage;


    var onInputChange = function () {
      var file = imageInput.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (elem) {
        return fileName.endsWith(elem);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          if (!imageParentElement) {
            imageElement.src = reader.result;
          } else {
            if (addedImage) {
              addedImage.src = reader.result;
            } else {
              addedImage = document.createElement('img');
              addedImage.style.maxWidth = '100%';
              addedImage.style.maxHeight = '100%';
              addedImage.src = reader.result;
              imageParentElement.append(addedImage);
            }
          }
        });

        reader.readAsDataURL(file);
      }
    };


    var activate = function (imageFileInput, imageElem, imageParent) {
      imageInput = imageFileInput;
      if (imageElem) {
        imageElement = imageElem;
        imageElementDefaultSource = imageElement.src;
      }
      imageParentElement = imageParent;

      imageInput.addEventListener('change', onInputChange);
    };


    var deactivate = function () {
      if (imageInput) {
        imageInput.removeEventListener('change', onInputChange);
        resetImageElement();
      }
    };


    var resetImageElement = function () {
      if (imageElementDefaultSource) {
        imageElement.src = imageElementDefaultSource;
      }
      if (addedImage) {
        imageParentElement.innerHTML = '';
      }
    };


    return {
      activate: activate,
      deactivate: deactivate,
      resetImageElement: resetImageElement
    };
  };

})();
