// ==UserScript==
// @name        External play embedded Youtube videos
// @namespace   35fd893f-0832-4134-a875-716e7462e370
// @version     1
// @exclude     /^https?://(www\.)?youtube\.com//
// @exclude     /^https?://apis.google.com//
// @exclude     /^https?://plus.googleapis.com//
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  var debug = false;

  function log(text) {
    if (debug) {
      console.log(text);
    }
  }

  // Icons.
  var iconSize = 64;
  var playIcon = 'data:image/png;base64,' +
    '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' +
    'QEkAAAAASUVORK5CYII=' +
    '';
  var youtubeIcon = 'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAO2klEQVR42u2b' +
    'B1RVVxaGNzyKNA0IFp7GAAElClZEYyYOaiwUFSJBoyaawd6WJcUkrnEtozHW' +
    'mKixkIAtCiqKXUexd7CjIqKIAkqTIr3Nvw/3MS/4KO9BgFnJXuuse27h3bO/' +
    's88u91606C8uWvU9gPqWvwHU9wDqW/4GUNUFjo6OWs2bN9fOycnRatSokVZy' +
    'crJWbm4ulZSU1PfY/6iIlhZhfGRhYVGSn59fYmRkVJKYmFgcFhZW6UArBNCy' +
    'ZUstS0tLGX5ENz4+Xr9Dhw5tjY2NTaW/aaiWw8qWvHr16uWdO3ciW7dunSeX' +
    'ywsSEhKKHj16pBKESkUMDQ21TU1NdePi4gyGDBniumTJkkWA0aa+tVNHMGlP' +
    'vvjii69DQkIOWVtb56SnpxekpKQUVweAFgDoZmdnG0H5IVu2bPGDecnqWyFN' +
    'BMu0aPTo0b6AENK0adOs1NTUgpJya1cVABkUNkQzj4iIOA0Taq3OTW/dukWX' +
    'L18WfdxcrEuWo0ePUmxsLMGSyM3Nrc4gwIqftm/fvje6yWjZxcXFRVUB0EN7' +
    'w8HBoef58+f3qntDVnLu3LmiP2fOHOrcubNwmFOmTCGYIX344Yfk5eVVZwBY' +
    'evXqNfT27dsX0U1Dy68KgAGaRc+ePQdi1tZrcsOZM2cyeXJ1daUxY8bQ06dP' +
    'afbs2eLcDz/8QFZWVnUKYMCAARMuXrx4BN0ktJzKAPC+EVoLABh05MiRnzS5' +
    'YWBgoGjwwrRq1So6dOgQ+fn5EdYhbdiwQYSsupSBAwdOB4DD6D5Hy6LSaFEh' +
    'AGM0SwBwBYAVmtzw2bNnNGnSJNHftGkTrVu3jjAAGjRoEE2ePFkcj4qKoitX' +
    'roi+k5MT2dnZiX5mZqaAx+Lj40MmJiYCHgv7DoRnTQDMwv0PoRuP9qoqACZo' +
    '8h49ejCAZZpSZwCPHz+mzz//XABgxRYsWCCUhW8Rx5Qd8vjx4+n999+npKQk' +
    'sYRYVq5cyYkNjRo1Sux/8803ZG9vrwmAOZcuXWIAccy4KgCN0SxrCgDhU8y+' +
    'jY0NRUdHi2gQHBxMMplMKJuRkUG9e/cW154+fVrM9MaNGwmxWjhMljVr1lCz' +
    'Zs3I29tb7M+fP5/g0WsCgC0go9oADh8+rDEAZF7k6+tbtg9PLCyAo8S0adPE' +
    'saCgIGEFbOosP//8swA1btw4sc9AGADSEbG/cOFCQkaq9liw9OoegEIx1A5i' +
    'n0MiRwWkqGJZsOD3FQMU22XLlglHOXbsWLHv7+9PLVq0KDvPEQS1Sd0BgPfW' +
    'GADLokWL6MSJE8Lr79y5k5Be082bN8tC4vHjx8W2X79+Yrt8+XJC4VW25rdu' +
    '3SoAKJ/v2LGj2uMA+PoBwD5g8+bNwoy3b98ujt24caMMAMNh6du3b5mCrPDI' +
    'kSPF/rZt28S+8vlOnTrVHYCDBw/WCAArz41nlZVhqQ8LQPj8G4DaAJydnWsF' +
    'AIdDVoqVYYmMjKSpU6eKPhdILEhVxZazRjMzM1FEsSj+tn///mKfnaSmAFCg' +
    'qQ/gwIEDNQLACiiU4C3Lq1evREHEUYLDIsu8efOEo9y1axfl5+fTiBEjxPEV' +
    'K1bQ1atXy/wHA9AkCri7uzccACyLFy+m0NDQP1zLSRFnegxg8ODBhLJVHOfy' +
    'OT4+XvSXLl2qkQVoDGD//v01ArB3717RzM3NxewphJXkJREeHi72u3TpIta9' +
    'vr6+2A8ICKBz586JrO+zzz6jGTNmiONfffUVtWvXTu1xeHh41A8ANmtF5aeY' +
    '0fLnWVQ9YNXW1i77G+5X9Bt/KoB9+/bVCEBDESwp9QF0795dLQBFeXmUi4qv' +
    'IDeX8nibk0NFMPV8HOctFRWJmdbGrPO2BLNZUlT6dEoLM6yNIqlEYRHY8r5M' +
    'T490URvoYKtnZET6xsaka2BA+iic+Lw6AFB61z6Ap1jD8cjnS1Dg6EAZXR0d' +
    '0tfVJV1uGCDvy3gZ4FptpRtU9DikpFxjgy8CqAL8dn5BARUWFlIub7FfhHto' +
    't2lDctQJ8iqyQ40BhISEVAjgHpybDhKZloaG1Z6J2hbWIiE7m4qRR7Tz8Kjw' +
    'OlSTmgGAB1cJIBHJzMsff6QW9ai8sjAEc1Sb5jY2Ks8PHTq0dgHcQN3+5sOH' +
    'ol8Ik8xKS6twcI2wbvUNDCpVICM1VfgDw8aNSVcKhepKnL09OUycWLsA9uzZ' +
    'oxrA3Lkkz8wUfQNQbyk951MlScHBlHn+fKWDb/3tt6SLUjnh118p5+5djQAk' +
    'NGlCjgsXqjzn6empGYDg4GCVAK6NG0dyODgW4w4dyA51f0USu349JR88WOng' +
    '22/cSPrIFh8iNc5A6quJxMFBdsHvqBIvLy/1ATg5Oam0gEKEtOvI2ixBnIUH' +
    '3lSq18169SJDKyvKT0mhROlpTzoiRRZ8RmXS0d9f/E7k/PmULj0pVlfi09Op' +
    'C7JLDp3lhS0ANYX6AFRZQAby8kezZpGpCgdoi1S1WZ8+lPngAd2SKr4irO2M' +
    'Fy9EvwlKW87q0hISRC5gghSZY3xXVI2NcO4uiqLkCxcoB8roI+6X9wecZ+Rm' +
    'ZYm/McKSUX6/kAZHaLVyJTVW8dicLaDWACTcvk3J339PBtISUBZ7FDPNYQ0M' +
    'IFxySKxYj99/F/3zXl5UAIf5j0OHSIYEJxy+I/P+fXGer7v25ZdkaGtLrRDW' +
    'kmAJj+FsFWmwTC6ndjNnkhmWXM7z5/TAz49enjxJMuQDLDlYAuZff00tVTw0' +
    '1RjA7t27XwMQc+kS5f70k8q3Ox0wgy0++IAyYPJXpCe7BlCsV1CQ6J9BlZcP' +
    'AC7HjgkAVyZMoIx796hXYCAZYOZyEhPJoFmzst+7+e9/UxKU1IWlvAdIMulF' +
    'q0Kuw3mmnDkj+qxRo2nT6K0ePV4bF8pvzQCgPn8NQBQGVLBe9StDR6xhy/79' +
    'KR2zehFVnAAAxXrv3i36oW5ulP/yJX2AUpiVuejrS+nw+nyer4sBqNhdu6gb' +
    'TNkQMx6NEjrql1/IBr9li2vTcG0YKkPb8eOpjbc3pVy7RlelpcaiB6Bvu7i8' +
    'Nq5hw4bVHoDIo0cprwJv2xleXA7zTQOAc598Ugagb0iI6B/DOQYwCLPGAM6N' +
    'HUtpERHUB1mlIer+K7NnU+LZs9QJIFu5ulIMYNxZsqTsdx9u2kT316zhN7fk' +
    'vGoV5SYn03FcpxB9WF1b6elSjQF069ZNJYD7WL8ZmCFV4rx8Ob2JlPQllDru' +
    '6SmO8Uy6wWpY9mHgeYgQnrdukQ4AnBg2jFLRd4VFGLVqRecnTaL4EyfIafFi' +
    'egv+Ihpmfw0weq5eTa1gWVHbttF9wLdwcqIeS5eK5RTSvXvZ/U3hnG2ldwjl' +
    'AYSFhdUOgHsAEFNB4tMPA357xAhKvn6ddnXpIo6ZoGAZGRMj+pvhD7IREXzh' +
    'sXWQHe7Ben1x+TKNfPSITBA+jwwdSjGwFheExbZjxlAEzP8s7jUAyZSVBFRZ' +
    '8mBN/mZmZftWa9dSOyWLqDGAnTt3vu4DMEP3lV55KcsAALADgCQA2CEBaAwA' +
    'n0oAfpUATJIA7ASA5wDwKQA0BoCDAPAIAPoBgD0A3AaAUwDgBgDWAJCJqjMd' +
    '1yqkAGHxAByrQtrCOuykJ8jK4u3trRmAoKCg1wDEIjyFDx+uEoAbALSVAGxR' +
    'AuArAVgPAFkAMF0CsB0AEgDgX1CqCQDsA4CHADAAANoDwE0AOAEAgwHgbQC4' +
    'iqVxFmm4ckmt/Iyo644d9KbSklDIRx99VHsAnt+5Q6GgrqsCgAcA2ANAIgAE' +
    'KAGYKAFYIwGYJQHYCgDxADBBArAHAKIAYBAAOADADQA4BgCeAGALAJcA4AwA' +
    'tEbG2fu77ygfFhAkWUAhWp/9+6m5irfHGgMIDAx8DUAmsrg9772nEoAnALwD' +
    'AC8AwE8C0AQApkoAVgFAMZSfAUeojQQmAADiAGAKALwBALsAIBIAPOHs3vn4' +
    'YwrHmj4yZQq5//YbdUTEuIbE6PD06eQ4ciR5IO3NTkqilVLeUIDmhaLLGPco' +
    'Lz4+PrUHgB9v+YOynooHlMMAoAMAPAeAdQoLgHef9fSp6F+CR38LYaoFogGL' +
    'HwA8A4AZAGAKALEIsRGI/S4IcY2aNqWz/HIV2WVXxH0P5B65AHcZM2+PWqRZ' +
    '164Uc+oUBUhxPx8Z41jkCYrMsMYAunbtqhIAy+Z336VCZG3lZTgAOABAAgCs' +
    'lgDwgL5FuNKTaoc7iO32CJUy5PnrASAWAOZIAOLCwkjerdv/7uPuTpGoJPk5' +
    '4Phz58hS+k0x4zk55A+H9wS1A4suiqnRFZTdDCA8PLz2AOz28aEU6Zm+sjgj' +
    '/2/t7EzpT57QfzDbCnlnyBCh9GMkOddR+HiuW0faKGhCkeCkQnlXJDuGFhZ0' +
    'ASm2mbU12SKdjkOWd2XDhrLf0AVAJ0Sflo6OlA1LCA8IoESk0QoxR27gJb1B' +
    '+tMBnIRyd6V3fQ1FHOAj3sdyqVUAO3bsUAkg9eFD2grzVDzWrm/RRmU6CkvF' +
    'FNajSoYPH64WAPGVWGUAWCJQwR1B9Vffn81zVeqG8Niukq9PlQBU6ysx8Z2g' +
    'nZ3dPw8cOLCushu/wDq9gFj9GCVyYV5encHge7NjtEY0eRd5grmDQ6XXu7u7' +
    'T3zw4MEpquZ3guJLUdykbWhoqL9cLreoajB6cGiFiO/5aOJtUFaW8NLFhYVi' +
    'y3C4X8xvh7jxWyEeheLNkExWOhB+iSK9JeJHWzqIFKwo5wz8hkjP2Fgc44jC' +
    '1SS/ZK0KelxcXFKfPn3G4jp+Llfll6Is4lthNGv8oefatWunaisey/yfSTFk' +
    '8uTJqzGRe7DLRUSV3wqziK/F0eRoti4uLv3nzZvnBUswrW+F1BHM/MsFCxYE' +
    'nzx58hh2o6h0/Vfra3F+68hZS1O0VmhtYOaWNjY2Vib8OWfp+Yb8LzNFmZDo' +
    '6OjHMHte80/QnqGloGXz+aoA8DHOJ9kXcLHNy8GcSq2CH8rpNHAAXBflUuls' +
    '81eabPapVLr2C0hp/VcEgEVbgmAggTCR+vycWlbF39an8iw8w3lUutYzJcVz' +
    'JOWr9T9DyudkEgg9aauY/YamvDIEhRWwwvnStojKzXx1AChfo62keENVvjwE' +
    'xScGmv3f4F9F/vIA/gtGZKqq9sgcggAAAABJRU5ErkJggg==' +
    '';

  function fix_videos(container, document) {

    log('fixing youtube videos in ' + container.nodeName);

    var i, j, k, index;

    var bad_elements = [];
    var bad_ids = [];

    function inspect_risky_element(elem) {
      log('inspect ' + elem.nodeName);
      if (elem.className == 'externalYoutube') {
        return;
      }
      var index = 0;
      var risky_attributes = risky_elements[j].attributes;
      for (k = 0; k < risky_attributes.length; k++) {
        var risky_node = risky_attributes[k].nodeValue;
        if (risky_node.indexOf('youtube-nocookie.com/') >= 0 ||
            risky_node.indexOf('youtube.com/') >= 0 ||
            risky_node.indexOf('ytimg.com/') >= 0) {
          if (risky_node.indexOf('/v/') >= 0) {
            index = risky_node.indexOf('/v/') + 3;
          } else if (risky_node.indexOf('/vi/') >= 0) {
            index = risky_node.indexOf('/vi/') + 4;
          } else if (risky_node.indexOf('?v=') >= 0) {
            index = risky_node.indexOf('?v=') + 3;
          } else if (risky_node.indexOf('/embed/') >= 0) {
            index = risky_node.indexOf('/embed/') + 7;
          }
          else if (risky_node.indexOf('youtu.be/') >= 0)
          {
            index = risky_node.indexOf('youtu.be/') + 9;
          }
          if (index > 0) {
            var video_id = risky_node.substring(index, index + 11);
            bad_elements.push(elem);
            bad_ids.push(video_id);
          }
          break;
        }
      }
    }

    var risky_elements;
    var risky_tags = ['a', 'object', 'embed', 'iframe'];
    var container_name = container.nodeName.toLowerCase();

    for (i = 0; i < risky_tags.length; i++) {
      if (container_name == risky_tags[i]) {
        inspect_risky_element(container);
      }
      risky_elements = container.getElementsByTagName(risky_tags[i]);
      for (j = 0; j < risky_elements.length; j++) {
        inspect_risky_element(risky_elements[j]);
      }
    }

    // Youtube videos on BoingBoing...
    risky_elements = container.getElementsByClassName('video-container-yt');
    for (j = 0; j < risky_elements.length; j++) {
      inspect_risky_element(risky_elements[j]);
    }
    risky_elements = container.getElementsByClassName('lazyYT');
    for (j = 0; j < risky_elements.length; j++) {
      var video_id = risky_elements[j].getAttribute('data-youtube-id');
      bad_elements.push(risky_elements[j]);
      bad_ids.push(video_id);
    }

    for (i = 0; i < bad_ids.length; i++) {
      var bad_elem = bad_elements[i];
      var width, height;
      var video_id, video_block, button, icon;
      var link_text;
      video_id = bad_ids[i];
      if (bad_elem.nodeName.toLowerCase() == 'a') {
        width = 0;
        height = 0;
        link_text = bad_elem.innerHTML;
      }
      else {
        var bbox = bad_elem.getBoundingClientRect();
        width = bbox.width;
        height = bbox.height;
        link_text = null;
      }
      if (width < 256 || height < 192) {
        width = 256;
        height = 192;
      }
      video_block = document.createElement('div');
      video_block.style.cssText =
        'width: ' + width + 'px !important; ' +
        'height: ' + height + 'px !important; ' +
        'position: relative !important; ' +
        'background-size: cover !important; ' +
        'background-position: center center !important; ' +
        'background-image: url("https://i3.ytimg.com/vi/' + video_id + '/0.jpg") !important; ' +
        '';
      // Top-right go to Youtube button.
      button = document.createElement('a');
      button.className = 'externalYoutube';
      button.setAttribute('href', 'https://www.youtube.com/watch?v=' + video_id);
      button.setAttribute('target', '_blank');
      button.style.cssText =
        'color: #000000 !important; ' +
        'background-color: transparent !important; ' +
        'display: block !important; ' +
        'width: ' + iconSize + 'px !important; ' +
        'height: ' + iconSize + 'px !important; ' +
        'position: absolute !important; ' +
        'left: ' + (width - iconSize) + 'px !important; ' +
        'top: 0px !important; ' +
        '';
      icon = document.createElement('img')
      icon.setAttribute('src', youtubeIcon);
      button.appendChild(icon);
      video_block.appendChild(button);
      // Centered play (in external player) button.
      button = document.createElement('a');
      button.setAttribute('href', 'youtube://' + video_id);
      button.style.cssText =
        'color: #000000 !important; ' +
        'background-color: transparent !important; ' +
        'display: block !important; ' +
        'width: ' + iconSize + 'px !important; ' +
        'height: ' + iconSize + 'px !important; ' +
        'position: absolute !important; ' +
        'left: ' + ((width - iconSize) / 2) + 'px !important; ' +
        'top: ' + ((height - iconSize) / 2) + 'px !important; ' +
        '';
      icon = document.createElement('img')
      icon.setAttribute('src', playIcon);
      button.appendChild(icon);
      video_block.appendChild(button);
      if (link_text) {
        var title = document.createElement('p');
        title.textContent = link_text;
        title.style.cssText =
          'background: black !important; ' +
          'color: white !important; ' +
          'width: 100% !important; ' +
          'text-align: center !important; ' +
          'position: absolute !important; ' +
          'font-style: normal !important; ' +
          'font-size: 16px !important; ' +
          'bottom: -16px !important; ' +
          '';
        video_block.appendChild(title);
      }
      bad_elements[i].parentNode.replaceChild(video_block, bad_elem);
    }
  }

  function mutationHandler(mutationRecords, doc) {

    mutationRecords.forEach(function (mutation) {
      var elem = mutation.target;
      log('mutation: ' + mutation.type + ' ' + elem.nodeName);
      if ('IFRAME' == elem.nodeName) {
        // fix_videos(elem.contentDocument, elem.contentDocument);
      }
      else {
        fix_videos(elem, doc);
      }
    });
  }

  fix_videos(window.document, window.document);

  window.document.addEventListener('DOMContentLoaded', function () {

    log('window content loaded [' +
        (window.top == window.self ? 'T' : 'I') + ':' +
        (window.name || window.location.href) + ']');

    // Circumvent Discourse link tracking...
    if (typeof Discourse !== 'undefined') {
      var trackClick = Discourse.ClickTrack.trackClick;
      Discourse.ClickTrack.trackClick = function (e)
      {
        var s = e.currentTarget.getAttribute('href');
        if (/^youtube:\/\//.test(s)) {
          window.open(s).close();
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        return true;
      }
    }

    fix_videos(window.document, window.document);

    // var observer = new window.MutationObserver(function (m) { mutationHandler(m, window.document); });
    // observer.observe(window.document, { childList: true, subtree: true, attributes: true });

    // var iframe_list = window.document.getElementsByTagName('iframe');
    // contentDocument

  }, false);

})();

// vim: expandtab list sw=2
