'use strict'

// Modules
const fs = require('fs')
const template = require('nunjucks')
const http = require('http')
const path = require('path')

const config = require('_config')
const parser = require('parser')

// Writing pages
config.input.forEach(directory => {

	// Read the files from the specified directory
	let files = fs.readdirSync(directory)
	
	// Render page for each of the files in the directory
	files.forEach(file => {

		// Render ONLY .md files
		if (path.extname(file) === '.md') {
			config.page = parser(directory, file)

			// Return if no layout is specified
			if (!config.page.layout) {
				return console.log('No layout specified')
			}

			// Render using nunjucks
			let layout = path.join(config.templates, config.page.layout)
			let rendered = template.render(layout, config)

			// If outputPath does not exist, create it
			if (!fs.existsSync(config.output) ) {
				fs.mkdirSync(config.output)
			}

			// Set outputPath
			let outputPath = config.output

			// If page.path is set, set alternative outputPath
			if (config.page.path) {
				outputPath = path.join(outputPath, config.page.path)

				// If new path does not exist, create it
				if (!fs.existsSync(outputPath)) {
					fs.mkdirSync(outputPath)
				}
			}

			// Set file output
			let outputFile = path.join(outputPath, config.page.filename)

			// Debug 
			console.log(outputFile)

			// Write output file
			fs.writeFileSync(outputFile, rendered)
		}
	})
})