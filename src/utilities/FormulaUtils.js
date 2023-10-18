export default class FormulaUtils {
  static getStatValue(className, primaryStats, secondaryStats, level) {
    let primaryStatsSum = primaryStats.reduce((a, b) => a + b, 0);
    let secondaryStatsSum = secondaryStats.reduce((a, b) => a + b, 0);
    if(className === "Demon Avenger") {
      const pureHp = 545.0 + (90 * level); // 4th job and above
      return Math.floor(pureHp / 3.5) + (0.8 * Math.floor(primaryStatsSum - pureHp) / 3.5) + secondaryStatsSum;
    }

    return (4 * primaryStatsSum) + secondaryStatsSum;
  }

  static getTotalJobAttack(selectedClass, upperShownDmgRange, weaponMultiplier, statValue, dmgPercent, finalDmgPercent, hp) {
    // the next 3 lines account for the double counting of Kanna's Blessing of the 5 Elements Beginner skill and Kasen 4th job skill 
    // in the stat window damage range
    let dmgPercentModifier = selectedClass === 'Kanna' ? 30.0 : 0.0;
    hp = hp > 500000 ? 500000 : hp;
    let totalJobAttackModifier = selectedClass === 'Kanna' ? Math.floor(hp / 700.0) : 0.0;

    return (100.0 * upperShownDmgRange) / ((weaponMultiplier * statValue) * (1 + ((dmgPercent + dmgPercentModifier) / 100.0)) * (1 + (finalDmgPercent / 100.0))) - totalJobAttackModifier;
  }

  static getPrimaryPotentialOptions(isHighLevel) {
    return isHighLevel ? primaryPotentialOptionsHigh : primaryPotentialOptionsLow;
  }

  static getSecondaryPotentialOptions(isHighLevel) {
    return isHighLevel ? secondaryPotentialOptionsHigh : secondaryPotentialOptionsLow;
  }

  static getWeaponSecondaryEmblemAttack(stats) {
    let weaponAttackPotential = this.parseWSEAttack(stats.weapon);
    let secondaryAttackPotential = this.parseWSEAttack(stats.secondary);
    let emblemAttackPotential = this.parseWSEAttack(stats.emblem);
    
    return weaponAttackPotential + secondaryAttackPotential + emblemAttackPotential;
  }

  static parseWSEAttack(equip) {
    let re = /\d+/;
    let primary = equip.primaryLine.includes('ATT') ? Number(re.exec(equip.primaryLine)) : 0;
    let secondary = equip.secondaryLine.includes('ATT') ? Number(re.exec(equip.secondaryLine)) : 0;
    let tertiary = equip.tertiaryLine.includes('ATT') ? Number(re.exec(equip.tertiaryLine)) : 0;

    return primary + secondary + tertiary;
  }
}

let primaryPotentialOptionsHigh = ['40% Boss', '35% Boss', '30% Boss', '40% IED', '35% IED', '13% ATT', '13% Damage', 'N/A'];
let primaryPotentialOptionsLow = ['40% Boss', '35% Boss', '30% Boss', '40% IED', '35% IED', '12% ATT', '12% Damage', 'N/A'];
let secondaryPotentialOptionsHigh = ['40% Boss', '35% Boss', '30% Boss', '20% Boss', '40% IED', '35% IED', '30% IED', '13% ATT', '10% ATT', '13% Damage', '10% Damage', 'N/A'];
let secondaryPotentialOptionsLow = ['40% Boss', '35% Boss', '30% Boss', '20% Boss', '40% IED', '35% IED', '30% IED', '12% ATT', '9% ATT', '12% Damage', '9% Damage', 'N/A'];
