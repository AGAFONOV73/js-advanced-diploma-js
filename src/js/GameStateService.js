export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      const state = this.storage.getItem('state');
      return state ? JSON.parse(state) : null;
    } catch {
      return null;
    }
  }
}