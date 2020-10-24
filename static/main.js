var has_url = false;
var base_url = document.location.protocol + "//" + document.location.host;

function generate_url() {
  var secret = document.getElementById("secret").value;
  if (secret === null || secret === "") {
    return false;
  }

  // Generate random key byte array
  var crypto = window.crypto || window.msCrypto;
  if (!crypto) throw new Error("Your browser does not support window.crypto or window.msCrypto.");

  var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31
  ];
  var key = new Uint8Array(key_256); // 256-bit key
  crypto.getRandomValues(key); // Generate random 256 bit AES key

  // Encode key byte array
  var encoded_key = Base58.encode(key);

  // Convert password string to byte array, never send this to the server unencrypted
  var password_bytes = aesjs.utils.utf8.toBytes(secret);

  // Encrypt password ..
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encrypted_bytes = aesCtr.encrypt(password_bytes);

  // Encode encrypted password
  var encoded_encrypted_bytes = Base58.encode(encrypted_bytes);

  $.post(base_url + "/new", {
      cipher: encoded_encrypted_bytes, // ONLY send encrypted password to server, NEVER send the key or unencrypted password!
      days: document.getElementById("days").value,
      myiponly: document.getElementById("myiponly").checked
    },
    function (data, status) {
      got_id(data, status, encoded_key);
    }); // Encryption key is never sent to server, it's only provided to this ajax success callback so the browser can build the secret URL

  return false;
};

function got_id(data, status, encoded_key) {
  var SHA256 = new Hashes.SHA256();

  $("#label-msg").show().text("Partager cette adresse URL au destinataire du mot de passe :");

  var token = data.pw_id + "-" + encoded_key;

  document.getElementById("copy-button").setAttribute("data-clipboard-target", "#secret");
  document.getElementById("secret").value = base_url + "/p#" + token + SHA256.hex(token).substr(0, 2);
  $("#secret").attr("readonly", true);

  var info;
  if (document.getElementById("myiponly").checked) {
    info = `
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-sm-10">
            <div
              class="alert alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light"
              role="alert">
              <i class="start-icon fa fa-exclamation-triangle"></i>
              Cette adresse URL ne peut être utilisée qu'<span id="bold-text-underline">une seule fois</span> pour voir le mot
              de passe !
            </div>
          </div>
          <div class="col-sm-10">
            <div
              class="alert alert-simple alert-info alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light"
              role="alert">
              <i class="start-icon  fa fa-info-circle"></i>
              Cette adresse URL expirera dans <span id="bold-text">` + document.getElementById("days").value + `</span>
              jour(s), et elle n'est accessible que depuis la même adresse IP.
            </div>
          </div>
        </div>
      </div>
      `;
  } else {
    info = `
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-sm-10">
            <div
              class="alert alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light"
              role="alert">
              <i class="start-icon fa fa-exclamation-triangle"></i>
              Cette adresse URL ne peut être utilisée qu'<span id="bold-text-underline">une seule fois</span> pour voir le mot
              de passe !
            </div>
          </div>
          <div class="col-sm-10">
            <div
              class="alert alert-simple alert-info alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light"
              role="alert">
              <i class="start-icon  fa fa-info-circle"></i>
              Cette adresse URL expirera dans <span id="bold-text">` + document.getElementById("days").value + `</span>
              jour(s).
            </div>
          </div>
        </div>
      </div>
      `;
  };

  $("#settings").html(info + "<br />");
  $("#warning").hide();
  $("#passwordHelp").hide();
  $("#genPassword").hide();
  $("#getUrlButton").hide();


  has_url = true;

  return false;
};

$(document).on('click', 'input[type=text]', function () {
  this.select();
});

$(document).on('show.bs.popover', function () {
  setTimeout(function () { //calls click event after a certain time
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

  // make get URL button clickable upon input ..
  $("#getUrlButton").prop("disabled", true);
  $("#secret").on("input", function () {
    if ($(this).val().length) {
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
    var SHA256 = new Hashes.SHA256();

    var token = window.location.hash.substring(1).slice(0, -2); // Strip "#" from URL fragment
    var checksum = window.location.hash.substring(1).slice(-2); // Checksum used for better error message
    var id_and_key = token.split("-", 2);

    var pw_id = id_and_key[0]; // pw_id used to fetch encrypted password from server
    var key = id_and_key[1]; // Password decryption key is never sent to server!

    var warning_ok_div, warning_ko_div, password_div;

    if (checksum != SHA256.hex(token).substr(0, 2)) { // Checksum only used to provide alternate error (and postpone deleting the encrypted password from server) in the case of accidental URL mangling (e.g. the user is going to get a malformed password by decrypting with a mangled key)
      console.log("Invalid URL");
    } else {
      $.getJSON(base_url + "/get/" + pw_id, // This GET also deletes the encrypted password from the server
          function (data) {
            if (data.cipher) {
              // Decode encrypted password ..
              var decoded_encrypted_bytes = Base58.decode(data.cipher);

              // Decode key ..
              var decoded_key = Base58.decode(key);

              // Decrypt decoded password with decoded key ..
              var aesCtr = new aesjs.ModeOfOperation.ctr(decoded_key, new aesjs.Counter(5));
              var decrypted_bytes = aesCtr.decrypt(decoded_encrypted_bytes);

              // Convert our bytes back into text
              var decrypted_password = aesjs.utils.utf8.fromBytes(decrypted_bytes);
              
              warning_ok_div = `
              <div class="row justify-content-md-center">
                <div class="col-sm-10">
                  <div
                    class="alert alert-simple alert-warning alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light"
                    role="alert">
                    <i class="start-icon fa fa-exclamation-triangle"></i>
                    Ce mot de passe <span id="bold-text-underline">n'est désormais plus disponible</span> à partir de cette adresse URL.
                  </div>
                </div>
              </div>
              `;

              password_div = `
              <div class="form-control input-lg text-center mb-3" id="password" name="password"></div>
              <button class="btn btn-success btn-copy" type="button" id="clip-btn"
                data-clipboard-target="div#password" data-toggle="popover" data-placement="right"
                data-content="Copié">
                <b>Copier le mot de passe</b>
              </button>
              `

              $("#label-msg-p").text("Le mot de passe est :");
              $("#div-password").html(password_div);
              $("#password").text(decrypted_password);
              $("#p-warning").html(warning_ok_div);
              $('[data-toggle="popover"]').popover();
            }
            else {
              warning_ko_div = `
              <div class="row justify-content-md-center">
                <div class="col-sm-10">
                  <div
                    class="alert alert-simple alert-danger alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light"
                    role="alert">
                    <i class="start-icon far fa-times-circle"></i>
                    Cette adresse URL est invalide ou le mot de passe associé n'existe plus !
                  </div>
                </div>
              </div>
              `

              $("#p-warning").html(warning_ko_div);
            };
          }
        )
        .fail(function () {
          $("#clip-btn").prop("disabled", true);
        }
      ); // Checksum check
    }
  }
});
