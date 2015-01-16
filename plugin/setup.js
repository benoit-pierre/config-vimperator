
commands.addUserCommand(

  ['setup'],
  'setup configuration',

  function() {
    try {

      function log(text) {
	console.log('Setup: ' + text);
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

	  var xpi_name = name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
	  var xpi = File('~/.vimperator/extensions/' + xpi_name + '.xpi');

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

      // Install IXQuick search engine.
      if (null == Services.search.getEngineByAlias('ixquick')) {
	log('Installing IXQuick search engine.');
	// Services.search.addEngine(File('~/.vimperator/extensions/search-ixquick.xml').path, 'application/opensearchdescription+xml', 'https://ixquick.com/favicon.ico', false);
	window.external.AddSearchProvider('https://addons.mozilla.org/firefox/downloads/latest/12781/addon-12781-latest.xml');
      }

      // Addons. {{{

      // Adblock Plus. {{{

      installAddonIfNotAlready('Adblock Plus', '{d10d0bf8-f5b5-c8b4-a8b2-2b9879e08c5d}');

      // }}}

      // Classic Theme Restorer. {{{

      installAddonIfNotAlready('Classic Theme Restorer', 'ClassicThemeRestorer@ArisT2Noia4dev', function() {

	setPrefs({
	  'extensions.classicthemerestorer.bmanimation' : false         , // Disable bookmark animation.
	  'extensions.classicthemerestorer.closeabarbut': true          , // Hide addon bar close button.
	  'extensions.classicthemerestorer.hidenavbar'  : true          , // Hide navigation bar.
	  'extensions.classicthemerestorer.tabs'        : 'tabs_default', // Use tabs default look (for compatibility with some styles).
	});

      });

      // }}}

      // Disconnect. {{{

      installAddonIfNotAlready('Disconnect', '2.0@disconnect.me');

      // }}}

      // Download Status Bar. {{{

      installAddonIfNotAlready('Download Status Bar', '{6c28e999-ea90-4635-a39d-b1ec90ba0c0f}', function() {

	setPrefs({
	  'extensions.downloadbar.userinterface': "panel", // Use embedded panel rather than download bar.
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

      });

      // }}}

      // HTTPS Everywhere. {{{

      installAddonIfNotAlready('HTTPS Everywhere', 'https-everywhere@eff.org', function() {

	setPrefs({
	  'extensions.https_everywhere._observatory.enabled': false, // Disable observatory.
	});

      });

      // }}}

      // I don't care about cookies. {{{

      installAddonIfNotAlready("I don't care about cookies", 'jid1-KKzOGWgsW3Ao4Q@jetpack');

      // }}}

      // Privacy Badger. {{{

      installAddonIfNotAlready('Privacy Badger', 'jid1-MnnxcxisBPnSXQ@jetpack');

      // }}}

      // NoScript. {{{

      installAddonIfNotAlready('NoScript', '{73a6fe31-595d-460b-a920-fcc0f8843232}', function() {

	setPrefs({
	  'noscript.notify'        : false, // Disable notifications.
	  'noscript.contentBlocker': true , // Enable content blocking for white-listed sites too.
	  'noscript.confirmUnblock': false, // Do not ask for confirmation when unblocking.
	});

	// Set a few untrusted.
	var untrusted;
	try {
	  untrusted = Services.prefs.getCharPref('noscript.untrusted');
	}
	catch (err) {
	  untrusted = '';
	}
	untrusted += ' \
	  ad6media.fr \
	  addthis.com \
	  addtoany.com adnxs.com \
	  adroll.com \
	  adsonar.com \
	  adzerk.net \
	  amazon-adsystem.com \
	  areyouahuman.com \
	  bizible.com \
	  blockmetrics.com \
	  bluekai.com \
	  buysellads.com \
	  chartbeat.com \
	  chitika.net \
	  clicktale.net \
	  criteo.com \
	  crowdscience.com \
	  crsspxl.com \
	  crwdcntrl.net \
	  doubleclick.net \
	  effectivemeasure.net \
	  exelator.com \
	  exponential.com \
	  facebook.com facebook.net \
	  fbcdn.net \
	  fmpub.net \
	  gamer-network.net \
	  gigya.com \
	  google-analytics.com googleadservices.com googlesyndication.com googletagmanager.com googletagservices.com \
	  gorillanation.com \
	  kameleoon.com \
	  kontera.com \
	  krxd.net \
	  livefyre.com \
	  lphbs.com \
	  meebo.com \
	  mixpanel.com \
	  moatads.com \
	  monetize-me.com \
	  mookie1.com \
	  mxpnl.com \
	  netline.com \
	  newrelic.com \
	  oneall.com \
	  optimizely.com \
	  outbrain.com \
	  pingdom.net \
	  revsci.net \
	  rpxnow.com \
	  sail-horizon.com \
	  scorecardresearch.com \
	  simpli.fi \
	  sitemeter.com \
	  smartadserver.com \
	  stumbleupon.com \
	  tagcommander.com \
	  truste.com \
	  twimg.com \
	  twitter.com \
	  viglink.com \
	  w00tads.com \
	  zedo.com \
	';
	untrusted = untrusted.split(/\s+/);
	untrusted = untrusted.filter(function (value, index, self) {
	  return '' != value && self.indexOf(value) === index
	});
	untrusted = untrusted.sort();
	untrusted = untrusted.join(' ');
	Services.prefs.setCharPref('noscript.untrusted', untrusted);

      });

      // }}}

      // RequestPolicy. {{{

      installAddonIfNotAlready('RequestPolicy', 'requestpolicy@requestpolicy.com');

      // }}}

      // Self-Destructing Cookies. {{{

      installAddonIfNotAlready('Self-Destructing Cookies', 'jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack', function() {

	setPrefs({
	  'extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.displayNotification': false, // Disable notifications.
	  'extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.strictAccess'       : true , // Use strick access policy.
	});

      });

      // }}}

      // Stylish. {{{

      installAddonIfNotAlready('Stylish', '{46551EC9-40F0-4e47-8E18-8E5CF550CFB8}');

      // }}}

      // Tab Mix Plus. {{{

      installAddonIfNotAlready('Tab Mix Plus', '{dc572301-7619-498c-a57d-39143191b318}', function() {

	setPrefs({
	  'extensions.tabmix.focusTab'                : 4    , // Focus last selected tab on close.
	  'extensions.tabmix.hideAllTabsButton'       : false, // Show tab bar "all tabs" button.
	  'extensions.tabmix.hideTabBarButton'        : true , // Hide tab bar "close tab" button.
	  'extensions.tabmix.hideTabbar'              : 0    , // Never hide tab bar.
	  'extensions.tabmix.moveTabOnDragging'       : true , // Directly move tab on dragging.
	  'extensions.tabmix.newTabButton'            : false, // Hide tab bar "new tab" button.
	  'extensions.tabmix.openNewTabNext'          : true , // Open new tabs on the right of current tab.
	  'extensions.tabmix.openTabNext'             : true , // Open tabs on the right of current tab.
	  'extensions.tabmix.tabs.closeButtons.enable': false, // Hide tabs close button.
	});

      });

      // }}}

      // }}}

      // Dictionaries. {{{

      installAddonIfNotAlready('spell-en', 'en-US@dictionaries.addons.mozilla.org');
      installAddonIfNotAlready('spell-fr', 'fr-dicollecte@dictionaries.addons.mozilla.org');

      // }}}

      // Firefox preferences. {{{

      setPrefs({
	'browser.download.animateNotifications'   : false          , // Disable download animations...
	'browser.fullscreen.animateUp'            : 0              , // Disable fullscreen animations...
	'browser.newtab.url'                      : 'about:blank'  , // Set new tab page to blank.
	'browser.panorama.animate_zoom'           : false          , // Disable tab-groups animations...
	'browser.safebrowsing.enabled'            : false          , // Do not report to Google...
	'browser.safebrowsing.malware.enabled'    : false          ,
	'browser.sessionstore.interval'           : 60000          , // Save session every minute.
	'browser.startup.homepage'                : 'about:blank'  , // Set startup page to blank.
	'browser.startup.page'                    : 3              , // And restore last session on startup.
	'browser.tabs.animate'                    : false          , // And no animations...
	'browser.tabs.closeButtons'               : 3              , // No close button on tabs.
	'browser.tabs.closeWindowWithLastTab'     : false          , // Keep window open when closing last tab.
	'browser.tabs.selectOwnerOnClose'         : true           , // Focus owner on tab close.
	'datareporting.healthreport.uploadEnabled': false          , // Do not report to Mozilla...
	'devtools.theme'                          : "dark"         , // Use dark theme for developer tools.
	'dom.event.clipboardevents.enabled'       : false          , // Disable clipboard events.
	'general.smoothScroll'                    : false          , // Disable smooth scrolling.
	'nglayout.enable_drag_images'             : false          , // Disable image on drag and drop.
	'privacy.donottrackheader.enabled'        : true           , // Enable DoNotTrack.
	'signon.rememberSignons'                  : false          , // Disable password manager.
	'toolkit.scrollbox.smoothScroll'          : false          , // Disable tab bar smooth scrolling.
	'view_source.editor.external'             : true           , // Don't use internal editor for viewing sources.
	'view_source.editor.path'                 : "/usr/bin/gvim",
	});

      // }}}

    }
    catch (e) {
      liberator.echoerr(e);
    }
  }
);

// vim: ft=javascript sw=2 foldmethod=marker foldlevel=0
