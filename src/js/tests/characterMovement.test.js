import Bowman from '../characters/Bowman.js';
import Swordsman from '../characters/Swordsman.js';
import Magician from '../characters/Magician.js';
import Vampire from '../characters/Vampire.js';
import Undead from '../characters/Undead.js';
import Daemon from '../characters/Daemon.js';
import { canMove, canAttack, calcDistance } from '../utils.js';

describe('Character Movement and Attack Ranges', () => {
  const boardSize = 8;
  const occupiedPositions = new Set();

  describe('Movement ranges', () => {
    test('Swordsman and Undead can move 4 cells', () => {
      const swordsman = new Swordsman(1);
      const undead = new Undead(1);
      
      expect(canMove(0, 4, swordsman, boardSize, occupiedPositions)).toBe(true);
      expect(canMove(0, 5, swordsman, boardSize, occupiedPositions)).toBe(false); 
      
      expect(canMove(0, 4, undead, boardSize, occupiedPositions)).toBe(true);
      expect(canMove(0, 5, undead, boardSize, occupiedPositions)).toBe(false);
    });

    test('Bowman and Vampire can move 2 cells', () => {
      const bowman = new Bowman(1);
      const vampire = new Vampire(1);
      
      expect(canMove(0, 2, bowman, boardSize, occupiedPositions)).toBe(true);
      expect(canMove(0, 3, bowman, boardSize, occupiedPositions)).toBe(false); 
      
      expect(canMove(0, 2, vampire, boardSize, occupiedPositions)).toBe(true);
      expect(canMove(0, 3, vampire, boardSize, occupiedPositions)).toBe(false);
    });

    test('Magician and Daemon can move 1 cell', () => {
      const magician = new Magician(1);
      const daemon = new Daemon(1);
      
      expect(canMove(0, 1, magician, boardSize, occupiedPositions)).toBe(true);
      expect(canMove(0, 2, magician, boardSize, occupiedPositions)).toBe(false); 
      
      expect(canMove(0, 1, daemon, boardSize, occupiedPositions)).toBe(true);
      expect(canMove(0, 2, daemon, boardSize, occupiedPositions)).toBe(false);
    });
  });

  describe('Attack ranges', () => {
    test('Swordsman and Undead can attack 1 cell', () => {
      const swordsman = new Swordsman(1);
      const undead = new Undead(1);
      const enemy = { side: 'enemy' };
      
      expect(canAttack(0, 1, swordsman, boardSize, enemy)).toBe(true);
      expect(canAttack(0, 2, swordsman, boardSize, enemy)).toBe(false);
      
      expect(canAttack(0, 1, undead, boardSize, enemy)).toBe(true);
      expect(canAttack(0, 2, undead, boardSize, enemy)).toBe(false);
    });

    test('Bowman and Vampire can attack 2 cells', () => {
      const bowman = new Bowman(1);
      const vampire = new Vampire(1);
      const enemy = { side: 'enemy' };
      
      expect(canAttack(0, 2, bowman, boardSize, enemy)).toBe(true);
      expect(canAttack(0, 3, bowman, boardSize, enemy)).toBe(false);
      
      expect(canAttack(0, 2, vampire, boardSize, enemy)).toBe(true);
      expect(canAttack(0, 3, vampire, boardSize, enemy)).toBe(false);
    });

    test('Magician and Daemon can attack 4 cells', () => {
      const magician = new Magician(1);
      const daemon = new Daemon(1);
      const enemy = { side: 'enemy' };
      
      expect(canAttack(0, 4, magician, boardSize, enemy)).toBe(true);
      expect(canAttack(0, 5, magician, boardSize, enemy)).toBe(false);
      
      expect(canAttack(0, 4, daemon, boardSize, enemy)).toBe(true);
      expect(canAttack(0, 5, daemon, boardSize, enemy)).toBe(false);
    });
  });

  describe('Distance calculation', () => {
    test('calcDistance works correctly', () => {
      expect(calcDistance(0, 1, 8)).toBe(1); 
      expect(calcDistance(0, 8, 8)).toBe(1); 
      expect(calcDistance(0, 9, 8)).toBe(1); 
      expect(calcDistance(0, 18, 8)).toBe(2); 
      expect(calcDistance(0, 63, 8)).toBe(7); 
    });
  });
});