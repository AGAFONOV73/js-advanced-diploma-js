export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(character) {
    if (this.members.has(character)) {
      throw new Error('Character already exists in the team');
    }
    this.members.add(character);
  }

  addAll(...characters) {
    characters.forEach(character => {
      this.members.add(character);
    });
  }

  toArray() {
    return Array.from(this.members);
  }

  *[Symbol.iterator]() {
    for (const member of this.members) {
      yield member;
    }
  }
}
