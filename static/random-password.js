// attempt to generate cryptographically secure random byte, with optional max for using as a charset index
function getRandomByte( max ) {
    // http://caniuse.com/#feat=getrandomvalues
    var crypto = window.crypto || window.msCrypto;
    if ( crypto && crypto.getRandomValues ) {
        var a = new Uint8Array( 1 );
        while ( true ) {
            crypto.getRandomValues( a );
            if ( a[0] <= max ) return a[0];
        }
    } else {
        return Math.floor( Math.random() * max );
    }
}

function generatePassword() {
    var minLength = 20;
    var maxLength = 30;
    var charset = "abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ2345679!@#$%(){}[]&*";
    if ( minLength > maxLength) maxLength = minLength;
    var randomLength = Math.floor( Math.random() * ( maxLength - minLength ) ) + minLength;
    var password = "";
    for ( var i = 0, maxIndex = charset.length; i < randomLength; i++ ) {
        password += charset.charAt( getRandomByte( maxIndex ) );
    }

    if ($('#getUrlButton').hasClass('btn-outline-danger')) {
        $('#getUrlButton').removeClass('btn-outline-danger').addClass('btn-success');
      }
    return password;
}
