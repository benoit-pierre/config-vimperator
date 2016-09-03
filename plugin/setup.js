var FileUtils = Cu.import("resource://gre/modules/FileUtils.jsm").FileUtils

commands.addUserCommand(

  ['setup'],
  'setup configuration',

  function() {
    try {

      // Helpers. {{{

      function log(text) {
	console.log('Setup: ' + text);
      }

      function sanitizeName(name) {
	return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      }

      function installAddonIfNotAlready(name, id, configure) {

	AddonManager.getAddonByID(id, function (addon) {

	  if (null != addon) {
	    // Already installed, setup.
	    if (null != configure) {
	      log('Configuring ' + name + ' addon.');
	      configure();
	    }
	    return;
	  }

	  log('Installing ' + name + ' addon.');

	  var xpi = new FileUtils.File('~/.vimperator/extensions/' + sanitizeName(name) + '.xpi');

	  AddonManager.getInstallForFile(xpi, function (install) {
	    install.install();
	  }, 'application/x-xpinstall');

	});
      }

      function setPrefs(prefs) {
	for (key in prefs) {
	  var val = prefs[key];
	  var fn;
	  if (typeof (val) == 'boolean') {
	    fn = Services.prefs.setBoolPref;
	  }
	  else if (typeof (val) == 'string') {
	    fn = Services.prefs.setCharPref;
	  }
	  else if (typeof (val) == 'number') {
	    fn = Services.prefs.setIntPref;
	  }
	  if (null != fn) {
	    fn(key, val);
	  }
	}
      }

      function updateCharList(initial_value, append_list) {
	var value_list;
	if (initial_value) {
	  value_list = initial_value.split(/\s+/);
	}
	else {
	  value_list = [];
	}
	value_list = value_list.concat(append_list)
	value_list = value_list.filter(function (value, index, self) {
	  return '' != value && self.indexOf(value) === index
	});
	value_list = value_list.sort();
	return value_list.join(' ');
      }

      function installGreasemonkeyScript(name, configure) {

        var scope = {};

	Components.utils.import('resource://greasemonkey/miscapis.js', scope)
	Components.utils.import('resource://greasemonkey/parseScript.js', scope);
	Components.utils.import('resource://greasemonkey/remoteScript.js', scope);

	var service = GM_util.getService();
	var script_file = new FileUtils.File('~/.vimperator/greasemonkey-scripts/' + sanitizeName(name) + '.user.js');
	var script_uri = Services.io.newFileURI(script_file).spec;
	var script_source = script_file.read();
	var script = scope.parse(script_source, script_uri);
	var configure_script = function (script) {
	  log('Configuring "' + name + '" Greasemonkey script.');
	  var storage = new scope.GM_ScriptStorage(script);
	  configure(script, storage);
	}

	var old_script = service._config.getScriptById(script.id);

	if (old_script) {
	  log('Already installed "' + name + '" Greasemonkey script.');
	  if (null != configure) {
	    configure_script(old_script);
	  }
	  return;
	}

	log('Installing "' + name + '" Greasemonkey script.');

	var remote_script = new scope.RemoteScript();
	var tmpfile_name = scope.cleanFilename(script.name, 'gm_script') + '.user.js';
	var tmpfile = GM_util.getTempFile(remote_script._tempDir, tmpfile_name);
	GM_util.writeToFile(script_source, tmpfile, function() {
	  remote_script.setScript(script, tmpfile);
	  remote_script.download(function (sucess) {
	    if (!sucess) {
	      liberator.echoerr('could not download ' + script_uri);
	      return;
	    }
	    remote_script.install();
	    configure(remote_script.script);
	  });
	});
      }

      function installSearchEngine(name, alias) {
	var engine = Services.search.getEngineByName(name);
	if (null != engine) {
	  return;
	}
	log('Installing ' + name + ' search engine.');
	var engine_file = new FileUtils.File('~/.vimperator/search-engines/' + sanitizeName(name) + '.xml');
	var engine_uri = Services.io.newFileURI(engine_file).spec;
	var callback = {
	  onSuccess: function (engine) {
	    engine.alias = alias;
	  },
	  onError: function (errorCode) {
	    liberator.echoerr(errorCode);
	  }
	};
	Services.search.addEngine(engine_uri, 1, null, true, callback);
      }

      // }}}

      // Addons. {{{

      // Classic Theme Restorer. {{{

      installAddonIfNotAlready('Classic Theme Restorer', 'ClassicThemeRestorer@ArisT2Noia4dev');

      // }}}

      // Dark Background and Light Text. {{{

      installAddonIfNotAlready('Dark Background and Light Text', 'jid1-QoFqdK4qzUfGWQ@jetpack');

      // Download Status Bar. {{{

      installAddonIfNotAlready('Download Status Bar', '{6c28e999-ea90-4635-a39d-b1ec90ba0c0f}', function() {

	setPrefs({
	  'extensions.downloadbar.closebar'     : true   , // Use embedded panel rather than download bar.
	  'extensions.downloadbar.userinterface': "panel",
	});

      });

      // }}}

      // FlashGot. {{{

      installAddonIfNotAlready('FlashGot', '{19503e42-ca3c-4c27-b1e2-9cdb2170ee34}', function() {

	// Setup and use custom downloader.
	setPrefs({
	  'flashgot.custom'                : "Downloader",
	  'flashgot.custom.Downloader.args': "--referer [REFERER] --dir [FOLDER] --out [FNAME] --load-cookies [CFILE] --uris [ULIST]",
	  'flashgot.custom.Downloader.exe' : "~/progs/bin/downloader",
	  'flashgot.defaultDM'             : "Downloader",
	});

      });

      // }}}

      // Greasemonkey. {{{

      installAddonIfNotAlready('Greasemonkey', '{e4a8a97b-f2ed-450b-b12d-ee082ba24781}', function() {

	setPrefs({
	  // Don't use internal editor.
	  'extensions.greasemonkey.editor': "/usr/bin/gvim",
	});

	installGreasemonkeyScript('External play Youtube videos');
	installGreasemonkeyScript('Input fields clear/paste buttons');
	installGreasemonkeyScript('Youtube Center');

      });

      // }}}

      // HackTheWeb. {{{

      installAddonIfNotAlready('HackTheWeb', 'hacktheweb@instantfox.com');

      // }}}

      // HTTPS Everywhere. {{{

      installAddonIfNotAlready('HTTPS Everywhere', 'https-everywhere@eff.org', function() {

	setPrefs({
	  'extensions.https_everywhere._observatory.enabled': false, // Disable observatory.
	});

      });

      // }}}

      // Mouse Gestures Suite. {{{

      installAddonIfNotAlready('Mouse Gestures Suite', 'mousegesturessuite@lemon_juice.addons.mozilla.org');

      // }}}

      // Self-Destructing Cookies. {{{

      installAddonIfNotAlready('Self-Destructing Cookies', 'jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack', function() {

	setPrefs({
	  'extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.displayNotification': false, // Disable notifications.
	  'extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.strictAccess'       : true , // Use strick access policy.
	});

      });

      // }}}

      // Toggle animated GIFs. {{{

      installAddonIfNotAlready('Toggle animated GIFs', 'giftoggle@simonsoftware.se', function() {

	setPrefs({
	  'extensions.togglegifs.defaultPaused'        : true, // Pause GIFs by default.
	  'extensions.togglegifs.shortcutReset'        : ''  , // No shortcut for resetting GIFs.
	  'extensions.togglegifs.shortcutToggle'       : ''  , // No shortcut for toggling GIFs.
	  'extensions.togglegifs.toggleOnClick'        : true, // Toggle GIFs on click.
	});

      });

      // }}}

      // uBlock Origin. {{{

      installAddonIfNotAlready('uBlock Origin', 'uBlock0@raymondhill.net');

      // }}}

      // uMatrix. {{{

      installAddonIfNotAlready('uMatrix', 'uMatrix@raymondhill.net');

      // }}}

      // }}}

      // Dictionaries. {{{

      installAddonIfNotAlready('spell-en', 'en-US@dictionaries.addons.mozilla.org');
      installAddonIfNotAlready('spell-fr', 'fr-dicollecte@dictionaries.addons.mozilla.org');

      // }}}

      // Firefox preferences. {{{

      log('Configuring Firefox.');

      setPrefs({
	'browser.download.animateNotifications'      : false          , // Disable download animations...
	'browser.fullscreen.animate'                 : false          , // Disable fullscreen animations...
	'browser.fullscreen.animateUp'               : 0              ,
	'browser.link.open_newwindow'                : 1              , // Open links, that would normally open in a new window, in the current tab/window.
	'browser.link.open_newwindow.restriction'    : 0              , // Divert all links according to browser.link.open_newwindow.
	'browser.newtab.url'                         : 'about:blank'  , // Set new tab page to blank.
	'browser.newtabpage.enabled'                 : false          , // Disable new tab page.
	'browser.panorama.animate_zoom'              : false          , // Disable tab-groups animations...
	'browser.safebrowsing.enabled'               : false          , // Do not report to Google...
	'browser.safebrowsing.malware.enabled'       : false          ,
	'browser.sessionstore.interval'              : 60000          , // Save session every minute.
	'browser.sessionstore.privacy_level'         : 2              , // Never store extra session data (e.g.: session cookies).
	'browser.sessionstore.privacy_level_deferred': 2              , // Same when quitting with browser.startup.page *not* set to restore previous session on startup.
	'browser.startup.homepage'                   : 'about:blank'  , // Set startup page to blank.
	'browser.startup.page'                       : 3              , // And restore last session on startup.
	'browser.tabs.animate'                       : false          , // And no animations...
	'browser.tabs.closeWindowWithLastTab'        : false          , // Keep window open when closing last tab.
	'browser.tabs.selectOwnerOnClose'            : true           , // Focus owner on tab close.
	'datareporting.healthreport.uploadEnabled'   : false          , // Do not report to Mozilla...
	'devtools.selfxss.count'                     : 100            , // Disable paste warning in devtools...
	'devtools.theme'                             : "dark"         , // Use dark theme for developer tools.
	'dom.event.clipboardevents.enabled'          : false          , // Disable clipboard events.
	'full-screen-api.transition-duration.enter'  : "0 0"          , // Disable fade-in on fullscreen transition.
	'full-screen-api.transition-duration.leave'  : "0 0"          , // Disable fade-out on fullscreen transition.
	'full-screen-api.warning.delay'              : 0              , // Disable delay on fullscreen transition notification.
	'full-screen-api.warning.timeout'            : 1000           , // Reduce timeout on fullscreen transition notification.
	'general.smoothScroll'                       : false          , // Disable smooth scrolling.
	'general.warnOnAboutConfig'                  : false          , // Disable about:config warning.
	'media.autoplay.enabled'                     : true           , // Disable auto-play of audio/video contents.
	'media.peerconnection.enabled'               : false          , // Disable WebRTC and PeerConnection.
	'media.volume_scale'                         : '0.125'        , // Change HTML5 default audio level from 'my ears will melt' to 50%...
	'nglayout.enable_drag_images'                : false          , // Disable image on drag and drop.
	'privacy.donottrackheader.enabled'           : false          , // Disable DoNotTrack.
	'signon.rememberSignons'                     : false          , // Disable password manager.
	'toolkit.scrollbox.smoothScroll'             : false          , // Disable tab bar smooth scrolling.
	'view_source.editor.external'                : true           , // Don't use internal editor for viewing sources.
	'view_source.editor.path'                    : "/usr/bin/gvim",
      });

      // }}}

      // Search engine. {{{

      log('Installing seach engines.');

      installSearchEngine('Amazon France'            , 'azf');
      installSearchEngine('Arch Linux Bugs'          , 'archb');
      installSearchEngine('Arch Linux Packages'      , 'arch');
      installSearchEngine('Arch Linux Wiki'          , 'archw');
      installSearchEngine('Github'                   , 'github');
      installSearchEngine('Google Play'              , 'gplay');
      installSearchEngine('Ixquick'                  , 'ixquick');
      installSearchEngine('Mozilla Developer Network', 'mdn');
      installSearchEngine('Steam'                    , 'steam');
      installSearchEngine('YouTube'                  , 'youtube');
      installSearchEngine('VIM'                      , 'vim');

      // }}}

      // UI. {{{

      try {
	CustomizableUI.beginBatchUpdate();

	// Add Firefox menu button at the end of the tab bar.
	CustomizableUI.addWidgetToArea('ctraddon_appbutton', CustomizableUI.AREA_TABSTRIP);

	// Add addons to the add-on bar (at the end, from left to right). {{{
	if ('toolbar' == CustomizableUI.getAreaType('ctraddon_addon-bar')) {
	  [
	    /* FlashGot Media                 */ 'flashgot-media-tbb',
	    /* Download Status Bar            */ 'downloadbar-ddnbr',
	    /* Dark Background and Light Text */ 'toggle-button--jid1-qofqdk4qzufgwqjetpack-configure-for-current-tab-button',
	    /* Greasemonkey                   */ 'greasemonkey-tbb',
	    /* Self-Destructing Cookies       */ 'action-button--jid0-9xfbwuwnvpx4wwsfbwmcm4jj69ejetpack-self-destructing-cookies',
	    /* uMatrix                        */ 'umatrix-button',
	    /* uBlock Origin                  */ 'ublock0-button',
	    /* HTTPS Everywhere               */ 'https-everywhere-button',
	    /* HackTheWeb                     */ 'hacktheweb-toolbutton-all',
	  ].forEach(function (b) {
	    CustomizableUI.addWidgetToArea(b, 'ctraddon_addon-bar');
	  });
	}
	// }}}
      }
      finally {
	CustomizableUI.endBatchUpdate();
      }

      // }}}
    }
    catch (e) {
      liberator.echoerr(e);
    }
  }
);

// vim: ft=javascript sw=2 foldmethod=marker foldlevel=0
