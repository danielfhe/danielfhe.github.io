export default class ClassUtils {
  static getClassesObject() {
    return classes;
  }

  static getClassNames() {
    return Object.keys(classes);
  }

  static getClassInfo(className) {
    return classes[className];
  }

  static getWeaponNames() {
    return Object.keys(weapons);
  }

  static getWeaponMultiplier(weapon, className) {
    let multiplier = weapons[weapon].multiplier;

    if(className === 'Hero') {
      if(['One-handed Axe', 'One-handed Sword', 'Two-handed Axe', 'Two-handed Sword'].includes(weapon)) return multiplier + 0.1;
    }

    return multiplier;
  }

  static initializeStats() {
    return initialStats;
  }

  static initializeStatEquivalence() {
    return {
      attackEquivalences: null,
      secondaryEquivalences: null,
      percentAllEquivalences: null,
      statValue: null
    };
  }
}

let classes = {
  'Adele': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 14,
    dmgPercent: 20
  },
  'Angelic Buster': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 4,
    dmgPercent: 50
  },
  'Aran': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 52 //weighted avg
  },
  'Ark': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Battle Mage': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 39,
    dmgPercent: 0
  },
  'Bishop': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 4,
    dmgPercent: 60
  },
  'Blaster': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 19,
    dmgPercent: 10
  },
  'Blaze Wizard': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 14,
    dmgPercent: 0
  },
  'Beast Tamer': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 15,
    dmgPercent: 20
  },
  'Bowmaster': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 29,
    dmgPercent: 30
  },
  'Buccaneer': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Cadena': {
    primary: ['LUK'],
    secondary: ['STR', 'DEX'],
    attPercent: 4,
    dmgPercent: 7 //weighted avg
  },
  'Cannoneer': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 60
  },
  'Corsair': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 24,
    dmgPercent: 30
  },
  'Dark Knight': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Dawn Warrior': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 14,
    dmgPercent: 20
  },
  'Demon Avenger': {
    primary: ['HP'],
    secondary: ['STR'],
    attPercent: 4,
    dmgPercent: 30
  },
  'Demon Slayer': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 52 //weighted avg
  },
  'Dual Blade': {
    primary: ['LUK'],
    secondary: ['STR', 'DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Evan': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 39,
    dmgPercent: 40
  },
  'Fire Poison': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 4,
    dmgPercent: 55
  },
  'Hayato': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: -50
  },
  'Hero': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 45
  },
  'Hoyoung': {
    primary: ['LUK'],
    secondary: ['DEX'],
    attPercent: 14,
    dmgPercent: 0
  },
  'Ice Lightning': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 4,
    dmgPercent: 120
  },
  'Illium': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 14,
    dmgPercent: 20
  },
  'Jett': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 29,
    dmgPercent: 20
  },
  'Kain': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 34,
    dmgPercent: 10
  },
  'Kaiser': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 34,
    dmgPercent: 10 //weighted avg final form
  },
  'Kanna': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 4,
    dmgPercent: 0
  },
  'Kinesis': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 14,
    dmgPercent: 0
  },
  'Lara': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 4,
    dmgPercent: 25 //20% immaculate thought + 5% lv2 nature's friend
  },
  'Luminous': {
    primary: ['INT'],
    secondary: ['LUK'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Marksmen': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Mechanic': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 4,
    dmgPercent: 3 //weighted avg
  },
  'Mercedes': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 34,
    dmgPercent: 60 //weighted avg
  },
  'Mihile': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 50
  },
  'Night Lord': {
    primary: ['LUK'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Night Walker': {
    primary: ['LUK'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Paladin': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Pathfinder': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 24,
    dmgPercent: 20
  },
  'Phantom': {
    primary: ['LUK'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 4 //weighted avg
  },
  'Shade': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 40
  },
  'Shadower': {
    primary: ['LUK'],
    secondary: ['STR', 'DEX'],
    attPercent: 4,
    dmgPercent: 20
  },
  'Thunder Breaker': {
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: 55 //weighted avg
  },
  'Wild Hunter': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 39,
    dmgPercent: 20
  },
  'Wind Archer': {
    primary: ['DEX'],
    secondary: ['STR'],
    attPercent: 14,
    dmgPercent: 35
  },
  'Xenon': {
    primary: ['STR', 'DEX', 'LUK'],
    secondary: [],
    attPercent: 4,
    dmgPercent: 20
  },
  'Zero':{
    primary: ['STR'],
    secondary: ['DEX'],
    attPercent: 4,
    dmgPercent: -14 //10 stacks, -24 to average between modes
  }
};

