const openButton = document.querySelector(".game__button_i");
const closeButton = document.querySelector(".modal__button");
const overlay = document.querySelector(".overlay");

openButton.addEventListener("click", openRulesHandler);
closeButton.addEventListener("click", closeRulesHandler);
overlay.addEventListener("click", overlayHandler);

function openRulesHandler() {
  overlay.classList.remove("overlay_hidden");
  document.addEventListener("keydown", escapeHandler);
  document.body.classList.add("hidden");
}

function closeRulesHandler() {
  overlay.classList.add("overlay_hidden");
  document.body.classList.remove("hidden");
}

function overlayHandler(e) {
  if (e.currentTarget === e.target) {
    closeRulesHandler();
  }
}

function escapeHandler(e) {
  if (e.code === "Escape") {
    document.removeEventListener("keydown", escapeHandler);
    closeRulesHandler();
  }
}
