import GameState from "./GameState.js";
import { getCharacterInfo } from "./utils/characterInfo.js";
import { canMove, canAttack, calcDistance } from "./utils.js";
import PositionedCharacter from "./PositionedCharacter.js";
import { generateTeam, playerTypes, enemyTypes } from "./generators.js";
import cursors from "./cursors.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onNewGame = this.onNewGame.bind(this);
    this.onSaveGame = this.onSaveGame.bind(this);
    this.onLoadGame = this.onLoadGame.bind(this);
  }

  init() {
    console.log("Инициализация GameController начата");

    const container = document.querySelector("#game-container");
    if (!container) {
      throw new Error("Игровой контейнер не найден в DOM");
    }
    this.gamePlay.bindToDOM(container);
    console.log("GamePlay привязан к DOM");

    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addNewGameListener(this.onNewGame);
    this.gamePlay.addSaveGameListener(this.onSaveGame);
    this.gamePlay.addLoadGameListener(this.onLoadGame);
    console.log("Обработчики событий добавлены");

    const savedState = this.stateService.load();
    if (savedState) {
      console.log("Загружаем сохраненное состояние...");
      this.gameState.fromObject(savedState);
      console.log("Сохраненное состояние загружено");

      this.initializeLevel();
    } else {
      this.startNewGame();
    }

    console.log("Инициализация GameController завершена");
  }

  startNewGame() {
    this.gameState = new GameState();
    this.gameState.maxScore = Math.max(
      this.gameState.maxScore,
      this.gameState.score
    );
    this.gameState.score = 0;
    console.log("Начинаем новую игру...");
    this.initializeLevel();
  }

  initializeLevel() {
    const theme = this.getThemeForLevel(this.gameState.level);

    this.gamePlay.drawUi(theme);
    console.log("Интерфейс отрисован с темой:", theme);

    setTimeout(() => {
      console.log("DOM обновлен, создаем персонажей...");

      if (this.gameState.positions.length === 0) {
        console.log("Создаем новых персонажей...");
        const playerTeam = generateTeam(playerTypes, this.gameState.level, 4);
        const enemyTeam = generateTeam(enemyTypes, this.gameState.level, 4);

        this.gameState.positions = this.placeCharacters(playerTeam, enemyTeam);
        console.log("Персонажи созданы и размещены");
      }

      this.redrawGame();
      this.updateStats();

      alert(`Уровень ${this.gameState.level} - ${theme}`);
    }, 100);
  }

  async onCellClick(index) {
    console.log("Клетка нажата:", index);

    if (this.gameState.gameOver || this.gameState.currentPlayer !== "player") {
      if (this.gameState.currentPlayer !== "player") {
        alert("Сейчас ход противника!");
      }
      return;
    }

    const character = this.getCharacterAt(index);
    console.log("Персонаж в клетке:", character);

    if (!character) {
      console.log("Нажата пустая клетка");
      if (this.gameState.selectedCharacter) {
        await this.handleMove(index);
      } else {
        alert("Выберите своего персонажа!");
      }
      return;
    }

    if (this.gameState.isEnemyCharacter(character)) {
      console.log("Нажат персонаж противника:", character.type);
      if (this.gameState.selectedCharacter) {
        await this.handleAttack(index);
      } else {
        alert("Это персонаж противника! Выберите своего персонажа.");
      }
      return;
    }

    if (this.gameState.isPlayerCharacter(character)) {
      console.log("Нажат персонаж игрока:", character.type);
      this.selectCharacter(character, index);
    }
  }

  onCellEnter(index) {
    if (this.gameState.gameOver) return;

    const character = this.getCharacterAt(index);
    if (character) {
      const info = getCharacterInfo(character);
      this.gamePlay.showCellTooltip(info, index);
    }
    this.handleCellHover(index);
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.deselectCell(index);
    this.updateCursor();
  }

  handleCellHover(index) {
    if (this.gameState.gameOver) return;

    const character = this.getCharacterAt(index);
    const occupiedPositions = this.getOccupiedPositions();

    if (this.gameState.selectedCharacter) {
      const fromIndex = this.gameState.selectedCellIndex;

      if (!character) {
        if (
          canMove(
            fromIndex,
            index,
            this.gameState.selectedCharacter,
            this.gamePlay.boardSize,
            occupiedPositions
          )
        ) {
          this.gamePlay.selectCell(index, "green");
          this.gamePlay.setCursor(cursors.pointer);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else if (this.gameState.isEnemyCharacter(character)) {
        if (
          canAttack(
            fromIndex,
            index,
            this.gameState.selectedCharacter,
            this.gamePlay.boardSize,
            character
          )
        ) {
          this.gamePlay.selectCell(index, "red");
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else if (this.gameState.isPlayerCharacter(character)) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    } else {
      if (character && this.gameState.isPlayerCharacter(character)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.updateCursor();
      }
    }
  }

  async handleMove(toIndex) {
    const fromIndex = this.gameState.selectedCellIndex;
    const occupiedPositions = this.getOccupiedPositions();

    if (
      canMove(
        fromIndex,
        toIndex,
        this.gameState.selectedCharacter,
        this.gamePlay.boardSize,
        occupiedPositions
      )
    ) {
      const positionIndex = this.gameState.positions.findIndex(
        (p) => p.position === fromIndex
      );
      this.gameState.positions[positionIndex].position = toIndex;

      this.gamePlay.deselectCell(fromIndex);
      this.gameState.deselectCharacter();
      this.redrawGame();

      await this.computerTurn();
    } else {
      alert("Невозможно переместиться в эту клетку!");
    }
  }

  async handleAttack(targetIndex) {
    const fromIndex = this.gameState.selectedCellIndex;
    const targetCharacter = this.getCharacterAt(targetIndex);

    if (
      canAttack(
        fromIndex,
        targetIndex,
        this.gameState.selectedCharacter,
        this.gamePlay.boardSize,
        targetCharacter
      )
    ) {
      const damage = this.calculateDamage(
        this.gameState.selectedCharacter,
        targetCharacter
      );

      await this.gamePlay.showDamage(targetIndex, damage);

      targetCharacter.health -= damage;

      if (targetCharacter.health <= 0) {
        this.gameState.positions = this.gameState.positions.filter(
          (p) => p.position !== targetIndex
        );
        this.gameState.addScore(10 * this.gameState.level);
      }

      this.gamePlay.deselectCell(fromIndex);
      this.gameState.deselectCharacter();
      this.redrawGame();
      this.updateStats();

      if (this.checkRoundEnd()) {
        await this.handleRoundEnd();
      } else {
        await this.computerTurn();
      }
    } else {
      alert("Невозможно атаковать этого противника!");
    }
  }

  calculateDamage(attacker, target) {
    return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
  }

  async computerTurn() {
    this.gameState.switchPlayer();
    this.gamePlay.setCursor(cursors.wait);
    alert("Ход противника");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const computerPositions = this.gameState.positions.filter(
      (p) => p.character.side === "enemy"
    );
    const playerPositions = this.gameState.positions.filter(
      (p) => p.character.side === "player"
    );

    for (const computerPos of computerPositions) {
      for (const playerPos of playerPositions) {
        if (
          canAttack(
            computerPos.position,
            playerPos.position,
            computerPos.character,
            this.gamePlay.boardSize,
            playerPos.character
          )
        ) {
          const damage = this.calculateDamage(
            computerPos.character,
            playerPos.character
          );

          await this.gamePlay.showDamage(playerPos.position, damage);
          playerPos.character.health -= damage;

          if (playerPos.character.health <= 0) {
            this.gameState.positions = this.gameState.positions.filter(
              (p) => p.position !== playerPos.position
            );
          }

          this.redrawGame();
          this.updateStats();

          if (this.checkRoundEnd()) {
            await this.handleRoundEnd();
            return;
          }

          this.gameState.switchPlayer();
          this.updateCursor();
          alert("Ваш ход");
          return;
        }
      }
    }

    for (const computerPos of computerPositions) {
      const movePosition = this.findComputerMove(
        computerPos.position,
        playerPositions
      );
      if (movePosition !== null) {
        computerPos.position = movePosition;
        this.redrawGame();
        break;
      }
    }

    this.gameState.switchPlayer();
    this.updateCursor();
    alert("Ваш ход");
  }

  findComputerMove(fromPosition, playerPositions) {
    const boardSize = this.gamePlay.boardSize;
    const occupiedPositions = this.getOccupiedPositions();
    const computerCharacter = this.getCharacterAt(fromPosition);

    let nearestPlayer = null;
    let minDistance = Infinity;

    for (const playerPos of playerPositions) {
      const distance = calcDistance(
        fromPosition,
        playerPos.position,
        boardSize
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestPlayer = playerPos;
      }
    }

    if (!nearestPlayer) return null;

    const fromRow = Math.floor(fromPosition / boardSize);
    const fromCol = fromPosition % boardSize;

    for (let row = fromRow - 1; row <= fromRow + 1; row++) {
      for (let col = fromCol - 1; col <= fromCol + 1; col++) {
        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
          const newPosition = row * boardSize + col;
          if (
            newPosition !== fromPosition &&
            !occupiedPositions.has(newPosition)
          ) {
            const newDistance = calcDistance(
              newPosition,
              nearestPlayer.position,
              boardSize
            );
            if (
              newDistance < minDistance &&
              canMove(
                fromPosition,
                newPosition,
                computerCharacter,
                boardSize,
                occupiedPositions
              )
            ) {
              return newPosition;
            }
          }
        }
      }
    }

    return null;
  }

  checkRoundEnd() {
    const playerCount = this.gameState.positions.filter(
      (p) => p.character.side === "player"
    ).length;
    const enemyCount = this.gameState.positions.filter(
      (p) => p.character.side === "enemy"
    ).length;
    return playerCount === 0 || enemyCount === 0;
  }

  async handleRoundEnd() {
    const playerCount = this.gameState.positions.filter(
      (p) => p.character.side === "player"
    ).length;
    const enemyCount = this.gameState.positions.filter(
      (p) => p.character.side === "enemy"
    ).length;

    if (playerCount === 0) {
      this.gameState.gameOver = true;
      alert("Игра окончена! Вы проиграли.");
      this.updateStats();
    } else if (enemyCount === 0) {
      this.gameState.addScore(100 * this.gameState.level);

      if (this.gameState.level >= 4) {
        this.gameState.gameOver = true;
        alert("Поздравляем! Вы прошли все уровни!");
      } else {
        this.gameState.levelUp();
        const enemyTeam = generateTeam(enemyTypes, this.gameState.level, 4);
        this.placeEnemies(enemyTeam);
        alert(
          `Уровень ${this.gameState.level - 1} пройден! Начинается уровень ${
            this.gameState.level
          }`
        );
      }

      this.redrawGame();
      this.updateStats();
    }
  }

  placeEnemies(enemyTeam) {
    this.gameState.positions = this.gameState.positions.filter(
      (p) => p.character.side === "player"
    );

    const boardSize = this.gamePlay.boardSize;
    const occupiedPositions = this.getOccupiedPositions();
    const enemyCharacters = enemyTeam.toArray();

    enemyCharacters.forEach((character, index) => {
      const row = Math.floor(index / 2) * 2;
      const col = 6 + (index % 2);
      const position = row * boardSize + col;

      if (!occupiedPositions.has(position)) {
        this.gameState.positions.push(
          new PositionedCharacter({ ...character, side: "enemy" }, position)
        );
      }
    });
  }

  selectCharacter(character, index) {
    console.log("Выбор персонажа:", character.type, "в клетке:", index);

    if (this.gameState.selectedCellIndex !== null) {
      console.log(
        "Снимаем выделение с предыдущей клетки:",
        this.gameState.selectedCellIndex
      );
      this.gamePlay.deselectCell(this.gameState.selectedCellIndex);
    }

    this.gameState.selectCharacter(character, index);
    console.log("Выделяем клетку:", index);
    this.gamePlay.selectCell(index, "yellow");

    console.log("Выбранный персонаж:", this.gameState.selectedCharacter);
  }

  getOccupiedPositions() {
    return new Set(this.gameState.positions.map((p) => p.position));
  }

  getCharacterAt(index) {
    const position = this.gameState.positions.find((p) => p.position === index);
    const character = position ? position.character : null;
    console.log(
      "Поиск персонажа в клетке:",
      index,
      "найден:",
      character?.type,
      "сторона:",
      character?.side
    );
    return character;
  }

  placeCharacters(playerTeam, enemyTeam) {
    const positions = [];
    const boardSize = this.gamePlay.boardSize;
    const occupiedPositions = new Set();

    console.log("Размещаем персонажей, размер поля:", boardSize);

    const playerCharacters = playerTeam.toArray();
    playerCharacters.forEach((character, index) => {
      const row = index % 4;
      const col = 0;
      const position = row * boardSize + col;

      console.log(
        `Игрок ${index}: строка=${row}, колонка=${col}, позиция=${position}`
      );

      if (!occupiedPositions.has(position)) {
        positions.push(
          new PositionedCharacter({ ...character, side: "player" }, position)
        );
        occupiedPositions.add(position);
      }
    });

    const enemyCharacters = enemyTeam.toArray();
    enemyCharacters.forEach((character, index) => {
      const row = index % 4;
      const col = boardSize - 2;
      const position = row * boardSize + col;

      console.log(
        `Противник ${index}: строка=${row}, колонка=${col}, позиция=${position}`
      );

      if (!occupiedPositions.has(position)) {
        positions.push(
          new PositionedCharacter({ ...character, side: "enemy" }, position)
        );
        occupiedPositions.add(position);
      }
    });

    console.log(
      "Финальные позиции:",
      positions.map((p) => p.position)
    );
    return positions;
  }

  redrawGame() {
    console.log(
      "Перерисовываем игру с количеством позиций:",
      this.gameState.positions.length
    );

    console.log("=== ПРОВЕРКА ПЕРЕД ПЕРЕРИСОВКОЙ ===");
    console.log(
      "Клетки GamePlay:",
      this.gamePlay.cells ? this.gamePlay.cells.length : "НЕТ КЛЕТОК"
    );
    console.log(
      "Элемент поля GamePlay:",
      this.gamePlay.boardEl ? "СУЩЕСТВУЕТ" : "ОТСУТСТВУЕТ"
    );
    console.log("Данные позиций:", this.gameState.positions);

    this.gamePlay.redrawPositions(this.gameState.positions);
    this.updateCursor();

    setTimeout(() => {
      console.log("=== ПРОВЕРКА ПОСЛЕ ПЕРЕРИСОВКИ ===");

      const allCells = document.querySelectorAll(".cell");
      console.log("Клеток в DOM:", allCells.length);

      const characters = document.querySelectorAll(".character");
      console.log("Персонажей в DOM:", characters.length);

      allCells.forEach((cell, index) => {
        const hasCharacter = cell.querySelector(".character");
        if (hasCharacter) {
          console.log(
            `Клетка ${index}: ЕСТЬ персонаж -`,
            hasCharacter.className
          );
        }
      });

      if (characters.length === 0) {
        console.log("Персонажей нет! Создаю тестового...");
        this.createTestCharacter();
      }
    }, 100);
  }

  updateCursor() {
    if (this.gameState.gameOver) {
      this.gamePlay.setCursor(cursors.auto);
    } else if (this.gameState.currentPlayer === "computer") {
      this.gamePlay.setCursor(cursors.wait);
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  updateStats() {
    const statsElement =
      document.querySelector(".game-stats") || this.createStatsElement();
    statsElement.innerHTML = `
      <div>Уровень: ${this.gameState.level}</div>
      <div>Очки: ${this.gameState.score}</div>
      <div>Рекорд: ${this.gameState.maxScore}</div>
      ${
        this.gameState.gameOver
          ? '<div class="game-over">ИГРА ОКОНЧЕНА</div>'
          : ""
      }
    `;
  }

  createStatsElement() {
    const statsElement = document.createElement("div");
    statsElement.className = "game-stats";

    document.querySelector(".board-container").appendChild(statsElement);
    return statsElement;
  }

  getThemeForLevel(level) {
    const themeMap = { 1: "prairie", 2: "desert", 3: "arctic", 4: "mountain" };
    return themeMap[level] || "prairie";
  }

  onNewGame() {
    alert("Начинаем новую игру...");
    this.startNewGame();
  }

  onSaveGame() {
    this.stateService.save(this.gameState.toJSON());
    alert("Игра успешно сохранена!");
  }

  onLoadGame() {
    try {
      const savedState = this.stateService.load();
      if (savedState) {
        this.gameState.fromObject(savedState);
        this.redrawGame();
        this.updateStats();
        alert("Игра успешно загружена!");
      } else {
        alert("Сохраненная игра не найдена!");
      }
    } catch (error) {
      alert("Ошибка при загрузке игры!");
    }
  }

  createTestCharacter() {
    const testCell = document.querySelector(".cell");
    if (testCell) {
      const testChar = document.createElement("div");
      testChar.className = "character character-bowman";
      testChar.innerHTML =
        '<div class="health-level"><div class="health-level-indicator health-level-indicator-high" style="width: 80%"></div></div>';
      testChar.style.border = "3px solid yellow";
      testCell.appendChild(testChar);
      console.log("Тестовый персонаж создан в клетке 0");
    }
  }
}
