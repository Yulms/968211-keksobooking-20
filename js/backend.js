'use strict';

window.backend = (function () {
  var TIMEOUT_IN_MS = 10000;

  var Url = {
    GET: 'https://javascript.pages.academy/keksobooking/data',
    POST: 'https://javascript.pages.academy/keksobooking'
  };
  var StatusCode = {
    OK: 200
  };
  var RequestMethod = {
    GET: 'GET',
    POST: 'POST'
  };
  var ResponseType = {
    JSON: 'json'
  };


  var createXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.responseType = ResponseType.JSON;
    xhr.timeout = TIMEOUT_IN_MS;

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = createXhr(onLoad, onError);

    xhr.open(RequestMethod.GET, Url.GET, true);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = createXhr(onLoad, onError);

    xhr.open(RequestMethod.POST, Url.POST);
    xhr.send(data);
  };

  return {
    load: load,
    save: save
  };
})();
