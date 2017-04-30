'use strict'

// Modules
const path = require('path')
const matter = require('gray-matter')
const Remarkable = require('remarkable')
const hljs = require('highlight.js')
const dateformat = require('dateformat')
const config = require('_config')

// Enable highlight.js for parser
var md = new Remarkable({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  }
})

module.exports = function(directory, file) {
	let content = path.join(directory, file)
	let parser = matter.read(content)

	let payload = parser.data

	// Set filename
	payload.filename = file.split('.')[0] + '.html'
	console.log(payload.filename)
	
	// If date field exists, format it
	if ( payload.date ) {
		let date = new Date(payload.date)
		payload.date = dateformat(date, 'dddd, mmmm dS, yyyy')
	}
	
	// if markdown content is present, parse it 
	if ( parser.content ) {
		payload.markdown = md.render(parser.content)
	}

	if (payload.require) {
		payload.custom = require(path.join(config.path, payload.require))
	}

	return payload
}