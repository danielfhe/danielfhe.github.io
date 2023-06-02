export default class FormulaUtils {
  static getStatValue(className, primaryStat, secondaryStat, level) {
    if(className === "Demon Avenger") {
      const pureHp = 545.0 + (90 * level); // 4th job and above
      return Math.floor(pureHp / 3.5) + (0.8 * Math.floor(primaryStat - pureHp) / 3.5) + secondaryStat;
    }

    return (4 * primaryStat) + secondaryStat;
  }

  static getTotalJobAttack(upperShownDmgRange, weaponMultiplier, statValue, dmgPercent, finalDmgPercent) {
    return (100.0 * upperShownDmgRange) / ((weaponMultiplier * statValue) * (1 + (dmgPercent / 100)) * (1 + (finalDmgPercent / 100)));
  }

  static getEquipLevelOptions() {
    return levelOptions;
  }

  static getPotentialOptions(isLowLevel) {
    return isLowLevel ? potentialOptionsLow : potentialOptionsHigh;
  }
}

let levelOptions = ['Lvl < 150', 'Lvl 150+'];
let potentialOptionsHigh = ['40% Boss', '35% Boss', '30% Boss', '40% IED', '35% IED', '13% ATT', '13% Damage'];
let potentialOptionsLow = ['40% Boss', '35% Boss', '30% Boss', '40% IED', '35% IED', '12% ATT', '12% Damage'];
