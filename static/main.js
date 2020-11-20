var has_url = false;
var base_url = document.location.protocol + "//" + document.location.host;

function generate_url() {
  let secret = document.getElementById("secret").value;
  if (secret === null || secret === "") {
    return false;
  }

  // Generate random key byte array
  let crypto = window.crypto || window.msCrypto;
  if (!crypto) throw new Error("Your browser does not support window.crypto or window.msCrypto.");

  let key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31
  ];
  let key = new Uint8Array(key_256); // 256-bit key
  crypto.getRandomValues(key); // Generate random 256 bit AES key

  // Encode key byte array
  let encoded_key = Base58.encode(key);

  // Convert password string to byte array, never send this to the server unencrypted
  let password_bytes = aesjs.utils.utf8.toBytes(secret);

  // Encrypt password ..
  let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  let encrypted_bytes = aesCtr.encrypt(password_bytes);

  // Encode encrypted password
  let encoded_encrypted_bytes = Base58.encode(encrypted_bytes);

  $.post(base_url + "/new", {
      cipher: encoded_encrypted_bytes, // ONLY send encrypted password to server, NEVER send the key or unencrypted password!
      days: document.getElementById("days").value,
    },
    function (data, status) {
      got_id(data, status, encoded_key);
    }); // Encryption key is never sent to server, it's only provided to this ajax success callback so the browser can build the secret URL

  return false;
}

function got_id(data, status, encoded_key) {
  let SHA512 = new Hashes.SHA512();

  $("#label-msg").show().text("Partager cette adresse URL au destinataire du mot de passe :");

  let token = data.pw_id + "-" + encoded_key;

  $("#copy-button").attr("data-clipboard-target", "#secret");
  $("#secret").val(base_url + "/p#" + token + SHA512.hex(token).substr(0, 2));
  $("#secret").attr("readonly", true);

  let info = "<div class='container'><div class='row justify-content-md-center'><div class='col-sm-10'><div class='alert alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light' role='alert'><i class='start-icon fa fa-exclamation-triangle'></i> Cette adresse URL ne peut être utilisée qu'<span id='bold-text-underline'>une seule fois</span> pour voir le mot de passe !</div></div><div class='col-sm-10'><div class='alert alert-simple alert-info alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light' role='alert'><i class='start-icon fa fa-info-circle'></i> Cette adresse URL expirera automatiquement dans <span id='bold-text'>" + document.getElementById('days').value + "</span> jour(s).</div></div></div></div>";

  $("#settings").hide();
  $("#warnings").html(info + "<br />");

  has_url = true;

  return false;
}

// Function to enable and modify class of getUrlButton element
function hasPassword(hasPasswordBool) {
  if (hasPasswordBool === true) {
    if ($('#getUrlButton').hasClass('btn-outline-danger')) {
      $('#getUrlButton').removeClass('btn-outline-danger').addClass('btn-success');
    }
    $("#getUrlButton").prop("disabled", false);
  } else {
    if ($('#getUrlButton').hasClass('btn-success')) {
      $('#getUrlButton').removeClass('btn-success').addClass('btn-outline-danger');
    }
    $("#getUrlButton").prop("disabled", true);
  }
}

// Function to check the length of the password and show an ANSSI warning is not > 12 chars
function checkPassLength(passwordLength) {
  if ((passwordLength >= 12) || (passwordLength === false)) {
    $("#warningLength").html('');
  } else {
    let warningInfo = "<div class='row justify-content-md-center'><div class='col-sm-10'><div class='alert alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light' role='alert'><i class='start-icon fa fa-exclamation-triangle'></i> Ce mot de passe ne comporte que <span id='bold-text'>" + passwordLength + "</span> caractères !<br />L'Agence Nationale de la Sécurité des Systèmes d'Information (ANSSI) <a href='https://www.ssi.gouv.fr/guide/mot-de-passe/' target='_blank'>recommande</a> au moins <span id='bold-text'>12 caractères</span> de types différents (majuscules, minuscules, chiffres, caractères spéciaux).</div></div></div>";
    $("#warningLength").html(warningInfo);
  }
}

// Function du check the quality (strength) of the password
function passQualityCalculation(passData) {
  let qualityPassword = PasswordQualityCalculator(passData);
  const startColorRgb = [244, 67, 54];
  const endColorRgb = [0, 200, 83];
  const qualityPass = $("#quality__pass");
  const qualityDescription = $('#quality-description');
  const qualityProgressBar = $('#quality-progress-bar');

  qualityPass.attr("data-quality", qualityPassword + " bits");
  const progressValue = Math.max(Math.min(qualityPassword / 128, 1), 0);
  qualityProgressBar.css("width", progressValue * 100 + '%');
  qualityDescription.text(qualityPassword < 64 && 'Très faible' ||
    qualityPassword < 80 && 'Faible' ||
    qualityPassword < 112 && 'Moyenne' ||
    qualityPassword < 128 && 'Forte' ||
    'Très forte');
  qualityDescription.css("color", 'rgb(' +
    (startColorRgb[0] - (startColorRgb[0] - endColorRgb[0]) * progressValue) + ',' +
    (startColorRgb[1] - (startColorRgb[1] - endColorRgb[1]) * progressValue) + ',' +
    (startColorRgb[2] - (startColorRgb[2] - endColorRgb[2]) * progressValue) + ')');

  qualityProgressBar.css("background-color", 'rgb(' +
    (startColorRgb[0] - (startColorRgb[0] - endColorRgb[0]) * progressValue) + ',' +
    (startColorRgb[1] - (startColorRgb[1] - endColorRgb[1]) * progressValue) + ',' +
    (startColorRgb[2] - (startColorRgb[2] - endColorRgb[2]) * progressValue) + ')');
}
function passQualityReset() {
  const qualityPass = $("#quality__pass");
  const qualityDescription = $('#quality-description');
  const qualityProgressBar = $('#quality-progress-bar');

  qualityPass.attr("data-quality", 'N/A');
  qualityDescription.text('');
  qualityDescription.css("color", 'rgb(150, 155, 165)');
  qualityProgressBar.css("width", '100%');
  qualityProgressBar.css("background-color", 'rgb(40, 45, 50)');
}

