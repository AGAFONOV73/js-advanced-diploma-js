import Bowman from './characters/Bowman.js';
import Swordsman from './characters/Swordsman.js';
import Magician from './characters/Magician.js';
import Vampire from './characters/Vampire.js';
import Undead from './characters/Undead.js';
import Daemon from './characters/Daemon.js';
import Team from './Team.js';

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const RandomCharacterType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const level = Math.floor(Math.random() * maxLevel) + 1;
    yield new RandomCharacterType(level);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const generator = characterGenerator(allowedTypes, maxLevel);
  const team = new Team();

  for (let i = 0; i < characterCount; i++) {
    const character = generator.next().value;
    
    if (character.level > maxLevel) {
      character.level = maxLevel;
    }
    team.add(character);
  }

  return team;
}


export const playerTypes = [Bowman, Swordsman, Magician];
export const enemyTypes = [Vampire, Undead, Daemon];