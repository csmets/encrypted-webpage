// Decrypt webpage
var decrypt = function(crypted, options) {

    // Get keys from local storage
    options.encoding = (options.encoding === undefined) ?
        localStorage['encoding'] : options.encoding;
    options.key = (options.key === undefined) ?
        localStorage['key'] : options.key;
    options.pad = (options.pad === undefined) ?
        localStorage['pad'] : options.pad;
    options.size = (options.size === undefined) ?
        localStorage['size'] : options.size;

    var cryptedChar = crypted.split('')

    var padNum = getPadNum(cryptedChar, options.pad)

    // Remove pad characters
    cryptedChar.splice(cryptedChar.length - padNum, padNum)

    // Resize the shift key
    var key = resizeKey(options.key, cryptedChar.length)

    // Unshift each character in the encrpyted message with the key so the
    // result should be a message that is almost ready to be decoded.
    var unshift = function(index, res) {
        if (res.length > key.length - 1) {
            return res
        } else {
            var pos = options.encoding.indexOf(cryptedChar[index])
            var unShiftIndex = unShiftChar(options.encoding, pos, 
                parseInt(key[index]))
            var unshifted = options.encoding[unShiftIndex]
            return unshift(index + 1, res + unshifted)
        }
    }
    var unshifted = unshift(0,'')

    // Get ony the pad value from the encrypted message. (It's the only value
    // that is non shifted.
    var missingPads = crypted.slice(-padNum)

    // Now we have the encoded message ready to be decoded.
    var encoded = unshifted + missingPads
    var decrypted = decode(encoded, options)

    return decrypted
}

// Return the number of characters that match the pad char
var getPadNum = function(chars, pad) {
    var pads = chars.filter(function(char) {
        return char === pad
    })

    return pads.length
}

// Make a string stretch out to the length given by wrapping.
// e.g. 'ABC' make len=6  = 'ABCABC'
const makeLength = (str, len) => {
    if (str.length < len) {
        return makeLength(str + str, len)
    } else {
        return str.substring(0,len)
    }
}

// Resize the shift key to the length given
var resizeKey = function(key, len) {
    if (key.length > len) {
        return key.substring(0, len)
    } else {
        return makeLength(key, len)
    }
}

// Return a chracter that's x num behind of the original
var unShiftChar = function(list, pos, num) {
    index = pos - num
    if (index < 0) {
        // Negative number
        return list.length - Math.abs(index)
    } else {
        return index
    }
}

var decode = function(message, options) {
    
    var chars = message.split("")
    
    // Get the decimal value of the message characters
    var encDeci = chars.map(function(char) {
        if (char === options.pad) {
            return char
        } else {
            return options.encoding.indexOf(char)
        }
    })

    // Convert the decimal values into binary
    var binary = encDeci.map(function(deci) {
        if (deci === options.pad) {
            return options.pad
        } else {
            var bin = (deci >>> 0).toString(2)
            var completeBin = recPrepend(options.size, bin, '0')
            return completeBin
        }
    })

    // Return an array without pad characters
    var removePad = binary.filter(function(bin) {
        return bin !== options.pad
    })

    // Make encoded binary into groups of heximal safe binary
    var longBinary = removePad.join('')
    var decodedBinary = longBinary.match(/.{1,8}/g)
    var fillDecodedBinary = decodedBinary.map(function(bin) {
        return recPrepend(8,bin,'0')
    })

    // Remove any null type binary
    var removeNull = fillDecodedBinary.filter(function(bin) {
        return bin !== '00000000'
    })

    // Return decoded character decimal values
    var decodedDeci = removeNull.map(function(bin) {
        return parseInt(bin, 2)
    })

    // Convert the character decimal into a character which will result into
    // the decoded message.
    var decodedChar = decodedDeci.map(function(deci) {
        return String.fromCharCode(deci)
    })
    var decoded = decodedChar.join('')

    return decoded
}

// Prepend a character to a tring by a number of times
var recPrepend = function(num, str, char) {
    if (str.length < num) {
        var prepend = char + str
        return recPrepend(num, prepend, char)
    } else {
        return str
    }
}
