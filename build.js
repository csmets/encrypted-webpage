const csscrypt = require('csscrypt')
const cheerio = require('cheerio')
const fs = require('fs-extra')

const buildFolder = 'build'
// Delete build folder if it exists to remove old files
if (fs.existsSync(buildFolder)){
    fs.emptyDirSync(buildFolder)
    fs.rmdir(buildFolder)
}

// Create build folder
fs.mkdirSync(buildFolder)

// Load file to encrypt
const file = fs.readFileSync('index.html')
const $ = cheerio.load(file)
const body = $('#encrypt').html()

// Encryption options
// note: The encoding is Base64
const options = {
    pad: "=",
    encoding: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    size: 6,
    key: '3924834902384'
}

const encryptedBody = csscrypt.encrypt(body, options)

$('#encrypt').html(encryptedBody)

const html = $.html()

fs.writeFileSync(buildFolder + '/index.html',html,'utf8')

// Copy JS files to build location
fs.copySync('js', buildFolder + '/js')
// Copy images to build location
fs.copySync('images', buildFolder + '/images')
