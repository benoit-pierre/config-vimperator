
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

	  var xpi = File('~/.vimperator/extensions/' + sanitizeName(name) + '.xpi');

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
	var script_file = File('~/.vimperator/greasemonkey-scripts/' + sanitizeName(name) + '.user.js');
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
	var engine_file = File('~/.vimperator/search-engines/' + sanitizeName(name) + '.xml');
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

      function installStylishStyle(name, uri) {
	var style_file = File('~/.vimperator/stylish-styles/' + sanitizeName(name) + '.css');
	log('Installing "' + name + '" Stylish style.');
	if (null == uri) {
	  uri = Services.io.newFileURI(style_file).spec;
	}
	var css = style_file.read();
	var style = Components.classes["@userstyles.org/style;1"].createInstance(Components.interfaces.stylishStyle);
	style.mode = style.CALCULATE_META | style.REGISTER_STYLE_ON_CHANGE;
	style.init(uri, uri, uri, null, name, css, false, css, null, null);
	stylishCommon.openInstall({style: style, installCallback: null});
      }

      // }}}

      // Addons. {{{

      // BetterPrivacy. {{{

      installAddonIfNotAlready('BetterPrivacy', '{d40f5e7b-d2cf-4856-b441-cc613eeffbe3}', function() {

	setPrefs({
	  'extensions.bprivacy.DefaultFlashCookieDeletion': true, // Delete default Flashplayer cookie too.
	  'extensions.bprivacy.donotaskonexit'            : true, // Don't confirm deletion on exit.
	});

      });

      // }}}

      // Classic Theme Restorer. {{{

      installAddonIfNotAlready('Classic Theme Restorer', 'ClassicThemeRestorer@ArisT2Noia4dev', function() {

	setPrefs({
	  'extensions.classicthemerestorer.bmanimation' : false         , // Disable bookmark animation.
	  'extensions.classicthemerestorer.closeabarbut': true          , // Hide addon bar close button.
	  'extensions.classicthemerestorer.hidenavbar'  : false         , // Don't hide navigation bar (let vimperator handle it).
	  'extensions.classicthemerestorer.pananimation': false         , // Disable panel animation.
	  'extensions.classicthemerestorer.tabs'        : 'tabs_default', // Use tabs default look (for compatibility with some styles).
	});

      });

      // }}}

      // Cookie Controller. {{{

      installAddonIfNotAlready('Cookie Controller', '{ac2cfa60-bc96-11e0-962b-0800200c9a66}', function() {

	setPrefs({
	  'extensions.cookieController.startOff': true, // Start in "no cookie" mode.
	});

      });

      // }}}

      // Download Status Bar. {{{

      installAddonIfNotAlready('Download Status Bar', '{6c28e999-ea90-4635-a39d-b1ec90ba0c0f}', function() {

	setPrefs({
	  'extensions.downloadbar.closebar'     : true   , // Use embedded panel rather than download bar.
	  'extensions.downloadbar.userinterface': "panel",
	});

      });

      // }}}

      // FireGestures. {{{

      installAddonIfNotAlready('FireGestures', 'firegestures@xuldev.org', function() {

	// Update mappings. {{{

	var all_mappings = FireGestures._gestureMapping.getMappingArray();
	var custom_mappings = [
	  ['Back'                  , 'U'         , 'Browser:Back'                                                                                                       ],
	  ['Forward'               , 'D'         , 'Browser:Forward'                                                                                                    ],
	  ['Reload'                , 'UD'        , 'Browser:Reload'                                                                                                     ],
	  ['Undo Close Tab'        , 'LR'        , 'FireGestures:UndoCloseTab'                                                                                          ],
	  ['[Popup] List all tabs' , 'RL'        , 'FireGestures:AllTabsPopup'                                                                                          ],
	  ['Previous Tab'          , 'wheel-up'  , 'FireGestures:PreviousTab'                                                                                           ],
	  ['Next Tab'              , 'wheel-down', 'FireGestures:NextTab'                                                                                               ],
	  ['Scroll to Top'         , 'LU'        , 'FireGestures:ScrollTop'                                                                                             ],
	  ['Scroll to Bottom'      , 'LD'        , 'FireGestures:ScrollBottom'                                                                                          ],
	  ['Close Tab, Focus Left' , 'L'         , 'var t = gBrowser.mCurrentTab; if (t.previousSibling) --gBrowser.mTabContainer.selectedIndex; gBrowser.removeTab(t);'],
	  ['Close Tab, Focus Right', 'R'         , 'var t = gBrowser.mCurrentTab; if (t.nextSibling) ++gBrowser.mTabContainer.selectedIndex; gBrowser.removeTab(t);'    ],
	];

	// Update existing mappings.
	for (var i = 0; i < all_mappings.length; ++i) {
	  var mapping = all_mappings[i];
	  for (var j = 0; j < custom_mappings.length; ++j) {
	    var custom = custom_mappings[j];
	    // Same mapping (name)?
	    if (mapping[1] == custom[0]) {
	      // Update mapping gesture.
	      mapping[3] = custom[1];
	      // Update mapping script if applicable.
	      if (2 == mapping[0]) {
		mapping[2] = custom[2];
	      }
	      // Remove mapping from the custom table so we don't duplicate it latter.
	      custom_mappings.splice(j, 1);
	      break;
	    }
	    // Same gesture?
	    if (mapping[3] == custom[1]) {
	      // Clear conflicting gesture.
	      mapping[3] = ''
	    }
	  }
	}

	// Add new mappings.
	for (var j = 0; j < custom_mappings.length; ++j) {
	  var custom = custom_mappings[j];
	  all_mappings.push([
	    2,         // Type.
	    custom[0], // Name.
	    custom[2], // Command.
	    custom[1], // Gesture.
	    null,      // Flags.
	  ]);
	}

	// Save back all mappings.
	FireGestures._gestureMapping.saveUserMapping(all_mappings);

	// }}}

      });

      // }}}

      // Flash Control. {{{

      installAddonIfNotAlready('Flash Control', 'jid1-sNL73VCI4UB0Fw@jetpack');

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
	installGreasemonkeyScript('Youtube Center', function (script, storage) {
	  var config = storage.getValue('YouTubeCenterSettings');
	  if (config) {
	    config = JSON.parse(config);
	  }
	  else {
	    config = {}
	  }
	  config = Object.extend(config, {
	    "playlistAutoPlay"                      : false,
	    "enableYouTubeShortcuts"                : false,
	    "topScrollPlayerAnimation"              : false,
	    "topScrollPlayerEnabledOnlyVideoPlaying": false,
	    "embed_defaultAutoplay"                 : false,
	    "videoThumbnailAnimationEnabled"        : false,
	    "forcePlayerType"                       : "html5",
	    "embed_forcePlayerType"                 : "html5",
	    "channel_forcePlayerType"               : "html5",
	    "watchedVideosIndicator"                : false,
	    "enableResize"                          : false,
	    "preventAutoPlay"                       : true,
	    "preventAutoBuffer"                     : true,
	    "preventTabAutoPlay"                    : true,
	    "preventTabAutoBuffer"                  : true,
	    "preventTabPlaylistAutoPlay"            : true,
	    "preventTabPlaylistAutoBuffer"          : true,
	    "preventPlaylistAutoPlay"               : true,
	    "preventPlaylistAutoBuffer"             : true,
	    "enableShortcuts"                       : false,
	    "enableVolume"                          : true,
	    "volume"                                : 50,
	    "enableRepeat"                          : false,
	    "lightbulbEnable"                       : false,
	    "channel_autoVideoQuality"              : "hd720",
	    "channel_preventAutoPlay"               : true,
	    "channel_enableVolume"                  : true,
	    "channel_volume"                        : 50,
	    "embed_autoVideoQuality"                : "hd720",
	    "embed_preventAutoPlay"                 : true,
	    "embed_enableVolume"                    : true,
	    "embed_volume"                          : 50,
	    "resizeEnable"                          : false,
	    "aspectEnable"                          : false,
	  });
	  storage.setValue('YouTubeCenterSettings', JSON.stringify(config));
	});

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

      // NoScript. {{{

      installAddonIfNotAlready('NoScript', '{73a6fe31-595d-460b-a920-fcc0f8843232}', function() {

	var config = JSON.parse(noscriptUtil.service.serializeConf());

	config.prefs['notify']             = false; // Disable notifications.
	config.prefs['contentBlocker']     = true;  // Enable content blocking for white-listed sites too.
	config.prefs['confirmUnblock']     = false; // Do not ask for confirmation when unblocking.
	config.prefs['forbidFlash']        = false  // Don't block flash.
	config.prefs['forbidFonts']        = false  // Don't block fonts.
	config.prefs['forbidMedia']        = false  // Don't block HTML5 audio/video.
	config.prefs['forbidPlugins']      = false  // Don't block plugins.
	config.prefs['forbidWebGL']        = true;  // Disable WebGL.
	config.prefs['autoReload.allTabs'] = false; // Only reload the current tab on permission change.
	config.prefs['global']             = true;  // Allow scripts globally.

	noscriptUtil.service.restoreConf(JSON.stringify(config));

      });

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

      // Stylish. {{{

      installAddonIfNotAlready('Stylish', '{46551EC9-40F0-4e47-8E18-8E5CF550CFB8}', function() {

	setPrefs({
	  'extensions.stylish.editorWindowMode': 1, // Open editor in a popup window.
	});

	installStylishStyle('Amazon Inverted'                          , null);
	installStylishStyle('Arch Linux Inverted'                      , null);
	installStylishStyle('Ars Technica Inverted'                    , null);
	installStylishStyle('BBC Inverted'                             , null);
	installStylishStyle('BoingBoing Inverted'                      , null);
	installStylishStyle('Dark input fields: white on black'        , null);
	installStylishStyle('Firefox: about:black'                     , 'https://userstyles.org/styles/42706/about-black');
	installStylishStyle('Firefox: flat tabs'                       , 'https://userstyles.org/styles/86995/firefox-flatstudio-tabs-like-tabs-2-css');
	installStylishStyle('Firefox: uBlock popup with no navbar fix' , null);
	installStylishStyle('Gaming on Linux Inverted'                 , null);
	installStylishStyle('GitHub Inverted'                          , null);
	installStylishStyle('Gmail Inverted'                           , null);
	installStylishStyle('Gmail: fixed font'                        , 'https://userstyles.org/styles/52863/fixed-font-gmail');
	installStylishStyle('Gmail: larger fonts'                      , 'https://userstyles.org/styles/109438/gmail-larger-fonts');
	installStylishStyle('Kickstarter Inverted'                     , null);
	installStylishStyle('NewsBlur - Kemwer Black'                  , 'https://userstyles.org/styles/86275/newsblur-kemwer-black');
	installStylishStyle('OsNews Inverted'                          , null);
	installStylishStyle('Phoronix Inverted'                        , null);
	installStylishStyle('Rock, Paper, Shotgun, Inverted'           , null);
	installStylishStyle('Rock, Paper, Shotgun: centered'           , 'https://userstyles.org/styles/93689/rock-paper-centered');
	installStylishStyle('Slashdot Inverted'                        , null);
	installStylishStyle('SourceForge Inverted'                     , null);
	installStylishStyle('Stack Overflow Inverted'                  , null);
	installStylishStyle('Wikipedia Inverted'                       , null);
	installStylishStyle('Youtube: Black by Panos'                  , 'https://userstyles.org/styles/62289/black-youtube-by-panos');
	installStylishStyle('Youtube: Flashblock fix'                  , null);
	installStylishStyle('Youtube: improved layout'                 , null);

      });


      // }}}

      // Tab Mix Plus. {{{

      installAddonIfNotAlready('Tab Mix Plus', '{dc572301-7619-498c-a57d-39143191b318}', function() {

	setPrefs({
	  'extensions.tabmix.focusTab'                : 4    , // Focus last selected tab on close.
	  'extensions.tabmix.hideAllTabsButton'       : false, // Show tab bar "all tabs" button.
	  'extensions.tabmix.hideTabBarButton'        : true , // Hide tab bar "close tab" button.
	  'extensions.tabmix.hideTabbar'              : 0    , // Never hide tab bar.
	  'extensions.tabmix.linkTarget'              : true , // Open links with a target attribute in current tab.
	  'extensions.tabmix.moveTabOnDragging'       : true , // Directly move tab on dragging.
	  'extensions.tabmix.newTabButton'            : false, // Hide tab bar "new tab" button.
	  'extensions.tabmix.openNewTabNext'          : true , // Open new tabs on the right of current tab.
	  'extensions.tabmix.openTabNext'             : true , // Open tabs on the right of current tab.
	  'extensions.tabmix.tabs.closeButtons.enable': false, // Hide tabs close button.
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
	'browser.fullscreen.animateUp'               : 0              , // Disable fullscreen animations...
	'browser.link.open_newwindow'                : 1              , // Open links, that would normally open in a new window, in the current tab/window.
	'browser.link.open_newwindow.restriction'    : 0              , // Divert all links according to browser.link.open_newwindow.
	'browser.newtab.url'                         : 'about:blank'  , // Set new tab page to blank.
	'browser.panorama.animate_zoom'              : false          , // Disable tab-groups animations...
	'browser.safebrowsing.enabled'               : false          , // Do not report to Google...
	'browser.safebrowsing.malware.enabled'       : false          ,
	'browser.sessionstore.interval'              : 60000          , // Save session every minute.
	'browser.sessionstore.privacy_level'         : 2              , // Never store extra session data (e.g.: session cookies).
	'browser.sessionstore.privacy_level_deferred': 2              , // Same when quitting with browser.startup.page *not* set to restore previous session on startup.
	'browser.startup.homepage'                   : 'about:blank'  , // Set startup page to blank.
	'browser.startup.page'                       : 3              , // And restore last session on startup.
	'browser.tabs.animate'                       : false          , // And no animations...
	'browser.tabs.closeButtons'                  : 3              , // No close button on tabs.
	'browser.tabs.closeWindowWithLastTab'        : false          , // Keep window open when closing last tab.
	'browser.tabs.selectOwnerOnClose'            : true           , // Focus owner on tab close.
	'datareporting.healthreport.uploadEnabled'   : false          , // Do not report to Mozilla...
	'devtools.selfxss.count'                     : 100            , // Disable paste warning in devtools...
	'devtools.theme'                             : "dark"         , // Use dark theme for developer tools.
	'dom.event.clipboardevents.enabled'          : false          , // Disable clipboard events.
	'general.smoothScroll'                       : false          , // Disable smooth scrolling.
	'general.warnOnAboutConfig'                  : false          , // Disable about:config warning.
	'media.peerconnection.enabled'               : false          , // Disable WebRTC and PeerConnection.
	'media.volume_scale'                         : '0.125'        , // Change HTML5 default audio level from 'my ears will melt' to 50%...
	'network.cookie.cookieBehavior'              : 1              , // Only cookies from the originating server are allowed.
	'network.cookie.lifetimePolicy'              : 2              , // The cookie expires at the end of the session (when the browser closes).
	'network.http.referer.XOriginPolicy'         : 1              , // Only send if base domains match.
	'network.http.referer.spoofSource'           : true           , // Spoof the referrer and use the target URI instead.
	'network.http.referer.trimmingPolicy'        : 2              , // Send scheme, host and port.
	'network.http.sendRefererHeader'             : 1              , // Send only when links are clicked.
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
	    /* FlashGot Media           */ 'flashgot-media-tbb',
	    /* Download Status Bar      */ 'downloadbar-ddnbr',
	    /* Stylish                  */ 'stylish-toolbar-button',
	    /* Greasemonkey             */ 'greasemonkey-tbb',
	    /* Cookie Controller        */ 'cookieControllerToggleButton', 'cookieControllerPermMenubutton',
	    /* Flash Control            */ 'toggle-button--jid1-snl73vci4ub0fwjetpack-flashctrlbtn',
	    /* Self-Destructing Cookies */ 'action-button--jid0-9xfbwuwnvpx4wwsfbwmcm4jj69ejetpack-self-destructing-cookies',
	    /* uMatrix                  */ 'umatrix-button',
	    /* uBlock Origin            */ 'ublock0-button',
	    /* NoScript                 */ 'noscript-tbb',
	    /* HTTPS Everywhere         */ 'https-everywhere-button',
	    /* HackTheWeb               */ 'hacktheweb-toolbutton-all',
	  ].forEach(function (b) {
	    CustomizableUI.addWidgetToArea(b, 'ctraddon_addon-bar');
	  });
	}
	// }}}
      }
      finally {
	CustomizableUI.endBatchUpdate();
      }

      // Cookie Controller mode is reset when the button moved...
      setPrefs({
	'extensions.cookieController.startOff': true, // Start in "no cookie" mode.
      });

      // }}}
    }
    catch (e) {
      liberator.echoerr(e);
    }
  }
);

// vim: ft=javascript sw=2 foldmethod=marker foldlevel=0
