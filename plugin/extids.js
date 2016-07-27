
commands.addUserCommand(

  ['extids'],
  'list installed extensions and their IDs',

  function() {
    try {
      let extensions = liberator.extensions;

      if (extensions.length > 0) {
	let list = template.tabular(
	  ["Name", "ID"],
	  extensions.map(e => [template.icon(e, e.name), e.id])
	);

	commandline.echo(list, commandline.HL_NORMAL, commandline.FORCE_MULTILINE);
      }
      else {
	liberator.echoerr("No extensions installed");
      }
    }
    catch (e) {
      liberator.echoerr(e);
    }
  }
);

// vim: ft=javascript sw=2 foldmethod=marker foldlevel=0
