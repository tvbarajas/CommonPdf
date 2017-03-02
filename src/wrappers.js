const _exec = require( 'child_process' ).exec

/**
 * @export
 * @param {String} command
 * @returns {Promise<String|Error>} return standard error | standard in
 */
module.exports.exec = function wrapExec( command ) {
	return new Promise( ( fulfill, reject ) => {
		_exec( command, ( err, stdin, stderr ) => {
			err ?
				reject( new Error( `child_process::exec\narguments: ${command}\nfailure:\n\terr: ${err}\n\t stderr:
					${stderr}` ) ) :
				fulfill( stdin )
		} )
	} )
}