let weapons = {
  'Ancient Bow': { multiplier: 1.30 },
  'Arm Cannon': { multiplier: 1.70 },
  'Bladecaster': { multiplier: 1.30 },
  'Bow': { multiplier: 1.30 },
  'Cane': { multiplier: 1.30 },
  'Cannon': { multiplier: 1.50 },
  'Claw': { multiplier: 1.75 },
  'Crossbow': { multiplier: 1.35 },
  'Dagger': { multiplier: 1.30 },
  'Desperado': { multiplier: 1.30 },
  'Dual Bowgun': { multiplier: 1.30 },
  'Energy Chain': { multiplier: 1.30 },
  'Fan': { multiplier: 1.35 },
  'Great Sword (Lapis)': { multiplier: 1.49 },
  'Gun': { multiplier: 1.50 },
  'Katana': { multiplier: 1.25 },
  'Knuckle': { multiplier: 1.70 },
  'Lucent Guantlet': { multiplier: 1.20 },
  'One-handed Axe': { multiplier: 1.20 },
  'One-handed Blunt Weapon': { multiplier: 1.20 },
  'One-handed Sword': { multiplier: 1.24 },
  'Polearm': { multiplier: 1.49 },
  'Psy-limiter': { multiplier: 1.20 },
  'Ritual Fan': { multiplier: 1.30 },
  'Scepter': { multiplier: 1.34 },
  'Shining Rod': { multiplier: 1.20 },
  'Soul Shooter': { multiplier: 1.70 },
  'Spear': { multiplier: 1.49 },
  'Staff': { multiplier: 1.20 },
  'Two-handed Axe': { multiplier: 1.34 },
  'Two-handed Blunt Weapon': { multiplier: 1.34 },
  'Two-handed Sword': { multiplier: 1.34 },
  'Wand': { multiplier: 1.20 },
  'Whip Blade': { multiplier: 1.3125 },
  'Whispershot': { multiplier: 1.30 }
}

let initialStats = {
  level: 0,
  HP: {
    total: 0,
    percent: 0
  },
  MP: {
    total: 0,
    percent: 0
  },
  upperShownDmgRange: 0,
  STR: {
    total: 0,
    ap: 0,
    percent: 0
  },
  DEX: {
    total: 0,
    ap: 0,
    percent: 0
  },
  LUK: {
    total: 0,
    ap: 0,
    percent: 0
  },
  INT: {
    total: 0,
    ap: 0,
    percent: 0
  },
  percentAllStat: 0,
  percentAP: 0,
  dmgPercent: 0,
  finalDmg: 0,
  ied: 0,
  critRate: 0,
  critDmg: 0,
  bossDmg: 0,
  symbols: {
    STR: 0,
    DEX: 0,
    LUK: 0,
    INT: 0,
    HP: 0
  },
  bonusPotentialAtt: 0,
  magnificentSoul: false,
  weapon: {
    highLevel: false,
    primaryLine: 'N/A',
    secondaryLine: 'N/A',
    tertiaryLine: 'N/A'
  },
  secondary: {
    highLevel: false,
    primaryLine: 'N/A',
    secondaryLine: 'N/A',
    tertiaryLine: 'N/A'
  },
  emblem: {
    highLevel: false,
    primaryLine: 'N/A',
    secondaryLine: 'N/A',
    tertiaryLine: 'N/A'
  },
  hyper: {
    STR: 0,
    DEX: 0,
    LUK: 0,
    INT: 0,
    HP: 0,
    MP: 0,
    dftfmana: 0,
    critRate: 0,
    critDmg: 0,
    ied: 0,
    dmg: 0,
    bossDmg: 0,
    statusResistance: 0,
    knockbackResistance: 0,
    jobAtt: 0,
    bonuxExp: 0,
    arcaneForce: 0
  },
  legion: {
    STR: 0,
    DEX: 0,
    LUK: 0,
    INT: 0,
    HP: 0
  },
  familiars: {
    badgeAttPercentSum: 0,
    badgeAllStatPercentSum: 0,
    badgeHpPercentSum: 0,
    potentialAttPercentSum: 0,
    potentialAllStatPercentSum: 0,
    potentialPrimaryPercentSum: 0,
    potentialHpPercentSum: 0,
    potentialSecondaryPercentSum: 0
  }
};
