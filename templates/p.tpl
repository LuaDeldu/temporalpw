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

  <section class="container w-70 px-5 text-center mt-5 mb-3">
    <h2>Envoi de mots de passe de manière sécurisée<br /><a href="/">Temporal.PW</a></h2>
    <form>
      <div class="form-group mt-4">
        <div class="container mb-5">
          <label id="label-msg-p" for="div-password"></label>
          <div id="div-password"></div>
        </div>
        <div id="p-warning"></div>
      </div>
    </form>
  </section>

<footer class="page-footer text-center mb-2">
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

</body>

</html>
