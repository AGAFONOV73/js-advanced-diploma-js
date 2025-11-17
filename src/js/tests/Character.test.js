import Character from '../Character.js';
import Bowman from '../characters/Bowman.js';
import Swordsman from '../characters/Swordsman.js';
import Magician from '../characters/Magician.js';
import Vampire from '../characters/Vampire.js';
import Undead from '../characters/Undead.js';
import Daemon from '../characters/Daemon.js';

describe('Character', () => {
  test('should throw error when creating instance of abstract class Character', () => {
    expect(() => new Character(1)).toThrow('Cannot create instance of abstract class Character');
  });

  test('should not throw error when creating instances of inherited classes', () => {
    expect(() => new Bowman(1)).not.toThrow();
    expect(() => new Swordsman(1)).not.toThrow();
    expect(() => new Magician(1)).not.toThrow();
    expect(() => new Vampire(1)).not.toThrow();
    expect(() => new Undead(1)).not.toThrow();
    expect(() => new Daemon(1)).not.toThrow();
  });
});

describe('Character level 1 stats', () => {
  test('Bowman has correct stats', () => {
    const bowman = new Bowman(1);
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);
    expect(bowman.health).toBe(50);
    expect(bowman.level).toBe(1);
    expect(bowman.type).toBe('bowman');
  });

  test('Swordsman has correct stats', () => {
    const swordsman = new Swordsman(1);
    expect(swordsman.attack).toBe(40);
    expect(swordsman.defence).toBe(10);
    expect(swordsman.type).toBe('swordsman');
  });

  test('Magician has correct stats', () => {
    const magician = new Magician(1);
    expect(magician.attack).toBe(10);
    expect(magician.defence).toBe(40);
    expect(magician.type).toBe('magician');
  });

  test('Vampire has correct stats', () => {
    const vampire = new Vampire(1);
    expect(vampire.attack).toBe(25);
    expect(vampire.defence).toBe(25);
    expect(vampire.type).toBe('vampire');
  });

  test('Undead has correct stats', () => {
    const undead = new Undead(1);
    expect(undead.attack).toBe(40);
    expect(undead.defence).toBe(10);
    expect(undead.type).toBe('undead');
  });

  test('Daemon has correct stats', () => {
    const daemon = new Daemon(1);
    expect(daemon.attack).toBe(10);
    expect(daemon.defence).toBe(10);
    expect(daemon.type).toBe('daemon');
  });
});