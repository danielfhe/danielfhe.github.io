export default class FormulaUtils {
  static getStatValue(className, primaryStat, secondaryStat, level) {
    if(className === "Demon Avenger") {
      const pureHp = 545.0 + (90 * level); // 4th job and above
      return Math.floor(pureHp / 3.5) + (0.8 * Math.floor(primaryStat - pureHp) / 3.5) + secondaryStat;
    }

    return (4 * primaryStat) + secondaryStat;
  }

  static getTotalJobAttack(upperShownDmgRange, weaponMultiplier, statValue, dmgPercent, finalDmgPercent) {
    return (100.0 * upperShownDmgRange) / ((weaponMultiplier * statValue) * (1 + (dmgPercent / 100.0)) * (1 + (finalDmgPercent / 100.0)));
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

  static damage(classInfo, attackWithoutPercent, attackPercentAsMultiplier, finalStatPrimary, baseTotalStatPrimary, primaryPercentAsMultiplier, finalStatSecondary, baseTotalStatSecondary, secondaryPercentAsMultiplier) { //TODO: refactor
    let primary = baseTotalStatPrimary * primaryPercentAsMultiplier + finalStatPrimary;
    let secondary = baseTotalStatSecondary * secondaryPercentAsMultiplier + finalStatSecondary;
    let attack = attackWithoutPercent * attackPercentAsMultiplier;

    return ((4 * primary) + secondary) * attack;
  }
}

let primaryPotentialOptionsHigh = ['40% Boss', '35% Boss', '30% Boss', '40% IED', '35% IED', '13% ATT', '13% Damage', 'N/A'];
let primaryPotentialOptionsLow = ['40% Boss', '35% Boss', '30% Boss', '40% IED', '35% IED', '12% ATT', '12% Damage', 'N/A'];
let secondaryPotentialOptionsHigh = ['40% Boss', '35% Boss', '30% Boss', '20% Boss', '40% IED', '35% IED', '30% IED', '13% ATT', '10% ATT', '13% Damage', '10% Damage', 'N/A'];
let secondaryPotentialOptionsLow = ['40% Boss', '35% Boss', '30% Boss', '20% Boss', '40% IED', '35% IED', '30% IED', '12% ATT', '9% ATT', '12% Damage', '9% Damage', 'N/A'];
