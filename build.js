const csscrypt = require('csscrypt')
const cheerio = require('cheerio')
const fs = require('fs')

const file = fs.readFileSync('index.html')

const $ = cheerio.load(file)

const body = $('body').html()

const options = {
    pad: "=",
    encoding: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    size: 6,
    key: '3924834902384'
}
const encryptedBody = csscrypt.encrypt(body, options)
const decrypted = csscrypt.decrypt(encryptedBody, options)

$('body').html(encryptedBody)

const html = $.html()

fs.writeFileSync('out.html',html,'utf8')

console.log(decrypted)
