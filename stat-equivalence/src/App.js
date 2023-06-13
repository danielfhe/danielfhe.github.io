import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox from './StatBox.js';
import DropdownSelector from './DropdownSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import ClassUtils from './ClassUtils';
import FormulaUtils from './FormulaUtils';

function App() {
  const [selectedClass, setSelectedClass] = useState('Adele');
  const [weapon, setWeapon] = useState('BladeCaster');
  const [stats, setStats] = useState({
    level: 0,
    hp: 0,
    mp: 0,
    upperShownDmgRange: 0,
    str: 0,
    dex: 0,
    luk: 0,
    int: 0,
    dmgPercent: 0,
    finalDmg: 0,
    ied: 0,
    critRate: 0,
    critDmg: 0,
    bossDmg: 0,
    arcanePower: 0,
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
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`form data: ${JSON.stringify(stats)}`);
    console.log(`class: ${selectedClass}`);
    console.log(`weapon: ${weapon}`);

    const classInfo = ClassUtils.getClassInfo(selectedClass);
    const weaponMultiplier = ClassUtils.getWeaponMultiplier(weapon, selectedClass);
    const primaryStatArray = classInfo.primary
      .map(statName => stats[statName.toLowerCase()]);
    const secondaryStatArray = classInfo.secondary
    .map(statName => stats[statName.toLowerCase()]);
    const attackPercent = 100.0 + (stats.magnificentSoul ? 3 : 0) + stats.familiarBadgeAtt + 
      stats.familiarPotentialAtt + stats.bonusPotentialAtt + classInfo.attPercent + FormulaUtils.getWeaponSecondaryEmblemAttack(stats);
    // 100 + soul + familiar badges + familiar potential + bonus potential att % (non-reboot) + class att % + attack from WSE
    const statValue = FormulaUtils.getStatValue(selectedClass, primaryStatArray.reduce((a, b) => a + b, 0), secondaryStatArray.reduce((a, b) => a + b, 0));
    const totalJobAttack = FormulaUtils.getTotalJobAttack(stats.upperShownDmgRange, weaponMultiplier, statValue, stats.dmgPercent, stats.finalDmg)
    const attack = totalJobAttack / (attackPercent / 100);
    const dmgPercent = 0; // damage percent + class damage percent

    console.log(primaryStatArray);
  }

  return (
    <>
      <Container><HeadingBar/></Container>
      <div className="App-Body">
        <form onSubmit={handleSubmit}>
          <Container>
            <Row><Col><h4><u>Character Info</u></h4></Col></Row>
            <Row>
              <Col><label>Class</label><DropdownSelector optionsList={ClassUtils.getClassNames()} selected={selectedClass} setSelected={setSelectedClass}/></Col>
              <Col><label>Main weapon</label><DropdownSelector optionsList={ClassUtils.getWeaponNames()} selected={weapon} setSelected={setWeapon}/></Col>
              <Col><StatBox statName={'Level'} stat={stats.level} type={'number'} setStatValue={s => {setStats({...stats, level: Number(s)})}}/></Col>
              <Col><StatBox statName={'HP'} stat={stats.hp} type={'number'} setStatValue={s => {setStats({...stats, hp: Number(s)})}}/></Col>
              <Col><StatBox statName={'MP'} stat={stats.mp} type={'number'} setStatValue={s => {setStats({...stats, mp: Number(s)})}}/></Col>
              <Col><StatBox statName={'Upper Damage Range'} stat={stats.upperShownDmgRange} type={'number'} setStatValue={s => {setStats({...stats, upperShownDmgRange: Number(s)})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox statName={'STR'} stat={stats.str} type={'number'} setStatValue={s => {setStats({...stats, str: Number(s)})}}/></Col>
              <Col><StatBox statName={'DEX'} stat={stats.dex} type={'number'} setStatValue={s => {setStats({...stats, dex: Number(s)})}}/></Col>
              <Col><StatBox statName={'LUK'} stat={stats.luk} type={'number'} setStatValue={s => {setStats({...stats, luk: Number(s)})}}/></Col>
              <Col><StatBox statName={'INT'} stat={stats.int} type={'number'} setStatValue={s => {setStats({...stats, int: Number(s)})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox statName={'Damage %'} stat={stats.dmgPercent} type={'number'} setStatValue={s => {setStats({...stats, dmgPercent: Number(s)})}}/></Col>
              <Col><StatBox statName={'Final Damage'} stat={stats.finalDmg} type={'number'} setStatValue={s => {setStats({...stats, finalDmg: Number(s)})}}/></Col>
              <Col><StatBox statName={'Ignore Enemy Defense'} stat={stats.ied} type={'number'} setStatValue={s => {setStats({...stats, ied: Number(s)})}}/></Col>
              <Col><StatBox statName={'Critical Rate'} stat={stats.critRate} type={'number'} setStatValue={s => {setStats({...stats, critRate: Number(s)})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox statName={'Critical Damage'} stat={stats.critDmg} type={'number'} setStatValue={s => {setStats({...stats, critDmg: Number(s)})}}/></Col>
              <Col><StatBox statName={'Boss Damage'} stat={stats.bossDmg} type={'number'} setStatValue={s => {setStats({...stats, bossDmg: Number(s)})}}/></Col>
              <Col><StatBox statName={'Main Stat from Arcane Symbols'} stat={stats.arcanePower} type={'number'} setStatValue={s => {setStats({...stats, arcanePower: Number(s)})}}/></Col>
            </Row>
            <Row><Col><h4><u>Equipment</u></h4></Col></Row>
            <Row>
              <Col><b>Weapon</b></Col>
              <Col><b>Secondary</b></Col>
              <Col><b>Emblem</b></Col>
            </Row>
            <Row>
              <Col><input type="checkbox" checked={stats.weapon.highLevel} onChange={s => {setStats({...stats, weapon: {highLevel: !stats.weapon.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> Lvl 150+</Col>
              <Col><input type="checkbox" checked={stats.secondary.highLevel} onChange={s => {setStats({...stats, secondary: {highLevel: !stats.secondary.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> Lvl 150+</Col>
              <Col><input type="checkbox" checked={stats.emblem.highLevel} onChange={s => {setStats({...stats, emblem: {highLevel: !stats.emblem.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> Lvl 150+</Col>
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
            <Row><Col><h4><u>Souls</u></h4></Col></Row>
            <Row>
              <Col><input type="checkbox" checked={stats.magnificentSoul} onChange={s => {setStats({...stats, magnificentSoul: !stats.magnificentSoul})}}/> Magnificent (ATT +3%)</Col>
            </Row>
            <Row><Col><h4><u>Familiars</u></h4></Col></Row>
            <Row><Col><h5>Badge Effect</h5></Col><Col><h5>Potential</h5></Col></Row>
            <Row>
              <Col><StatBox statName={'Total Attack %'} stat={stats.familiarBadgeAtt} type={'number'} setStatValue={s => {setStats({...stats, familiarBadgeAtt: Number(s)})}}/></Col>
              <Col><StatBox statName={'Total Attack %'} stat={stats.familiarPotentialAtt} type={'number'} setStatValue={s => {setStats({...stats, familiarPotentialAtt: Number(s)})}}/></Col>
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
