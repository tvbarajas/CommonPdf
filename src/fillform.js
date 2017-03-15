'use strict'
const fs = require( 'fs' ),
	exec = require( 'child_process' ).exec,
	join = require( 'path' ).join

class FillForm {
	/**
	 * @param {String} fdfFilePath - fdf file path
	 * @param {String} pdfFilePath - pdf file path
	 * @param {Array} [options] - Available options: flatten, more to come....
	 * @todo Add check that files exist
	 */
	constructor( fdfFilePath, pdfFilePath, options ) {
		this.fdf = fdfFilePath
		this.pdf = join( __dirname, pdfFilePath )
		this.out = `${this.pdf.substr( 0, this.pdf.length - 4 )}.fill.pdf`
		if( options && !Array.isArray( options ) ) throw new Error( 'Options must be in Array format' )
		this.options = options || []
	}

	/**
	 *
	 * @returns {Promise<String>} - filled pdf file path
	 */
	write() {
		return new Promise( ( fulfill, reject ) => {
			let command = `pdftk ${this.pdf} fill_form ${this.fdf} output ${this.out} ${
				this.options.join( " " ).toLowerCase()}`
			exec( command,
				( error, stdout, stderr ) => {
					if( error || stderr ) reject( error )
					else fulfill( this.out )
				} )
		} )
	}
}

module.exports.FillForm = FillForm
