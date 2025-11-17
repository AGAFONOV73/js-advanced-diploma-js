import "./css/style.css";
import GameController from "./js/GameController.js";
import GamePlay from "./js/GamePlay.js";
import GameStateService from "./js/GameStateService.js";

document.addEventListener("DOMContentLoaded", () => {
  const gamePlay = new GamePlay();
  const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);

  gameCtrl.init();
});
