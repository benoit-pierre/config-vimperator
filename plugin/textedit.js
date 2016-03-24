// Initially done via autocmd (see above), then rewritten based on [1] and adopted for Vimperator.
// 1: http://ingo-karkat.de/blog/2012/05/22/Pentadactyl%20set%20filetype%20in%20external%20Vim%20editor%20based%20on%20URL.html
// Get options for `editor`.
// These get used with `set ` prepended and passed to `editor` via `-c`.
function editExternallyGetOptions() {
	// return 'spell | echom "foo"';
	// These differ between Pentadactyl and Vimperator.
	var host = content.location.host;
	var path = content.location.pathname;
	// alert(host, path);
	switch(host.replace(/^www\./, "")) {
		case "github.com":
			if (! path.match("/wiki/"))
				return "ft=markdown spell";
			// TODO: handle /wiki
		case "reddit.com":
		case "stackoverflow.com":
			return "ft=markdown spell";
	}
	if (host.match(/^mail\./))
		return 'ft=mail spell';
	if (host.match(/.*\.wikia\.com$/) || host.match(/.*\.wikipedia\.org$/))
		return "ft=mediawiki spell";
	if (path.match(/\/phpmyadmin\//))
		return 'ft=html spell';
	if (host == 'code.djangoproject.com')
		return 'ft=tracwiki';
	if (buffer.URL.match(/^https?:\/\/.*trac.*\/wiki\//))
		return 'sw=4 ft=tracwiki';
	return 'spell';
}
function editExternallyWithOptions() {
	var edopts = editExternallyGetOptions();
	var save_editor = options["editor"];
	options["editor"] = options["editor"] + ' -c "set ' + edopts.replace(/"/g, '\\"') + '"';
	// alert(options['editor']);
	editor.editFieldExternally();
	options["editor"] = save_editor;
}
// Overwrite Ctrl-I input mapping.
mappings.addUserMap([modes.INSERT], ["<c-i>"], "Launch the external editor.", editExternallyWithOptions);
// Alternative mapping in case <C-i> is taken, e.g. in reddit/stackoverflow comments.
mappings.addUserMap([modes.INSERT], ["<c-e>"], "Launch the external editor.", editExternallyWithOptions);
