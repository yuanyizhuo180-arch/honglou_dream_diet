(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.HonglouEggplantCookVisuals = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const kinds = ['鸡脯肉', '香菌', '新笋', '蘑菇', '五香腐干', '各色干果'];
  const count = 120;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const round = value => Math.round(value * 100) / 100;
  const fraction = value => value - Math.floor(value);
  function potPosition(index) {
    const u = fraction((index + 1) * .61803398875);
    const v = fraction((index + 1) * .75487766625);
    if (index < 28) return { point: [round(552 + 276 * u), round(316 + 32 * v)], layer: 'back' };
    if (index < 56) return { point: [round(658 + 64 * u), round(383 + 205 * v)], layer: 'front' };
    if (index < 98) {
      const x = 568 + 244 * u;
      return { point: [round(x), round(603 + 24 * v - .05 * Math.abs(x - 690))], layer: 'front' };
    }
    return { point: [round(525 + 330 * u), round(390 + 155 * v)], layer: 'front' };
  }
  function makePieces() {
    return Array.from({ length: count }, (_, index) => {
      const radius = Math.sqrt((index + .5) / count);
      const plateAngle = index * goldenAngle;
      const destination = potPosition(index);
      return {
        id: `ingredient-${index}`,
        kind: kinds[index % kinds.length],
        cell: index % kinds.length,
        size: 68 + (index * 7) % 15,
        rotation: (index * 47) % 80 - 40,
        plate: [round(1265 + 146 * radius * Math.cos(plateAngle)), round(315 + 77 * radius * Math.sin(plateAngle))],
        pot: destination.point,
        layer: destination.layer,
      };
    });
  }
  return { kinds, makePieces };
});
