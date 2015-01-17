// ==UserScript==
// @name        Input fields clear/paste buttons
// @namespace   edb7a29d-e0ba-47df-9ca6-f330e0e55292
// @version     1
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  var debug = false;
  var target = null;
  var iconSize = 16;

  function inputStr(input) {
    var id = input.id || input.attributes['name'] || input.attributes['placeholder'];
    var type = input.type;
    return type + ':' + id + '[' + input.value + ']';
  }

  function log(text) {
    if (debug) {
      console.log(text);
    }
  }

  function insertAfter(referenceNode, newNode)
  {
    if (referenceNode.nextSibling) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    else {
      referenceNode.parentNode.appendChild(newNode);
    }
  }

  function onInputFocus(event) {

    var input = event.target;

    log('input focus: ' + inputStr(input));

    // If input field is already empty then nothing to do.
    if (input == '' || input.value == '' || input.value == null)
      return;

    target = input;

    // Create a button element to display on focus input/textarea field.
    var button = document.getElementById('clearinputbutton');
    if (!button) {
      log('creating clear input button');
      button =  document.createElement('img');
      button.style.cssText = 'position: absolute; margin: 0; padding: 0; border: 0; cursor: pointer; display: none; z-index:500';
      button.title = 'Click to clear the text';
      button.src = 'data:image/png;base64,' +
        // begin-base64 edit-clear.png
        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+g' +
        'vaeTAAABBklEQVQ4jbWTMYqEQBBFa9YriCaNGHgJgwXB3DvoHUwEEVE70cBEPM+O' +
        'YGRmKh5D0ORvpIzT7c5MsAUVdf1XVb+7if4jANzxXvzcZGIi+u77npZluWxiWRaZ' +
        'pinvnGUZiOjPVFUVACCIwzB8Kd7zAOzioihOBU3TIAgCEBEYY2jbFo7jnAG7mHMu' +
        'dBiGAQBQVRWmaQIAeJ4nAJAkiXREwzAwz/NheZ7nwgpfRETrukqdVhTl2WSxaF8h' +
        'iiJhgq7rjhX2SVzXvTYxjuMTgHMO3/ePdeq6hm3bIuARUpbl59f4DEnT9KVY0zQA' +
        'wOVTHseRtm2TmktExBgjXdc76eGbn+l+Sf8kfgELsXs24qpkbwAAAABJRU5ErkJg' +
        'gg==' +
        // end-base64
        '';
      button.id = 'clearinputbutton';

      // Clear the text in input/textarea field when onClick event occurs on our button.
      button.addEventListener('click', function(){
        log('clear input button clicked');
        target.value = '';
        target.focus();
      }, false);

      document.body.appendChild(button);
    }

    // Position button on the left of the input.
    var style = input.getBoundingClientRect();
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    button.style.left = style.left + scrollLeft + (style.width - iconSize - 2) + 'px';
    button.style.top = style.top + scrollTop + (style.height - iconSize) / 2 + 'px';

    // Display the button.
    if (input.style.display == '') {
      button.style.display = 'inline';
    } else {
      button.style.display = input.style.display;
    }
  }

  function setupInput(input) {
    log('input setup: ' + inputStr(input) + ' / ' + (input.attributes['readonly'] || input.attributes['disabled'] ? 'not editable' : 'editable'));
    if (input.attributes['readonly'] || input.attributes['disabled']) {
      return;
    }
    input.addEventListener('focus', onInputFocus, false);
    input.addEventListener('mouseover', onInputFocus, false);
  }

  if (window.top == window.self) {
    window.addEventListener('load', function () {
      log('input fields clear/past button: on load');
      var i, inputfields;
      inputfields = document.documentElement.getElementsByTagName('input');
      for (i = 0; i < inputfields.length; ++i) {
        if ('password' == inputfields[i].type ||
            'search' == inputfields[i].type ||
            'text' == inputfields[i].type) {
          setupInput(inputfields[i]);
        }
       }
      inputfields = document.documentElement.getElementsByTagName('textarea');
      for (i = 0; i < inputfields.length; ++i) {
        setupInput(inputfields[i]);
       }
    }, false);
  }

})();

// vim: expandtab list sw=2
