import { getCharacterInfo, characterInfo } from '../utils/characterInfo.js';

describe('getCharacterInfo', () => {
  test('should return empty string for null or undefined', () => {
    expect(getCharacterInfo(null)).toBe('');
    expect(getCharacterInfo(undefined)).toBe('');
  });

  test('should return formatted string with correct emojis and values', () => {
    const character = {
      level: 2,
      attack: 25,
      defence: 30,
      health: 80
    };

    const result = getCharacterInfo(character);
    expect(result).toBe('🎖2 ⚔25 🛡30 ❤80');
  });

  test('should handle missing properties with default values', () => {
    const character = {
      level: 1
      
    };

    const result = getCharacterInfo(character);
    expect(result).toBe('🎖1 ⚔0 🛡0 ❤0');
  });

  test('should work with different character types', () => {
    const bowman = {
      level: 3,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'bowman'
    };

    const swordsman = {
      level: 1,
      attack: 40,
      defence: 10,
      health: 100,
      type: 'swordsman'
    };

    expect(getCharacterInfo(bowman)).toBe('🎖3 ⚔25 🛡25 ❤50');
    expect(getCharacterInfo(swordsman)).toBe('🎖1 ⚔40 🛡10 ❤100');
  });
});

describe('characterInfo function', () => {
  test('should work with direct character object', () => {
    const character = {
      level: 4,
      attack: 30,
      defence: 20,
      health: 90
    };

    const result = characterInfo(character);
    expect(result).toBe('🎖4 ⚔30 🛡20 ❤90');
  });
});