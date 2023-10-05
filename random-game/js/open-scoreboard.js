const openButton = document.querySelector(".game__button_trophy");
const closeButton = document.querySelector(".score__button_play");
const overlay = document.querySelector(".score__overlay");
const scoreContainer = document.querySelector(".score__list");

openButton.addEventListener("click", openScoreHandler);
closeButton.addEventListener("click", closeScoreHandler);

function openScoreHandler() {
  const results = JSON.parse(localStorage.getItem("results"));
  let markup = "";
  if (!results) {
    markup = '<li class="score__item">You gave not played a game yet :(</li>';
  } else {
    markup = results
      .map((result) => `<li class="score__item">${result}</li>`)
      .join("");
  }
  scoreContainer.innerHTML = markup;
  overlay.classList.remove("score__overlay_hidden");
  document.body.classList.add("hidden");
}

function closeScoreHandler() {
  overlay.classList.add("score__overlay_hidden");
  document.body.classList.remove("hidden");
}
