import { calcHealthLevel, calcTileType } from './utils.js';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  drawUi(theme) {
    console.log('drawUi начат');
    this.checkBinding();
  
    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">Новая игра</button>
        <button data-id="action-save" class="btn">Сохранить</button>
        <button data-id="action-load" class="btn">Загрузить</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;
  
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');
  
    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));
  
    this.boardEl = this.container.querySelector('[data-id=board]');
    console.log('boardEl найден:', !!this.boardEl);
  
    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }
  
    this.cells = Array.from(this.boardEl.children);
    console.log('drawUi завершен - клеток создано:', this.cells.length);
  }

  redrawPositions(positions) {
    console.log('redrawPositions вызван');
    
    if (!this.cells || this.cells.length === 0) {
      console.error('Нельзя перерисовать - нет доступных клеток');
      return;
    }
  
    
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }
  
    
    const characterImageMap = {
      bowman: 'bowman',
      swordsman: 'swordsman', 
      magician: 'magician',
      vampire: 'vampire',
      undead: 'undead',
      daemon: 'daemon'
    };
  
    for (const positionedCharacter of positions) {
      const { position, character } = positionedCharacter;
      
      if (position < 0 || position >= this.cells.length) continue;
      
      const cellEl = this.boardEl.children[position];
      const charEl = document.createElement('div');
      
      
      const imageName = characterImageMap[character.type];
      charEl.style.backgroundImage = `url('./img/characters/${imageName}.png')`;
      
      charEl.style.width = '64px';
      charEl.style.height = '64px';
      charEl.style.position = 'absolute';
      charEl.style.zIndex = '99';
      charEl.style.backgroundSize = 'contain';
      charEl.style.backgroundRepeat = 'no-repeat';
      charEl.style.backgroundPosition = 'center';
      
      charEl.style.boxSizing = 'border-box';
  
      
      const healthEl = document.createElement('div');
      healthEl.style.position = 'absolute';
      healthEl.style.top = '2px';
      healthEl.style.left = '7px';
      healthEl.style.width = '50px';
      healthEl.style.height = '4px';
      healthEl.style.background = '#333';
      healthEl.style.borderRadius = '2px';
  
      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.style.height = '4px';
      healthIndicatorEl.style.borderRadius = '2px';
      healthIndicatorEl.style.width = `${Math.max(0, Math.min(100, character.health))}%`;
      
      if (character.health < 15) {
        healthIndicatorEl.style.background = '#f00';
      } else if (character.health < 50) {
        healthIndicatorEl.style.background = '#ff0';
      } else {
        healthIndicatorEl.style.background = '#0f0';
      }
  
      healthEl.appendChild(healthIndicatorEl);
      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
      
      console.log(`Персонаж ${character.type} добавлен на позицию ${position}`);
    }
    
    console.log('redrawPositions завершен');
  }

  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }

  selectCell(index, color = 'yellow') {
    console.log('selectCell вызван:', index, color);
    
    if (index < 0 || index >= this.cells.length) {
      console.error('Неверный индекс в selectCell:', index);
      return;
    }
    
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
    console.log('Клетка выделена:', index);
  }

  deselectCell(index) {
    console.log('deselectCell вызван:', index);
    
    if (index < 0 || index >= this.cells.length) {
      console.error('Неверный индекс в deselectCell:', index);
      return;
    }
    
    const cell = this.cells[index];
    const selectedClasses = Array.from(cell.classList)
      .filter(className => className.startsWith('selected'));
    
    console.log('Удаляем классы:', selectedClasses);
    cell.classList.remove(...selectedClasses);
  }

  showCellTooltip(message, index) {
    if (index < 0 || index >= this.cells.length) return;
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    if (index < 0 || index >= this.cells.length) return;
    this.cells[index].title = '';
  }
  
  showDamage(index, damage) {
    return new Promise((resolve) => {
      if (index < 0 || index >= this.cells.length) {
        resolve();
        return;
      }
      
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    if (this.boardEl) {
      this.boardEl.style.cursor = cursor;
    }
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay не привязан к DOM');
    }
  }
}