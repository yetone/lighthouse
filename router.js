;(function(window, undefind) {
  window.router = function(routerPairs) {
    String.prototype.startsWith = function(str) {
      return this.indexOf(str) === 0;
    };

    function onHashChange(cbk) {
      if ('onhashchange' in window) {
        return window.onhashchange = function() {
          var hash = window.location.hash;
          if (hash.startsWith('#')) {
            hash = hash.substr(1);
          }
          cbk.call(cbk, hash);
        };
      }
      window.___href___ = window.location.href;
      window.setInterval(function() {
        if (window.___href___ !== window.location.href) {
          window.__href__ = window.location.href;
          var hash = window.location.href.replace(/^[^#]#?(.*)$/, '$1');
          cbk.call(cbk, hash);
        }
      }, 50);
    }

    function getRequest(hash) {
      var params = {},
          kvPair = [],
          partList,
          path,
          query,
          part,
          key,
          value,
          index;
      if (hash.startsWith('#')) {
        hash = hash.substr(1);
      }
      index = hash.indexOf('?');
      if (index < 0) {
        return {
          path: hash
        };
      }
      path = hash.substr(0, index);
      query = hash.substr(index + 1);
      partList = query.split('&');

      for (var i = 0, l = partList.length; i < l; i++) {
        part = partList[i];
        kvPair = part.split('=');
        switch (kvPair.length) {
          case 1:
            key = kvPair[0];
            value = null;
            break;
          case 2:
            key = kvPair[0];
            value = kvPair[1];
            break;
          default:
            continue;
        }
        params[key] = value;
      }

      return {
        path: path,
        params: params
      };
    }

    onHashChange(function(hash) {
      var request = getRequest(hash),
          path = request.path,
          args = [request],
          match,
          pair,
          router,
          handler;

      if (!path) {
        return;
      }

      for (var i = 0, l = routerPairs.length; i < l; i++) {
        pair = routerPairs[i];
        router = pair[0];
        handler = pair[1];
        if (typeof router === 'string') {
          router = new RegExp(router);
        }
        match = path.match(router);
        if (!match) {
          continue;
        }
        args.push.apply(args, match.slice(1));
        handler.apply(handler, args);
      }
    });
  };
})(window);
