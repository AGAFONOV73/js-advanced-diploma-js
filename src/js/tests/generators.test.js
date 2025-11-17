import { characterGenerator, generateTeam, playerTypes, enemyTypes } from '../generators.js';
import Team from '../Team.js';

describe('characterGenerator', () => {
  test('should generate infinite stream of characters from allowedTypes', () => {
    const generator = characterGenerator(playerTypes, 2);
    const characters = new Set();
    
   
    for (let i = 0; i < 10; i++) {
      const character = generator.next().value;
      expect(character).toBeDefined();
      expect(['bowman', 'swordsman', 'magician']).toContain(character.type);
      characters.add(character);
    }
    
    
    expect(characters.size).toBeGreaterThan(1);
  });

  test('should generate characters within level range', () => {
    const maxLevel = 3;
    const generator = characterGenerator(playerTypes, maxLevel);
    
    for (let i = 0; i < 10; i++) {
      const character = generator.next().value;
      expect(character.level).toBeGreaterThanOrEqual(1);
      expect(character.level).toBeLessThanOrEqual(maxLevel);
    }
  });
});

describe('generateTeam', () => {
  test('should generate team with correct number of characters', () => {
    const characterCount = 5;
    const team = generateTeam(playerTypes, 2, characterCount);
    
    expect(team).toBeInstanceOf(Team);
    expect(team.toArray()).toHaveLength(characterCount);
  });

  test('should generate characters within level range', () => {
    const maxLevel = 4;
    const team = generateTeam(enemyTypes, maxLevel, 3);
    const characters = team.toArray();
    
    characters.forEach(character => {
      expect(character.level).toBeGreaterThanOrEqual(1);
      expect(character.level).toBeLessThanOrEqual(maxLevel);
    });
  });

  test('should generate only allowed character types', () => {
    
    const team = generateTeam(playerTypes, 2, 5);
    const characters = team.toArray();
    
    characters.forEach(character => {
      expect(['bowman', 'swordsman', 'magician']).toContain(character.type);
    });
  });
});