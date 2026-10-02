export function getPlaceContent(node) {
  return {
    ...node,
    kind: node.relationshipType === 'residence' ? '居所与人物' : '园林与宴饮场所',
    residentLabel: node.resident || '无固定居住人物',
  };
}

export function getFoodEntry(node) {
  return node.foodCardId
    ? { kind: 'play', foodCardId: node.foodCardId }
    : { kind: 'demo', title: '食笺 · 关系待核验' };
}
