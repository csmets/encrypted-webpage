
var el = document.getElementById('encrypt');
var encryptedContent = el.innerHTML;
var decrypted = decrypt(encryptedContent);
if (decrypted !== false) {
	document.getElementById('details').style.display = 'none';
	el.innerHTML = decrypted;
} else {
	el.style['word-wrap'] = 'break-word';
}
