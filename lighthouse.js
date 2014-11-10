;(function(window, undefined) {
  var supportHashChange = 'onhashchange' in window;

  function getHash() {
    if (!supportHashChange) {
      return window.location.href.replace(/^[^#]#?(.*)$/, '$1');
    }
    var hash = window.location.hash;
    if (hash.charAt(0) === '#') {
      hash = hash.substr(1);
    }
    if (hash === '') hash = '/';
    return hash;
  }

  function onHashChange(cbk) {
    var hash = getHash();
    cbk.call(cbk, hash);
    if (supportHashChange) {
      window.onhashchange = function() {
        var hash = getHash();
        cbk.call(cbk, hash);
      };
      return;
    }
    window.___href___ = window.location.href;
    window.setInterval(function() {
      if (window.___href___ !== window.location.href) {
        window.__href__ = window.location.href;
        var hash = getHash();
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
    if (hash.charAt(0) === '#') {
      hash = hash.substr(1);
    }
    index = hash.indexOf('?');
    if (index < 0) {
      return {
        hash: hash,
        path: hash,
        params: params
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
      hash: hash,
      path: path,
      params: params
    };
  }

  window.LightHouse = function() {
    function LightHouse(opt) {
      opt = opt || {};
      this.before = opt.before;
      this.after = opt.after;
    }
    var proto = LightHouse.prototype;

    proto.setBefore = function(before) {
      this.before = before;
    };
    proto.setAfter = function(after) {
      this.after = after;
    };
    proto.getHash = getHash;
    proto.route = function(routerPairs) {
      var self = this;
      onHashChange(function(hash) {
        var request = getRequest(hash),
            path = request.path,
            args = [request],
            match,
            pair,
            router,
            handler;

        if (typeof path !== 'string') {
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
          var go = true;
          if (typeof self.before === 'function') {
            go = self.before.apply(self.before, args);
          }
          go !== false && handler.apply(handler, args);
          typeof self.after === 'function' && self.after.apply(self.after, args);
          break;
        }
      });
    };
    return LightHouse;
  }();
})(window);