$(document).ready(function () {
  // Selecting the Range Slider container which will effect the LENGTH property of the password.
  if ($("#slider").length > 0) {
    // Range Slider Properties.
    // Fill : The trailing color that you see when you drag the slider.
    // background : Default Range Slider Background
    const sliderProps = {
      fill: "#007BFF",
      background: "rgba(255, 255, 255, 0.214)",
    };

    // Selecting the Range Slider container which will effect the LENGTH property of the password.
    const slider = document.querySelector(".range__slider");

    // Text which will show the value of the range slider.
    const sliderValue = document.querySelector(".length__title");

    // Using Event Listener to apply the fill and also change the value of the text.
    slider.querySelector("input").addEventListener("input", event => {
      sliderValue.setAttribute("data-length", event.target.value);
      applyFill(event.target);
    });
    // Selecting the range input and passing it in the applyFill func.
    applyFill(slider.querySelector("input"));

    // This function is responsible to create the trailing color and setting the fill.
    function applyFill(slider) {
      const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
      const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
      			0.1}%)`;
      slider.style.background = bg;
      sliderValue.setAttribute("data-length", slider.value);
    }
  }
});

$(document).on('click', 'input[type=text]', function () {
  this.select();
});

$(document).on('show.bs.popover', function () {
  setTimeout(function () { // Calls click event after a certain time
    $('[data-toggle="popover"]').popover('hide');
  }, 1000);
});

$(document).ready(function () {
  var clipboard = new ClipboardJS('#copy-button');
  clipboard.on('success', function () {});
  clipboard.on('error', function (e) {
    console.log(e);
  });

  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  // Make get URL button clickable upon input ..
  $("#getUrlButton").prop("disabled", true);

  // Catch everything the user is typing as a password to check length and quality
  $("#secret").on("input", function () {
    let passLength = $(this).val().length
    if (passLength) {
      let passData = $(this).val();
      hasPassword(true);
      checkPassLength(passLength);
      passQualityCalculation(passData);
    } else {
      hasPassword(false);
      checkPassLength(false);
      passQualityReset();
    }
  });
});

$(document).ready(function () {
  var clipboard = new ClipboardJS('#clip-btn');
  clipboard.on('success', function () {});
  clipboard.on('error', function (e) {
    console.log(e);
  });

  // Attempt to fetch password based on URL fragment (only the password ID is sent to the server, NOT the decryption key)
  if (window.location.hash) {
    let SHA512 = new Hashes.SHA512();

    let token = window.location.hash.substring(1).slice(0, -2); // Strip "#" from URL fragment
    let checksum = window.location.hash.substring(1).slice(-2); // Checksum used for better error message
    let id_and_key = token.split("-", 2);

    let pw_id = id_and_key[0]; // pw_id used to fetch encrypted password from server
    let key = id_and_key[1]; // Password decryption key is never sent to server!

    let warning_ok_div, warning_ko_div, password_div;

    if (checksum != SHA512.hex(token).substr(0, 2)) { // Checksum only used to provide alternate error (and postpone deleting the encrypted password from server) in the case of accidental URL mangling (e.g. the user is going to get a malformed password by decrypting with a mangled key)
      console.log("Invalid URL");
    } else {
      $.getJSON(base_url + "/get/" + pw_id, // This GET also deletes the encrypted password from the server
          function (data) {
            if (data.cipher) {
              // Decode encrypted password ..
              let decoded_encrypted_bytes = Base58.decode(data.cipher);

              // Decode key ..
              let decoded_key = Base58.decode(key);

              // Decrypt decoded password with decoded key ..
              let aesCtr = new aesjs.ModeOfOperation.ctr(decoded_key, new aesjs.Counter(5));
              let decrypted_bytes = aesCtr.decrypt(decoded_encrypted_bytes);

              // Convert our bytes back into text
              let decrypted_password = aesjs.utils.utf8.fromBytes(decrypted_bytes);

              warning_ok_div = "<div class='row justify-content-md-center'><div class='col-sm-10'><div class='alert alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light' role='alert'><i class='start-icon fa fa-exclamation-triangle'></i> Ce mot de passe <span id='bold-text-underline'>n'est désormais plus disponible</span> à partir de cette adresse URL.</div></div></div>";
              password_div = "<div class='form-control input-lg text-center mb-3' id='password' name='password'></div><button class='btn btn-success btn-copy' type='button' id='clip-btn' data-clipboard-target='div#password' data-toggle='popover' data-placement='right' data-content='Copié'><b>Copier le mot de passe</b></button>";

              $("#label-msg-p").text("Le mot de passe est :");
              $("#div-password").html(password_div);
              $("#password").text(decrypted_password);
              $("#p-warning").html(warning_ok_div);
              $('[data-toggle="popover"]').popover();
            } else {
              warning_ko_div = "<div class='row justify-content-md-center'><div class='col-sm-10'><div class='alert alert-simple alert-danger alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light' role='alert'><i class='start-icon far fa-times-circle'></i> Cette adresse URL est invalide ou le mot de passe associé n'existe plus !</div></div></div>";
              $("#p-warning").html(warning_ko_div);
            }
          }
        )
        .fail(function () {
          $("#clip-btn").prop("disabled", true);
        }); // Checksum check
    }
  }
});