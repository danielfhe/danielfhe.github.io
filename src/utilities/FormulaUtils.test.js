import FormulaUtils from './FormulaUtils';

test('parseWSEAttack works correctly', () => {
  let equip = {
    primaryLine: "13% ATT",
    secondaryLine: "N/A",
    tertiaryLine: "N/A"
  }

  let result = FormulaUtils.parseWSEAttack(equip);

  expect(result).toEqual(13);
});

test('getTotalJobAttack works correctly', () => {
    let upperShownDmgRange = 34534534;
    let weaponMultiplier = 1.50;
    let statValue = 42000;
    let dmgPercent = 150;
    let finalDmg = 25;

    let result = FormulaUtils.getTotalJobAttack(upperShownDmgRange, weaponMultiplier, statValue, dmgPercent, finalDmg);

    expect(result).toEqual(17541.350603174604);
});
