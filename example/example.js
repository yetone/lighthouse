// example
window.onload = function() {
  var routers = [
    [/^\/home$/, homeHandler],
    [/^\/topic\/(\d+)\/like$/, topicLikeHandler],
    ['^/string/(\\d+)', stringHandler]
  ];

  var area = document.getElementById('exp');
  (new LightHouse).route(routers);

  function homeHandler(request) {
    console.log('homeHandler');
    area.innerHTML = '<div>I am in homeHandler now!</div><div>params: ' + JSON.stringify(request.params) + '</div>';
  }

  function topicLikeHandler(request, id) {
    console.log('topicLikeHandler');
    console.log('id:', id);
    area.innerHTML = '<div>I am in topicLikeHandler now!</div><div>id: ' + id + '</div><div>params: ' + JSON.stringify(request.params) + '</div>'
  }

  function stringHandler(request, id) {
    console.log('stringHandler');
    console.log('id:', id);
    area.innerHTML = '<div>I am in stringHandler now!</div><div>id: ' + id + '</div><div>params: ' + JSON.stringify(request.params) + '</div>'
  }
};
