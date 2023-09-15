import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox, { HideableStatColumn } from './StatBox.js';
import DropdownSelector from './DropdownSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useMemo, useState } from 'react';
import ClassUtils from './ClassUtils';
import FormulaUtils from './FormulaUtils';

function App() {
  const [selectedClass, setSelectedClass] = useState('Adele');
  const [weapon, setWeapon] = useState('Bladecaster');
  const [stats, setStats] = useState({
    level: 0,
    hp: 0,
    mp: 0,
    upperShownDmgRange: 0,
    STR: 0,
    DEX: 0,
    LUK: 0,
    INT: 0,
    percentSTR: 0,
    percentDEX: 0,
    percentLUK: 0,
    percentINT: 0,
    percentAllStat: 0,
    dmgPercent: 0,
    finalDmg: 0,
    ied: 0,
    critRate: 0,
    critDmg: 0,
    bossDmg: 0,
    symbolStats: 0,
    bonusPotentialAtt: 0,
    magnificentSoul: false,
    familiarBadgeAtt: 0,
    familiarPotentialAtt: 0,
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
      hp: 0,
      mp: 0,
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
      primary: 0,
      secondary: 0
    }
  });
  const [statEquivalence, setStatEquivalence] = useState({
    attackEquivalence: null,
    secondaryEquivalence: null,
    percentAllEquivalence: null
  })
  const classInfo = useMemo(() => ClassUtils.getClassInfo(selectedClass), [selectedClass]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const weaponMultiplier = ClassUtils.getWeaponMultiplier(weapon, selectedClass);
    let calculated = {};

    calculated.primaryStats = classInfo.primary
      .map(statName => stats[statName]);
    calculated.secondaryStats = classInfo.secondary
      .map(statName => stats[statName]);
    calculated.primaryStatSum = calculated.primaryStats.reduce((a, b) => a + b, 0);
    calculated.secondaryStatSum = calculated.secondaryStats.reduce((a, b) => a + b, 0);
    calculated.primaryStatPercents = classInfo.primary.map(statName => stats[`percent${statName}`]);
    calculated.secondaryStatPercents = classInfo.secondary.map(statName => stats[`percent${statName}`]);
    calculated.hyperPrimaryStats = classInfo.primary
      .map(statName => stats.hyper[statName]);
    calculated.hyperSecondaryStats = classInfo.primary
      .map(statName => stats.hyper[statName]);

    calculated.attackPercent = 100.0 + (stats.magnificentSoul ? 3 : 0) + stats.familiarBadgeAtt + 
      stats.familiarPotentialAtt + stats.bonusPotentialAtt + classInfo.attPercent + FormulaUtils.getWeaponSecondaryEmblemAttack(stats);
    // 100 + soul + familiar badges + familiar potential + bonus potential att % (non-reboot) + class att % + attack from WSE
    calculated.statValue = FormulaUtils.getStatValue(selectedClass, calculated.primaryStatSum, calculated.secondaryStatSum);
    calculated.totalJobAttack = FormulaUtils.getTotalJobAttack(stats.upperShownDmgRange, weaponMultiplier, calculated.statValue, stats.dmgPercent, stats.finalDmg)
    calculated.attack = Math.floor(calculated.totalJobAttack / (calculated.attackPercent / 100));
    calculated.dmgPercent = stats.dmgPercent + classInfo.dmgPercent; // damage percent + class damage percent

    calculated.finalStatPrimary = (30 * calculated.hyperPrimaryStats[0]) + stats.symbolStats + stats.legion.primary;
    calculated.finalStatSecondary = (30 * calculated.hyperSecondaryStats[0]) + stats.legion.secondary;
    calculated.primaryBaseTotalStat = (calculated.primaryStats[0] - calculated.finalStatPrimary) / (1.0 + (calculated.primaryStatPercents[0] / 100.0));
    calculated.secondaryBaseTotalStat = (calculated.secondaryStats[0] - calculated.finalStatSecondary) / (1.0 + (calculated.secondaryStatPercents[0] / 100.0));

    calculated.currentDmg = FormulaUtils.damage(classInfo, calculated.attack, calculated.attackPercent / 100.0, calculated.finalStatPrimary, calculated.primaryBaseTotalStat, 1 + calculated.primaryStatPercents[0] / 100.0, calculated.finalStatSecondary, calculated.secondaryBaseTotalStat, 1 + calculated.secondaryStatPercents[0] / 100.0);
    calculated.plus1Attack = FormulaUtils.damage(classInfo, calculated.attack + 1, calculated.attackPercent / 100.0, calculated.finalStatPrimary, calculated.primaryBaseTotalStat, 1 + calculated.primaryStatPercents[0] / 100.0, calculated.finalStatSecondary, calculated.secondaryBaseTotalStat, 1 + calculated.secondaryStatPercents[0] / 100.0);
    calculated.attackDifference = calculated.plus1Attack - calculated.currentDmg;

    calculated.plus1PrimaryStat = FormulaUtils.damage(classInfo, calculated.attack, calculated.attackPercent / 100.0, calculated.finalStatPrimary, calculated.primaryBaseTotalStat + 1, 1 + calculated.primaryStatPercents[0] / 100.0, calculated.finalStatSecondary, calculated.secondaryBaseTotalStat, 1 + calculated.secondaryStatPercents[0] / 100.0);
    calculated.primaryStatDifference = calculated.plus1PrimaryStat - calculated.currentDmg;

    calculated.plus1SecondaryStat = FormulaUtils.damage(classInfo, calculated.attack, calculated.attackPercent / 100.0, calculated.finalStatPrimary, calculated.primaryBaseTotalStat, 1 + calculated.primaryStatPercents[0] / 100.0, calculated.finalStatSecondary, calculated.secondaryBaseTotalStat + 1, 1 + calculated.secondaryStatPercents[0] / 100.0);
    calculated.secondaryStatDifference = calculated.plus1SecondaryStat - calculated.currentDmg;

    calculated.plus1PercentAll = FormulaUtils.damage(classInfo, calculated.attack, calculated.attackPercent / 100.0, calculated.finalStatPrimary, calculated.primaryBaseTotalStat, (1 + calculated.primaryStatPercents[0] / 100.0) + 0.01, calculated.finalStatSecondary, calculated.secondaryBaseTotalStat, (1 + calculated.secondaryStatPercents[0] / 100.0) + 0.01);
    calculated.percentAllDifference = calculated.plus1PercentAll - calculated.currentDmg;

    calculated.primaryRatio = (calculated.primaryBaseTotalStat + 1) * (1 + calculated.primaryStatPercents[0]/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.percentRatio = (calculated.primaryBaseTotalStat) * (1 + (calculated.primaryStatPercents[0] + 1)/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.attackRatio = (calculated.primaryStats[0] + calculated.secondaryStats[0] / 4) / calculated.attack
    calculated.secondaryRatio = (calculated.secondaryBaseTotalStat + 1) * (1 + calculated.secondaryStatPercents[0]/ 100.0) + calculated.finalStatSecondary - calculated.secondaryStats[0]

    setStatEquivalence({
      ...statEquivalence,
      attackEquivalence: calculated.attackDifference / calculated.primaryStatDifference,
      secondaryEquivalence: calculated.primaryStatDifference / calculated.secondaryStatDifference,
      percentAllEquivalence: calculated.percentAllDifference / calculated.primaryStatDifference,
      attackEquivalence2: calculated.attackRatio / calculated.primaryRatio,
      secondaryEquivalence2: calculated.secondaryRatio / calculated.primaryRatio,
      percentAllEquivalence2: calculated.percentRatio / calculated.primaryRatio
    });

    console.log('form data');
    console.log(stats);
    console.log(`class: ${selectedClass}`);
    console.log(`weapon: ${weapon}`);
    console.log(calculated);
    console.log(statEquivalence);
  }

  return (
    <>
      <Container><HeadingBar/></Container>
      <div className="App-Body">
        { statEquivalence.attackEquivalence != null ? 
          <Container>
            <Row><Col><h4><u>Stat Equivalence</u></h4></Col></Row>
            <Row><Col><label>1% All Stats:</label> {statEquivalence.percentAllEquivalence.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Attack:</label> {statEquivalence.attackEquivalence.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Secondary Stat:</label> {statEquivalence.secondaryEquivalence.toFixed(2)} primary stat</Col></Row>
            <br/>
            <Row><Col><label>Primary ratio:</label> {statEquivalence.primaryRatio.toFixed(2)}</Col></Row>
            <Row><Col><label>1% ratio:</label> {statEquivalence.percentRatio.toFixed(2)}</Col></Row>
            <Row><Col><label>Attack ratio:</label> {statEquivalence.attackRatio.toFixed(2)}</Col></Row>
            <br/>
            <Row><Col><label>1% All Stats 2:</label> {statEquivalence.percentAllEquivalence2.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Attack 2:</label> {statEquivalence.attackEquivalence2.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Secondary Stat 2:</label> {statEquivalence.secondaryEquivalence2.toFixed(2)} primary stat</Col></Row>
          </Container>
          : null
        }
        <form onSubmit={handleSubmit}>
          <Container>
            <Row><Col><h4><u>Character Info</u></h4></Col></Row>
            <Row>
              <Col><label>Class</label><DropdownSelector optionsList={ClassUtils.getClassNames()} selected={selectedClass} setSelected={setSelectedClass}/></Col>
              <Col><label>Main weapon</label><DropdownSelector optionsList={ClassUtils.getWeaponNames()} selected={weapon} setSelected={setWeapon}/></Col>
              <Col><StatBox label={'Level'} stat={stats.level} type={'number'} setStatValue={s => {setStats({...stats, level: Number(s)})}}/></Col>
              {/* <Col><StatBox label={'HP'} stat={stats.hp} type={'number'} setStatValue={s => {setStats({...stats, hp: Number(s)})}}/></Col>
              <Col><StatBox label={'MP'} stat={stats.mp} type={'number'} setStatValue={s => {setStats({...stats, mp: Number(s)})}}/></Col> */}
              <Col><StatBox label={'Upper Damage Range'} stat={stats.upperShownDmgRange} type={'number'} setStatValue={s => {setStats({...stats, upperShownDmgRange: Number(s)})}}/></Col>
            </Row>
            <Row>
              <HideableStatColumn label={'STR'} stat={stats.STR} type={'number'} setStatValue={s => {setStats({...stats, STR: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('STR')}/>
              <HideableStatColumn label={'DEX'} stat={stats.DEX} type={'number'} setStatValue={s => {setStats({...stats, DEX: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('DEX')}/>
              <HideableStatColumn label={'LUK'} stat={stats.LUK} type={'number'} setStatValue={s => {setStats({...stats, LUK: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('LUK')}/>
              <HideableStatColumn label={'INT'} stat={stats.INT} type={'number'} setStatValue={s => {setStats({...stats, INT: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('INT')}/>
            </Row>
            <Row>
              <HideableStatColumn label={'STR% on equips'} stat={stats.percentSTR} type={'number'} setStatValue={s => {setStats({...stats, percentSTR: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('STR')}/>
              <HideableStatColumn label={'DEX% on equips'} stat={stats.percentDEX} type={'number'} setStatValue={s => {setStats({...stats, percentDEX: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('DEX')}/>
              <HideableStatColumn label={'LUK% on equips'} stat={stats.percentLUK} type={'number'} setStatValue={s => {setStats({...stats, percentLUK: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('LUK')}/>
              <HideableStatColumn label={'INT% on equips'} stat={stats.percentINT} type={'number'} setStatValue={s => {setStats({...stats, percentINT: Number(s)})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('INT')}/>
              <Col><StatBox label={'All stat% on equips'} stat={stats.percentAllStat} type={'number'} setStatValue={s => {setStats({...stats, percentAllStat: Number(s)})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox label={'Damage %'} stat={stats.dmgPercent} type={'number'} setStatValue={s => {setStats({...stats, dmgPercent: Number(s)})}}/></Col>
              <Col><StatBox label={'Final Damage'} stat={stats.finalDmg} type={'number'} setStatValue={s => {setStats({...stats, finalDmg: Number(s)})}}/></Col>
              {/* <Col><StatBox label={'Ignore Enemy Defense'} stat={stats.ied} type={'number'} setStatValue={s => {setStats({...stats, ied: Number(s)})}}/></Col>
              <Col><StatBox label={'Critical Rate'} stat={stats.critRate} type={'number'} setStatValue={s => {setStats({...stats, critRate: Number(s)})}}/></Col> */}
            </Row>
            {/* <Row>
              <Col><StatBox label={'Critical Damage'} stat={stats.critDmg} type={'number'} setStatValue={s => {setStats({...stats, critDmg: Number(s)})}}/></Col>
              <Col><StatBox label={'Boss Damage'} stat={stats.bossDmg} type={'number'} setStatValue={s => {setStats({...stats, bossDmg: Number(s)})}}/></Col>
            </Row> */}
            <Row>
              <Col><StatBox label={'Main Stat(s) from Arcane/Sacred Symbols'} stat={stats.symbolStats} type={'number'} setStatValue={s => {setStats({...stats, symbolStats: Number(s)})}}/></Col>
              <Col><StatBox label={'Main Stat(s) from Legion member bonuses'} stat={stats.legion.primary} type={'number'} setStatValue={s => {setStats({...stats, legion: {...stats.legion, primary: Number(s)}})}}/></Col>
              <Col><StatBox label={'Secondary Stat(s) from Legion member bonuses'} stat={stats.legion.secondary} type={'number'} setStatValue={s => {setStats({...stats, legion: {...stats.legion, secondary: Number(s)}})}}/></Col>
            </Row>
            <Row><Col><h4><u>Equipment</u></h4></Col></Row>
            <Row>
              <Col><b>Weapon</b></Col>
              <Col><b>Secondary</b></Col>
              <Col><b>Emblem</b></Col>
            </Row>
            <Row>
              <Col><input id="weaponLevel" type="checkbox" checked={stats.weapon.highLevel} onChange={s => {setStats({...stats, weapon: {highLevel: !stats.weapon.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> <label for="weaponLevel">Lvl 150+</label></Col>
              <Col><input id="secondaryLevel" type="checkbox" checked={stats.secondary.highLevel} onChange={s => {setStats({...stats, secondary: {highLevel: !stats.secondary.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> <label for="secondaryLevel">Lvl 150+</label></Col>
              <Col><input id="emblemLevel" type="checkbox" checked={stats.emblem.highLevel} onChange={s => {setStats({...stats, emblem: {highLevel: !stats.emblem.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> <label for="emblemLevel">Lvl 150+</label></Col>
            </Row>
            <Row>
              <Col>Primary line <DropdownSelector optionsList={FormulaUtils.getPrimaryPotentialOptions(stats.weapon.highLevel)} selected={stats.weapon.primaryLine} setSelected={s => {setStats({...stats, weapon: {...stats.weapon, primaryLine: s}})}}/></Col>
              <Col>Primary line <DropdownSelector optionsList={FormulaUtils.getPrimaryPotentialOptions(stats.secondary.highLevel)} selected={stats.secondary.primaryLine} setSelected={s => {setStats({...stats, secondary: {...stats.secondary, primaryLine: s}})}}/></Col>
              <Col>Primary line <DropdownSelector optionsList={FormulaUtils.getPrimaryPotentialOptions(stats.emblem.highLevel)} selected={stats.emblem.primaryLine} setSelected={s => {setStats({...stats, emblem: {...stats.emblem, primaryLine: s}})}}/></Col>
            </Row>
            <Row>
              <Col>Secondary line <DropdownSelector optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.weapon.highLevel)} selected={stats.weapon.secondaryLine} setSelected={s => {setStats({...stats, weapon: {...stats.weapon, secondaryLine: s}})}}/></Col>
              <Col>Secondary line <DropdownSelector optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.secondary.highLevel)} selected={stats.secondary.secondaryLine} setSelected={s => {setStats({...stats, secondary: {...stats.secondary, secondaryLine: s}})}}/></Col>
              <Col>Secondary line <DropdownSelector optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.emblem.highLevel)} selected={stats.emblem.secondaryLine} setSelected={s => {setStats({...stats, emblem: {...stats.emblem, secondaryLine: s}})}}/></Col>
            </Row>
            <Row>
              <Col>Tertiary line <DropdownSelector optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.weapon.highLevel)} selected={stats.weapon.tertiaryLine} setSelected={s => {setStats({...stats, weapon: {...stats.weapon, tertiaryLine: s}})}}/></Col>
              <Col>Tertiary line <DropdownSelector optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.secondary.highLevel)} selected={stats.secondary.tertiaryLine} setSelected={s => {setStats({...stats, secondary: {...stats.secondary, tertiaryLine: s}})}}/></Col>
              <Col>Tertiary line <DropdownSelector optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.emblem.highLevel)} selected={stats.emblem.tertiaryLine} setSelected={s => {setStats({...stats, emblem: {...stats.emblem, tertiaryLine: s}})}}/></Col>
            </Row>
            <Row><Col><h4><u>Bonus Potentials</u></h4></Col></Row>
            <Row>
              <Col><StatBox statName={'Total Attack %'} stat={stats.bonusPotentialAtt} type={'number'} setStatValue={s => {setStats({...stats, bonusPotentialAtt: Number(s)})}}/></Col>
            </Row>
            <Row><Col><h4><u>Hyper Stats</u></h4></Col></Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>STR</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.STR} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, STR: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>DEX</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.DEX} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, DEX: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>LUK</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.LUK} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, LUK: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>INT</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.INT} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, INT: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>HP</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.hp} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, hp: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>MP</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.mp} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, mp: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>DF/TF/Mana</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 11}, (v, i) => i)} selected={stats.hyper.dftfmana} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, dftfmana: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Critical Rate</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.critRate} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, critRate: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Critical Damage</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.critDmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, critDmg: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>IED</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.ied} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, ied: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Damage</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.dmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, dmg: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Boss Damage</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.bossDmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, bossDmg: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Status Resistance</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.statusResistance} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, statusResistance: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Knockback Resistance</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.knockbackResistance} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, knockbackResistance: s}})}}/></Col>
            </Row>
            <Row>
              <Col md={{span: 2, offset: 0}}>Weapon and Magic ATT</Col>
              <Col md={1}><DropdownSelector optionsList={Array.from({length: 16}, (v, i) => i)} selected={stats.hyper.jobAtt} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, jobAtt: s}})}}/></Col>
            </Row>
            <Row><Col><h4><u>Souls</u></h4></Col></Row>
            <Row>
              <Col><input id="magnificentSoul" type="checkbox" checked={stats.magnificentSoul} onChange={s => {setStats({...stats, magnificentSoul: !stats.magnificentSoul})}}/> <label for="magnificentSoul">Magnificent (ATT +3%)</label></Col>
            </Row>
            <Row><Col><h4><u>Familiars</u></h4></Col></Row>
            <Row><Col><h5>Badge Effect</h5></Col><Col><h5>Potential</h5></Col></Row>
            <Row>
              <Col><StatBox label={'Total Attack %'} stat={stats.familiarBadgeAtt} type={'number'} setStatValue={s => {setStats({...stats, familiarBadgeAtt: Number(s)})}}/></Col>
              <Col><StatBox label={'Total Attack %'} stat={stats.familiarPotentialAtt} type={'number'} setStatValue={s => {setStats({...stats, familiarPotentialAtt: Number(s)})}}/></Col>
            </Row>
            <br/>
            <Row>
              <Col><input type="submit" value="Submit"/></Col>
            </Row>
          </Container>
        </form>
      </div>
    </>
  );
}

export default App;
