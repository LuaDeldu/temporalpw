<!DOCTYPE html>
<html lang="fr">

<head>
  <title>Temporal.PW - Partage temporaire et sécurisé des mots de passe</title>
  <meta name="viewport" content="width=device-width, initial-scale=1 , shrink-to-fit=no">
  <link rel="icon" type="image/x-icon" href="static/favicon.ico">
  <link rel="stylesheet" href="static/main.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"
    integrity="sha512-oc9+XSs1H243/FRN9Rw62Fn8EtxjEYWHXRvjS43YtueEewbS6ObfXcJNyohjHqVKFPoXXUxwc+q1K7Dee6vv9g=="
    crossorigin="anonymous" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
    integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
    crossorigin="anonymous" />
</head>

<body>

  <section class="container w-70 px-5 text-center my-5">
    <h2>Envoi de mots de passe de manière sécurisée<br /><a href="/">Temporal.PW</a></h2>
    <form>
      <div class="form-group mt-4">
        <label id="label-msg" for="secret">Générer ou saisir un mot de passe pour créer une adresse URL sécurisée et
          temporaire :</label>
        <div class="input-group input-group-lg">
          <div class="input-group-prepend">
            <button class="btn btn-outline-secondary btn-copy" type="button" id="copy-button"
              data-clipboard-target="#secret" data-toggle="popover" data-placement="top" data-content="Copié">
              <i class="start-icon fas fa-paste" id="copy-fa-button"></i>
            </button>
          </div>
          <input type="text" class="form-control input-lg text-center" id="secret" name="secret"
            placeholder="Saisir un mot de passe" aria-label="Saisie du mot de passe" aria-describedby="genPassword">
        </div>
        <div id="settings">
          <div class="form-group mb-4">
            <small id="passwordHelp" class="form-text text-muted mb-2">L'utilisation d'un mot de passe généré
              aléatoirement est recommandée. À défaut, utiliser un mot de passe suffisament robuste.</small>
            <div id="progress-group">
              <div id="quality-description"></div><div class="progress-title" id="quality__pass" data-quality='0'>Robustesse :</div>
              <div class="progress">
                <div class="progress-bar progress-bar-striped" role="progressbar" id="quality-progress-bar"></div>
              </div>
            </div>
            <div id="warningLength"></div>
            <div class="range__slider" data-min="5" data-max="50">
              <div class="length__title field-title" data-length='0'>Longueur :</div>
              <input id="slider" type="range" min="5" max="50" value="20" />
            </div>
            <div id="settings-checkbox">
              <span class="settings__title field-title">Paramètres</span>
              <div class="setting">
                <input type="checkbox" id="uppercase" checked />
                <label for="uppercase">Majuscules</label>
              </div>
              <div class="setting">
                <input type="checkbox" id="lowercase" checked />
                <label for="lowercase">Minuscules</label>
              </div>
              <div class="setting">
                <input type="checkbox" id="number" checked />
                <label for="number">Chiffres</label>
              </div>
              <div class="setting">
                <input type="checkbox" id="symbol" />
                <label for="symbol">Caractères<br />spéciaux</label>
              </div>
            </div>
            <div>
              <button type="button" id="genPassword" class="btn btn-primary btn-sm mt-2">
                <b>Générer un mot de passe aléatoire</b></button>
            </div>
          </div>
          <div id="expire" class="form-group">
            Expiration de l'adresse URL dans <select id="days" name="days">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3" selected>3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select> jours.
          </div>
          <button type="submit" id="getUrlButton" class="btn btn-outline-danger btn-lg"
            onclick="return generate_url();">Obtenir l'adresse URL pour ce mot de passe</button>
        </div>
        <div id="warnings" class="form-group mt-4"></div>
      </div>
    </form>
  </section>

  <footer class="page-footer text-center mt-2">
    <nav>
      <a href="/">Envoyer un mot de passe</a> |
      <a href="/about">About</a> |
      <a href="https://github.com/LuaDeldu/temporalpw">Source</a>
    </nav>
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
    integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=="
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous">
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js"
    integrity="sha512-hDWGyh+Iy4Mr9AHOzUP2+Y0iVPn/BwxxaoSleEjH/i1o4EVTF/sh0/A1Syii8PWOae+uPr+T/KHwynoebSuAhw=="
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aes-js/3.1.2/index.js"
    integrity="sha512-5e17hebfdkOW/S7tdw5zGbA9eqD747Wz1S2VlkEXavOhdeW12JQHRi9LPb7NfWZcIl9AK98wxPod/Df9PgdGIw=="
    crossorigin="anonymous"></script>
  <script src="https://cdn.rawgit.com/45678/base58/master/Base58.js" crossorigin="anonymous">
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jshashes/1.0.8/hashes.min.js"
    integrity="sha512-1HyPmPHvi5wFUctYkBhwOYgXmMdbPrDaXKBrbGRI3o1CQkTKazG/RKqR8QwVIjTDOQ3uAOPOFkEbzi99Td6yiQ=="
    crossorigin="anonymous"></script>
  <script src="static/main.js"></script>
  <script src="static/random-password-gen.js"></script>
  <script src="static/password-quality-calc.js"></script>

</body>

</html>