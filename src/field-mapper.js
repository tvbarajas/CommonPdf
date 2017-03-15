/**
 * Created by skyslope on 3/3/17.
 */

/**
 * @example let userData = {firstName: 'Joe', lastName: 'Smith', ...values}
 *          let Mapper = new FieldMapper('fw9', userData)
 * @class
 * @property {Object} pdfFields - Parsed json file
 */
class FieldMapper {
	/**
	 *
	 * @param {String} pdf - JSON
	 * @param {Object} data
	 */
	constructor(pdf, data) {
		this.pdfFields = null
		try  {
			this.pdfFields = JSON.parse(require(`../pdfs/${pdf}/fields_map.json`))
		}
		catch(e) {
			throw new Error(`CommonPdf::FieldMapper\nJSON.parse failed with error: ${e.message}\n${e.stack}`)
		}
	}

	/**
	 *
	 * @returns {Promise<{key:String, value:String|Boolean}>}
	 */
	write() {
		return new Promise((fulfill, reject) => {
			if(!this.pdfFields)	reject('This should have thrown an error before you got here?')
		})
	}
}
