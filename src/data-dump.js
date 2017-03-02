const exec = require( "./wrappers.js" ).exec;
const child = require('child_process')

/**
 * @desc use pdftk's dump_data_fields and dump_data, as well as pdftotext and pdfimages (poppler-utils) to extract
 *      pdf data in json format for upstream parsing and manipulation
 *
 * @todo: refactor to use exec wrapper. Goal of continue progress towards async / await implementations
 */
class DataDump {
	constructor() {
		/**
		 *
		 * @type {null|Boolean}
		 */
		this.popplerUtils = null
		/**
		 *
		 * @type {{pdftotext: {}, pdfimages: {}, pdftk: {}}}
		 */
		this.options = {
			pdftotext: {},
			pdfimages: {},
			pdftk: {}
		}

		this._popplerCheck()
			.then( check => {
				Object.defineProperty( this, 'popplerUtils', {
					value: check && check.length === 0,
					writable: false,
					configurable: false,
					enumerable: false
				} )
			} )

	}

	/**
	 * @desc Check for poppler-utils on path
	 *
	 * @returns {Promise<void|[String]>}
	 * @private
	 */
	_popplerCheck() {
		return new Promise( ( fulfill, reject ) => {
			Promise.all( [ 'pdftotext', 'pdfimages' ].map( e => {
				child.exec( `${e} -h`, ( err, stdin, stderr ) => {
					return new Promise( fulfill => {
						if( err || stderr ) fulfill( e )
						else fulfill()
					} )
				} )
			} ) )
				.then( i => {
					fulfill( i )
				} )
				.catch( e => {
					reject( e )
				} )
		} )
	}

	/**
	 * @param {String} pdf - pdf file path
	 * @returns {Promise<Array>} - field dump file path
	 */
	static _extractFieldNames( pdf ) {
		return new Promise( ( fulfill, reject ) => {
			child.exec( `pdftk ${pdf} dump_data_fields`, ( err, stdout, stderr ) => {
				if( err ) reject( err )
				fulfill( stdout.split( '---' )
					.filter( i => i.length > 3 )
					.reduce( ( accum, item, index ) => {
						let field = {},
							line = item.split( '\n' )
								.filter( i => i.length > 1 ),
							name = line.map( i => i.substr( 0, i.indexOf( ':' ) ) ),
							value = line.map( i => i.substr( i.indexOf( ':' ) + 2 ) )
						name.forEach( ( p, i ) => {
							if( !field.hasOwnProperty( p ) ) field[ p ] = value[ i ]
						} )
						if( field[ 'FieldType' ].trim().length === 0 ) return accum
						else {
							accum.push( field )
							return accum
						}
					}, [] ) )
			} )
		} )
	}

	extractTextContent( pdf ) {
		return new Promise( ( fulfill, reject ) => {
			if( !this.popplerUtils )
				reject( 'pdfimages and/or pdftotext not found. Please install poppler-utils and place on your path.' )
			else {
				let command = `pdftotext ${pdf}`
				exec( command )
					.then( ( err, stdin ) => {

					} )
			}
		} )
	}
}

module.exports.DataDump = DataDump
