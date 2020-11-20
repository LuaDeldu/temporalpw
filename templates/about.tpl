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
</head>

<body>
  <section class="container w-70 px-5 text-justify mt-5 mb-3">

    <h1>À propos de <a href="/">Temporal.PW</a></h1><br />
    <p>
      <a href="/">Temporal.PW</a> peut convertir un mot de passe en une adresse URL unique, temporaire et sécurisée.
      Cette
      adresse URL peut alors être envoyée par E-Mail ou tout autre canal de communication non sécurisé vers un
      destinataire unique.
      <br /><br />
      Ce site Web utilise pour source initiale et d'inspiration le service <a href="https://temporal.pw"
        target="_blank">Temporal.PW</a> et y apporte une fraicheur visuelle et d'usage, mais surtout une refactorisation
      du code pour améliorer les performances générales et réhausser le niveau de sécurité du service.
    </p>

    <div class="accordion" id="accordionExample">
      <div class="card" id="accordion-css">
        <div class="card-header" id="headingOne">
          <h3 class="mb-0">
            <button class="btn btn-link btn-block text-left" id="bold-text" type="button" data-toggle="collapse"
              data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Comment utiliser le service ?
            </button>
            </h2>
        </div>

        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
          <div class="card-body">
            <ol>
              <li>Entrez un mot de passe long et robuste dans <a href="/">Temporal.PW</a>, ou cliquez sur <span
                  id="bold-text">Générer un mot de passe aléatoire</span>.
                <br />Sélectionnez l'expiration (par défaut 3 jours) après laquelle l'adresse URL sera invalide.</li>
              <br />
              <li>Envoyez l'adresse URL temporaire par E-Mail ou autre canal de communication au destinataire.</li>
              <br />
              <li>Le destinataire ouvre l'adresse URL envoyée et récupère le mot de passe.
                <br />L'adresse URL devient alors invalide et n'est plus utilisable pour récupérer le mot de passe.
              </li>
              <br />
              <li>Si le destinaraire rencontre une erreur : l'adresse URL est invalide et/ou le mot de passe a déjà été
                récupéré par ce lien.
                <br />Attention, si l'adresse URL est exacte et que la date d'expiration n'est pas dépassée, cela
                indique qu'une personne <span id="bold-text">a intercepté le lien et récupéré le mot de passe !
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div class="card" id="accordion-css">
        <div class="card-header" id="headingTwo">
          <h3 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" id="bold-text" type="button"
              data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Comment fonctionne le service ?
            </button>
            </h2>
        </div>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
          <div class="card-body">
            <ul>
              <li>
                Le mot de passe non chiffré n'est <span id="bold-text">jamais</span> transmis au serveur.
              </li>
              <br />
              <li>
                La clé de chiffrement du mot de passe est générée par votre navigateur mais n'est <span
                  id="bold-text">jamais</span> transmise au serveur.
              </li>
              <br />
              <li>
                Le navigateur génère aléatoirement une clé de chiffrement en utilisant l'algorithme de chiffrement AES
                avec une clé de 256 bits, chiffre le mot de passe avec cette clé, envoie uniquement la version
                <span id="bold-text">chiffrée</span> du mot de passe au serveur (de sorte que l'adresse URL puisse être
                rendue inutilisable après son utilisation et qu'elle n'expose pas le mot de passe à une attaque par
                bruteforce), puis le navigateur construit une adresse URL sécurisée unique qui contient l'identifiant
                serveur du mot de passe chiffré (identifiant généré coté serveur) ainsi que la clé de chiffrement (qui
                n'est pas transmise au serveur).
              </li>
              <br />
              <li>
                La clé de chiffrement qui a permis de chiffrer le mot de passe n'existe que dans l'adresse URL (après
                le symbole de hachage "#") et n'est jamais transmise côté serveur.
              </li>
              <br />
              <li>
                Le mot de passe chiffré n'est envoyé au serveur que pour rendre inutilisable l'adresse URL unique dès
                lors qu'elle est consultée une fois ou qu'elle expire. Le mot de passe chiffré est envoyé à la
                place de la clé de chiffrement afin que le mot de passe ne puisse pas être extrait de l'adresse URL par
                une attaque par bruteforce, et qu'elle soit d'une longueur fixe et courte, indépendante de la taille du
                mot de passe.
              </li>
              <br />
              <li>
                Le mot de passe ne peut être déchiffré sans la clé de chiffrement qui se trouve dans l'adresse URL
                unique.
              </li>
              <br />
              <li>
                La génération de la clé, le chiffrement et le déchiffrement sont uniquement effectué par le navigateur à
                l'aide de la bibliothèque cryptographique publique suivante : <a href="https://github.com/ricmoo/aes-js"
                  target="_blank">AES-JS</a>.
              </li>
              <br />
              <li>
                Le mot de passe chiffré est <span id="bold-text">automatiquement supprimé</span> du serveur après son
                <span id="bold-text">expiration</span> (durée de rétention avant expiration renseignée par l'utilisateur
                à la création de l'adresse URL), ou immédiatement après avoir été <span id="bold-text">consulté</span>
                une seule fois par une personne qui utilise l'adresse URL unique correspondante.
              </li>
              <br />
              <li>
                Chaque mot de passe n'est visible qu'<span id="bold-text">une seule fois</span>, de sorte qu'une fois
                l'adresse URL utilisée une fois, il ne sera plus possible de récupérer le mot de passe à nouveau. Cela
                indique également que le destinataire ne pourra pas voir le mot de passe si quelqu'un d'autre a
                intercepté l'adresse URL et visualisé le mot de passe en premier.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="card" id="accordion-css">
        <div class="card-header" id="headingThree">
          <h3 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" id="bold-text" type="button"
              data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Autres informations
            </button>
            </h2>
        </div>
        <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
          <div class="card-body">
            <ul>
              <li>
                Facile à auditer : moins de 200 lignes de Python pour le Back-End, et fichiers JavaScript séparés par
                fonction pour le Front-End.
              </li>
              <br />
              <li>
                <span id="bold-text">100% Open-Source !</span> Sources disponibles <a
                  href="https://github.com/LuaDeldu/temporalpw" target="_blank">ici</a>
              </li>
              <br />
              <li>
                Technologies Back-End :<br />
                <ul>
                  <li>
                    Microframework WSGI <a href="https://bottlepy.org/" target="_blank">Bottle</a>
                  </li>
                  <li>
                    Serveur web HTTP WSGI <a href="https://gunicorn.org/" target="_blank">Gunicorn</a>
                  </li>
                  <li>
                    Base de données JSON <a href="https://tinydb.readthedocs.io/" target="_blank">TinyDB</a>
                  </li>
                </ul>
              </li>
              <br />
              <li>
                Technologies Front-End :<br />
                <ul>
                  <li>
                    Framework <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a>
                  </li>
                  <li>
                    Bibliothèque JavaScript <a href="https://jquery.com/" target="_blank">JQuery</a>
                  </li>
                  <li>
                    Bibliothèque JavaScript <a href="https://clipboardjs.com/" target="_blank">Clipboard.js</a>
                  </li>
                  <li>
                    Icones <a href="https://fontawesome.com/" target="_blank">Font Awesome</a>
                  </li>
                </ul>
                <br />
              <li>
                Technologies Cryptograpiques :<br />
                <ul>
                  <li>
                    Bibliothèque JavaScript <a href="https://github.com/ricmoo/aes-js/" target="_blank">AES-JS</a>
                  </li>
                  <li>
                    Bibliothèque JavaScript <a href="https://github.com/45678/base58/" target="_blank">Base58</a>
                  </li>
                  <li>
                    Bibliothèque JavaScript <a href="https://github.com/h2non/jshashes/" target="_blank">jsHashes</a>
                  </li>
                </ul>
              </li>
              <br />
              <li>
                Ce service est une refactorisation et amélioration du service <a href="https://temporal.pw"
                  target="_blank">Temporal.PW</a> dont les sources se trouvent <a
                  href="https://github.com/tkooda/temporalpw/" target="_blank">ici</a>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

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

</body>

</html>