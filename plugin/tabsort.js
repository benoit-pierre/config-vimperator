
// function tabsort() { liberator.execute(':silent delcommand tabsort'); liberator.execute(':source ~/.vimperator/plugin/tabsort.js'); liberator.execute(':tabsort'); }

commands.addUserCommand(

  ['tabsort'],
  'sort tabs',

  function() {
    try {

      var group_tabs = true;
      var group_all = false;
      var group_minsize = 5;
      var sort_key = 'location';

      var tld_serv = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);

      function log(text) {
	console.log('TabSort: ' + text);
      }

      function new_tab(tab, index) {
	var uri = gBrowser.getBrowserForTab(tab).currentURI;
	var scheme = uri.scheme.replace(/^https$/, 'http');
	try {
	  var base_domain = tld_serv.getBaseDomain(uri);
	  var sub_domain = base_domain.length < uri.host.length ? '.' + uri.host.slice(0, -base_domain.length-1) : '';
	  var port = -1 == uri.port ? '' : ':' + uri.port;
	}
	catch (e) {
	  var base_domain = '';
	  var sub_domain = '';
	  var port = '';
	}
	return {
	  tab: tab,
	  index: index,
	  domain: base_domain || scheme,
	  location: scheme + ':' + base_domain + sub_domain + port + uri.path,
	};
      }

      var browser_tabs = (group_tabs && group_all) ? tabGroup.tabView.AllTabs.tabs : gBrowser.visibleTabs;

      log(browser_tabs.length + ' tabs');

      var start = Date.now();

      var tabs = [];
      var tabs_index = [];

      for (var n = 0; n < browser_tabs.length; ++n) {
	var tab = browser_tabs[n];

        if (tab.pinned) {
	  log('pinned ' + n + ': ' + tab.label);
	  continue;
	}

	browser = gBrowser.getBrowserForTab(tab);
	tabs.push(new_tab(tab, n));
	tabs_index.push(n);
      }

      log('sorting ' + tabs.length + ' tabs');

      tabs.sort(function(a, b) {
	return a[sort_key] > b[sort_key];
      });

      var nb_moves = 0;
      
      if (group_tabs) {
	var groups = {}
	for (let tab of tabs) {
	  var group = groups[tab.domain];
	  if (!groups[tab.domain]) {
	    groups[tab.domain] = [tab];
	  }
	  else {
	    groups[tab.domain].push(tab);
	  }
	}
	for (let group_name in groups) {
	  var tabs = groups[group_name];
	  if (tabs.length < group_minsize) {
	    continue;
	  }
	  var group = tabGroup.getGroup(group_name);
	  if (!group) {
	    group = tabGroup.createGroup(group_name, false);
	  }
	  for (let n in tabs) {
	    var tab = tabs[n];
	    tabGroup.moveTab(tab.tab, group, false);
	    ++nb_moves;
	  }
	}
      }
      else
      {
	for (var n = tabs.length; n-- > 0; ) {
	  var tab = tabs[n];
	  if (tab.index == tabs_index[n]) {
	    continue;
	  }
	  if (tab.tab == gBrowser.visibleTabs[tabs_index[n]]) {
	    continue;
	  }
	  gBrowser.moveTabTo(tab.tab, tabs_index[n]);
	  ++nb_moves;
	}
      }

      log('moved ' + nb_moves + ' tabs in ' + (Date.now() - start) / 1000.0);
    }
    catch (e) {
      liberator.echoerr(e);
    }
  }
);

// vim: ft=javascript sw=2 foldmethod=marker foldlevel=0
