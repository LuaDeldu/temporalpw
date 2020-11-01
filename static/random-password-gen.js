// Clear the concole on every refresh - for testing purposes only
//console.clear();

// Selecting all the DOM Elements that are necessary -->
// The Viewbox where the result will be shown
const resultPw = document.getElementById('secret');
// Button to generate the password
const generateBtn = document.getElementById("genPassword");
// The input slider, will use to change the length of the password
const lengthEl = document.getElementById("slider");
// Checkboxes representing the options that is responsible to create differnt type of password based on user
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");

// Object of all the function names that we will use to create random letters of password
const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

// Function that handles the checkboxes state, so at least one needs to be selected. The last checkbox will be disabled.
function disableOnlyCheckbox() {
  let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked);
  totalChecked.forEach(el => {
    if (totalChecked.length == 1) {
      el.disabled = true;
    } else {
      el.disabled = false;
    }
  })
}
$(".setting").each(function () {
  $(this).on("click", function () {
    disableOnlyCheckbox()
  });
});

// Generator Functions
// All the functions that are responsible to return a random value taht we will use to create password.
function getRandomLower() {
  const lowersCharset = 'abcdefghijknopqrstuvwxyz';
  let resultLower = String.fromCharCode(getRandomByte(lowersCharset.length) + 97);
  return resultLower
}

function getRandomUpper() {
  const uppersCharset = 'ACDEFGHJKLMNPQRSTUVWXYZ';
  let resultUpper = String.fromCharCode(getRandomByte(uppersCharset.length) + 65);
  return resultUpper
}

function getRandomNumber() {
  const numbersCharset = '0123456789';
  let resultNumber = String.fromCharCode(getRandomByte(numbersCharset.length) + 48);
  return resultNumber
}

function getRandomSymbol() {
  const symbolsCharset = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

  let resultSymbol = symbolsCharset[getRandomByte(symbolsCharset.length)];
  return resultSymbol
}
// Attempt to generate cryptographically secure random byte, with optional max for using as a charset index
function getRandomByte(max) {
  // http://caniuse.com/#feat=getrandomvalues
  let crypto = window.crypto || window.msCrypto;
  if (crypto && crypto.getRandomValues) {
    //var randomBuffer = new Uint8Array(1); // var randomBuffer = new Uint16Array(1);
    let randomBuffer = new Uint32Array(1);
    while (true) {
      crypto.getRandomValues(randomBuffer);
      let randomByte = Math.floor(randomBuffer[0] / (Math.pow(2, 32)) * 10);
      if (randomByte <= max) {
        return randomByte;
      }
    }
  } else {
    let elseresult = Math.floor(Math.random() * max);
    return elseresult;
  }
}

// When Generate is clicked Password is generated.
$(document).on('click', 'button[id=genPassword]', function () {
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numberEl.checked;
  const hasSymbol = symbolEl.checked;
  resultPw.value = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
});

// Function responsible to generate password and then returning it.
function generatePassword(length, lower, upper, number, symbol) {
  let generatedPassword = "";
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{
    lower
  }, {
    upper
  }, {
    number
  }, {
    symbol
  }].filter(item => Object.values(item)[0]);
  if (typesCount === 0) {
    hasPassword(false);
    return "";
  }
  for (let i = 0; i < length; i++) {
    typesArr.forEach(type => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }
  let resultGeneratedPassword = generatedPassword.slice(0, length)
    .split('').sort(() => Math.random() - 0.5)
    .join('');

  hasPassword(true);
  checkPassLength(resultGeneratedPassword.length);
  passQualityCalculation(resultGeneratedPassword);

  return resultGeneratedPassword;
}