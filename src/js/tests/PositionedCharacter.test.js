import PositionedCharacter from '../PositionedCharacter.js';
import Bowman from '../characters/Bowman.js';

describe('PositionedCharacter', () => {
  test('should create positioned character with valid parameters', () => {
    const character = new Bowman(1);
    const position = 10;
    const positionedCharacter = new PositionedCharacter(character, position);
    
    expect(positionedCharacter.character).toBe(character);
    expect(positionedCharacter.position).toBe(position);
  });

  test('should throw error when character is not specified', () => {
    expect(() => new PositionedCharacter(null, 10)).toThrow('character must be specified');
    expect(() => new PositionedCharacter(undefined, 10)).toThrow('character must be specified');
  });

  test('should throw error when position is invalid', () => {
    const character = new Bowman(1);
    
    expect(() => new PositionedCharacter(character, -1)).toThrow('position must be a non-negative number');
    expect(() => new PositionedCharacter(character, '10')).toThrow('position must be a non-negative number');
    expect(() => new PositionedCharacter(character, null)).toThrow('position must be a non-negative number');
  });
});