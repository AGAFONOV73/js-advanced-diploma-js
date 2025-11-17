import GameStateService from '../GameStateService.js';

describe('GameStateService', () => {
  let stateService;
  let mockStorage;

  beforeEach(() => {
    mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    stateService = new GameStateService(mockStorage);
  });

  test('should save state correctly', () => {
    const state = { level: 2, score: 100 };
    
    stateService.save(state);
    
    expect(mockStorage.setItem).toHaveBeenCalledWith('state', JSON.stringify(state));
  });

  test('should load state correctly when valid', () => {
    const state = { level: 2, score: 100 };
    mockStorage.getItem.mockReturnValue(JSON.stringify(state));
    
    const result = stateService.load();
    
    expect(result).toEqual(state);
    expect(mockStorage.getItem).toHaveBeenCalledWith('state');
  });

  test('should return null when no saved state', () => {
    mockStorage.getItem.mockReturnValue(null);
    
    const result = stateService.load();
    
    expect(result).toBeNull();
  });

  test('should return null when invalid JSON', () => {
    mockStorage.getItem.mockReturnValue('invalid json');
    
    const result = stateService.load();
    
    expect(result).toBeNull();
  });
});