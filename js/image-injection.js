'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var imageInput;
  var imageElement;
  var imageElementDefaultSource;

  var onInputChange = function () {
    var file = imageInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (elem) {
      return fileName.endsWith(elem);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imageElementDefaultSource = imageElement.src;
        imageElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };


  var activate = function (imageFileInput, imageElem) {
    imageInput = imageFileInput;
    imageElement = imageElem;
    imageInput.addEventListener('change', onInputChange);
  };

  var deactivate = function () {
    if (imageInput) {
      imageInput.removeEventListener('change', onInputChange);
      resetImageElement();
    }
  };

  var resetImageElement = function () {
    imageElement.src = imageElementDefaultSource;
  };


  window.imageInjection = {
    activate: activate,
    deactivate: deactivate,
    resetImageElement: resetImageElement
  };

})();
