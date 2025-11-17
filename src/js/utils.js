export function calcTileType(index, boardSize) {
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;

  if (row === 0 && col === 0) return "top-left";
  if (row === 0 && col === boardSize - 1) return "top-right";
  if (row === boardSize - 1 && col === 0) return "bottom-left";
  if (row === boardSize - 1 && col === boardSize - 1) return "bottom-right";
  if (row === 0) return "top";
  if (row === boardSize - 1) return "bottom";
  if (col === 0) return "left";
  if (col === boardSize - 1) return "right";
  return "center";
}

export function calcHealthLevel(health) {
  if (health < 15) return "critical";
  if (health < 50) return "normal";
  return "high";
}

export function calcDistance(position1, position2, boardSize) {
  const x1 = position1 % boardSize;
  const y1 = Math.floor(position1 / boardSize);
  const x2 = position2 % boardSize;
  const y2 = Math.floor(position2 / boardSize);

  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export function canMove(
  fromIndex,
  toIndex,
  character,
  boardSize,
  occupiedPositions
) {
  if (occupiedPositions.has(toIndex)) return false;

  const distance = calcDistance(fromIndex, toIndex, boardSize);
  return distance <= character.range;
}

export function canAttack(
  fromIndex,
  toIndex,
  character,
  boardSize,
  targetCharacter
) {
  if (!targetCharacter || character.side === targetCharacter.side) return false;

  const distance = calcDistance(fromIndex, toIndex, boardSize);
  return distance <= character.rangeAttack;
}
