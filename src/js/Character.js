
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target === Character) {
      throw new Error('Cannot create instance of abstract class Character');
    }
    
    this.level = 1; 
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    
    
    for (let i = 1; i < level; i += 1) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level += 1;
    this.health = Math.min(this.health + 80, 100);
    this.attack = Math.max(this.attack, Math.round(this.attack * (1.8 - this.health / 100)));
    this.defence = Math.max(this.defence, Math.round(this.defence * (1.8 - this.health / 100)));
  }
}