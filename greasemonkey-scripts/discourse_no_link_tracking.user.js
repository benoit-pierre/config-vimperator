// ==UserScript==
// @name        Discourse: no link tracking
// @namespace   7f0ed0b8-c408-4b1f-b7ea-d4962aefdb0d
// @include     *
// @version     1
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  if (typeof Discourse === 'undefined') {
    return;
  }

  var debug = false;

  function log(text) {
    if (debug) {
      console.log(text);
    }
  }

  function disable_mouseup(event) {
    (event || window.event).stopPropagation()
    return false;
  }

  function fix_links(container) {

    // Element or document.
    if (1 != container.nodeType && 9 != container.nodeType)
      return;

    log('fixing links in ' + container.nodeName);

    var links = container.getElementsByTagName('a');
    for (var j = 0; j < links.length; j++) {
      log('fixing link to ' + links[j].getAttribute('href'));
      links[j].onmouseup = disable_mouseup;
    }
  }

  fix_links(document);

  // Monitor the document for dynamically added elements.
  var observer = new window.MutationObserver(function (mutationRecords) {
    mutationRecords.forEach(function (mutation) {
      for (var n = 0; n < mutation.addedNodes.length; ++n) {
        fix_links(mutation.addedNodes[n]);
      }
    });
  });
  observer.observe(window.document, { childList: true, subtree: true, attributes: false });

})();

// vim: expandtab list sw=2
