// const recipes = document.querySelectorAll('.recipe');

// for (let recipe of recipes){
//     recipe.addEventListener('click', function() {
//         const imgId = recipe.getAttribute('id');
//         window.location.href = `/recipes/${imgId}`;
//     }
//     )
// }

const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .link");

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
}


const ingredientContent = document.querySelector('.ingrediente-content');
const ingredientShowHide = document.getElementById("ingrediente")

const preparoContent = document.querySelector('.preparo-content');
const preparoShowHide = document.getElementById("preparo")

const infoContent = document.querySelector('.info-content');
const infoShowHide = document.getElementById("info")

ingredientShowHide.onclick = function(){
    console.log("button pressed")
    if(ingredientContent.style.display == "none"){
        ingredientContent.style.display = "block"
        ingredientShowHide.textContent = "Esconder"
    }
    else
    {
        ingredientContent.style.display = "none"
        ingredientShowHide.textContent = "Mostrar"

    }
}

preparoShowHide.onclick = function(){
    console.log("button pressed")
    if(preparoContent.style.display == "none"){
        preparoContent.style.display = "block"
        preparoShowHide.textContent = "Esconder"
    }
    else
    {
        preparoContent.style.display = "none"
        preparoShowHide.textContent = "Mostrar"

    }
}

infoShowHide.onclick = function(){
    console.log("button pressed")
    if(infoContent.style.display == "none"){
        infoContent.style.display = "block"
        infoShowHide.textContent = "Esconder"
    }
    else
    {
        infoContent.style.display = "none"
        infoShowHide.textContent = "Mostrar"

    }
}

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}

function addPreparation() {
    const preparation = document.querySelector("#modo-preparo");
    const fieldContainer = document.querySelectorAll(".modo-prep");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparation.appendChild(newField);
}


document
.querySelector(".add-ingredient")
.addEventListener("click", addIngredient);

document
.querySelector(".add-preparation")
.addEventListener("click", addPreparation);