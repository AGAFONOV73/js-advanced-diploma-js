export default class GameState {
  constructor() {
    this.currentPlayer = 'player';
    this.selectedCharacter = null;
    this.selectedCellIndex = null;
    this.level = 1;
    this.positions = [];
    this.score = 0;
    this.maxScore = 0;
    this.gameState = 'idle';
    this.gameOver = false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'player' ? 'computer' : 'player';
    this.deselectCharacter();
  }

  selectCharacter(character, cellIndex) {
    this.selectedCharacter = character;
    this.selectedCellIndex = cellIndex;
    this.gameState = 'selecting';
  }

  deselectCharacter() {
    this.selectedCharacter = null;
    this.selectedCellIndex = null;
    this.gameState = 'idle';
  }

  isPlayerCharacter(character) {
    const isPlayer = character && character.side === 'player';
    console.log('isPlayerCharacter:', character?.type, 'side:', character?.side, 'result:', isPlayer);
    return isPlayer;
  }
  
  isEnemyCharacter(character) {
    const isEnemy = character && character.side === 'enemy';
    console.log('isEnemyCharacter:', character?.type, 'side:', character?.side, 'result:', isEnemy);
    return isEnemy;
  }

  addScore(points) {
    this.score += points;
    this.maxScore = Math.max(this.maxScore, this.score);
  }

  levelUp() {
    this.level += 1;
    
    this.positions.forEach(position => {
      if (position.character.side === 'player') {
        position.character.health = Math.min(position.character.health + 80, 100);
        if (position.character.level < 4) {
          position.character.levelUp();
        }
      }
    });
  }

  toJSON() {
    return {
      currentPlayer: this.currentPlayer,
      selectedCharacter: this.selectedCharacter,
      selectedCellIndex: this.selectedCellIndex,
      level: this.level,
      positions: this.positions,
      score: this.score,
      maxScore: this.maxScore,
      gameState: this.gameState,
      gameOver: this.gameOver
    };
  }

  fromObject(obj) {
    Object.assign(this, obj);
    return this;
  }
}