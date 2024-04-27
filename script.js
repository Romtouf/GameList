document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("form-ajout-jeu")
    .addEventListener("submit", submitForm);
  chargerJeux();
});

function submitForm(event) {
  event.preventDefault();
  const nomJeu = document.getElementById("nom-jeu").value;
  const consoleJeu = document.getElementById("console-jeu").value;
  const qualiteJeu = document.getElementById("qualite-jeu").value;
  const imageJeu = document.getElementById("image-jeu").files[0];

  if (!imageJeu) {
    alert("Veuillez ajouter une image pour le jeu.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const jeu = {
      nom: nomJeu,
      console: consoleJeu,
      qualite: qualiteJeu,
      image: e.target.result,
    };
    sauvegarderJeu(jeu);
    chargerJeux();
    document.getElementById("form-ajout-jeu").reset();
  };
  reader.readAsDataURL(imageJeu);
}

function sauvegarderJeu(jeu) {
  let jeux = JSON.parse(localStorage.getItem("jeux") || "[]");
  jeux.push(jeu);
  localStorage.setItem("jeux", JSON.stringify(jeux));
}

function chargerJeux() {
  const jeux = JSON.parse(localStorage.getItem("jeux") || "[]");
  const jeuxContainer = document.getElementById("jeux-container");
  jeuxContainer.innerHTML = "";
  jeux.forEach((jeu, index) => afficherJeu(jeu, index));
}

function afficherJeu(jeu, index) {
  const jeuxContainer = document.getElementById("jeux-container");
  const jeuDiv = document.createElement("div");
  jeuDiv.classList.add("jeu");
  jeuDiv.innerHTML = `
        <p>${jeu.nom} (${jeu.console}) - ${convertirQualiteEnEtoiles(
    jeu.qualite
  )}</p>
        <img src="${jeu.image}" alt="Image de ${
    jeu.nom
  }" style="width:100px;height:auto;">
        <button onclick="supprimerJeu(${index})">Supprimer</button>
        <button onclick="editerJeu(${index})">Éditer</button>
    `;
  jeuxContainer.appendChild(jeuDiv);
}

function supprimerJeu(index) {
  let jeux = JSON.parse(localStorage.getItem("jeux"));
  jeux.splice(index, 1);
  localStorage.setItem("jeux", JSON.stringify(jeux));
  chargerJeux();
}

function editerJeu(index) {
  const jeu = JSON.parse(localStorage.getItem("jeux"))[index];
  document.getElementById("nom-jeu").value = jeu.nom;
  document.getElementById("console-jeu").value = jeu.console;
  document.getElementById("qualite-jeu").value = jeu.qualite;
  document.getElementById("form-ajout-jeu").onsubmit = function (event) {
    event.preventDefault();
    mettreAJourJeu(index);
  };
}

function mettreAJourJeu(index) {
  const nomJeu = document.getElementById("nom-jeu").value;
  const consoleJeu = document.getElementById("console-jeu").value;
  const qualiteJeu = document.getElementById("qualite-jeu").value;
  const imageJeu = document.getElementById("image-jeu").files[0];

  if (imageJeu) {
    const reader = new FileReader();
    reader.onload = function (e) {
      updateGame(index, nomJeu, consoleJeu, qualiteJeu, e.target.result);
    };
    reader.readAsDataURL(imageJeu);
  } else {
    updateGame(index, nomJeu, consoleJeu, qualiteJeu);
  }
}

function updateGame(index, nom, console, qualite, image = null) {
  let jeux = JSON.parse(localStorage.getItem("jeux"));
  let oldImage = jeux[index].image;
  jeux[index] = {
    nom: nom,
    console: console,
    qualite: qualite,
    image: image || oldImage,
  };
  localStorage.setItem("jeux", JSON.stringify(jeux));
  chargerJeux();
  document.getElementById("form-ajout-jeu").reset();
  document.getElementById("form-ajout-jeu").onsubmit = submitForm;
}

function convertirQualiteEnEtoiles(qualite) {
  switch (qualite) {
    case "super":
      return "★★★★★";
    case "bon":
      return "★★★★";
    case "moyen":
      return "★★★";
    case "mauvais":
      return "★";
    default:
      return "";
  }
}
