(function () {
  if (typeof window === "undefined" || window.__rscPrefetchDisabled) {
    return;
  }

  window.__rscPrefetchDisabled = true;
  var originalFetch = window.fetch.bind(window);

  function isRscPrefetch(input, init) {
    if (init && init.headers) {
      var headers = init.headers;
      if (typeof Headers !== "undefined" && headers instanceof Headers) {
        return headers.get("next-router-prefetch") === "1";
      }
      if (Array.isArray(headers)) {
        for (var i = 0; i < headers.length; i++) {
          if (
            headers[i][0].toLowerCase() === "next-router-prefetch" &&
            headers[i][1] === "1"
          ) {
            return true;
          }
        }
      } else if (headers["next-router-prefetch"] === "1") {
        return true;
      }
    }

    if (typeof Request !== "undefined" && input instanceof Request) {
      return input.headers.get("next-router-prefetch") === "1";
    }

    return false;
  }

  window.fetch = function (input, init) {
    if (isRscPrefetch(input, init)) {
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    return originalFetch(input, init);
  };
})();
