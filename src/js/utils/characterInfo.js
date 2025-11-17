
export function characterInfo(character) {
    if (!character) return '';
  
    const { level = 1, attack = 0, defence = 0, health = 0 } = character;
    return `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`;
  }
  
  
   
 
  export function getCharacterInfo(character) {
    if (!character) return '';
  
    const { level = 1, attack = 0, defence = 0, health = 0 } = character;
    return `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`;
  }