
var el = document.getElementById('encrypt');
var encryptedContent = el.innerHTML;
var decrypted = decrypt(encryptedContent);
el.innerHTML = decrypted;
