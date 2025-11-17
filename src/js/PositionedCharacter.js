

export default class PositionedCharacter {
  constructor(character, position) {
    if (!character) {
      throw new Error('character must be specified');
    }
    
    if (typeof position !== 'number' || position < 0) {
      throw new Error('position must be a non-negative number');
    }

    this.character = character;
    this.position = position;
  }
}