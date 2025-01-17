const fs = require('fs')
const path = require('path')

/**
 * @typedef {Object} Args
 * @property {string} [folder]
 * @property {string} [start]
 * @property {string} [end]
 * @property {string} [alias]
 * @property {string} [file]
 */

/** @type {Args} */
const args = process.argv.slice(2).reduce((acc, arg) => {
	const [key, value] = arg.split('=')
	acc[key] = value
	return acc
}, {})

// Set defaults and parse values
const targetDir = args.folder || path.join('.', 'books', 'hobbit')
const startNum = parseInt(args.start || '1')
const endNum = parseInt(args.end || '19')
const alias = args.alias || ''
const createFile = args.file === 'true'

// Validate number inputs
if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
	console.error(
		'Invalid number range. Usage: node createFolders.js folder=path/to/dir start=1 end=19 alias=prefix file=true'
	)
	process.exit(1)
}

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir, { recursive: true })
	console.log(`Created target directory: ${targetDir}`)
}

// Create folders from startNum to endNum
for (let i = startNum; i <= endNum; i++) {
	const folderName = alias ? `${alias}-${i}` : i.toString()
	const folderPath = path.join(targetDir, folderName)

	// Create folder if it doesn't exist
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath)
		console.log(`Created folder: ${folderPath}`)

		// Create index.json if requested
		if (createFile) {
			const filePath = path.join(folderPath, 'index.json')
			fs.writeFileSync(filePath, '{}')
			console.log(`Created file: ${filePath}`)
		}
	} else {
		console.log(`Folder already exists: ${folderPath}`)
	}
}

console.log('Done creating folders!')
