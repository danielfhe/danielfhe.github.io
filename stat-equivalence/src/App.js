import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox, { HideableStatColumn } from './StatBox.js';
import DropdownSelector, { HyperStatDropdownSelector } from './DropdownSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
    symbolStats: 0,
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
    },
    familiar: {
      badgeAttPercentSum: 0,
      badgePrimarySum: 0,
      badgeAllStatSum: 0,
      potentialAttPercentSum: 0,
      potentialPrimarySum: 0,
      potentialAllStatSum: 0
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
      .map(statName => stats[statName].total);
    calculated.secondaryStats = classInfo.secondary
      .map(statName => stats[statName].total);
    calculated.primaryStatAPs = classInfo.primary
      .map(statName => stats[statName].ap);
    calculated.secondaryStatAPs = classInfo.secondary
      .map(statName => stats[statName].ap);
    calculated.primaryStatPercents = classInfo.primary.map(statName => stats[statName].percent + stats.percentAllStat);
    calculated.secondaryStatPercents = classInfo.secondary.map(statName => stats[statName].percent + stats.percentAllStat);
    calculated.hyperPrimaryStats = classInfo.primary
      .map(statName => stats.hyper[statName]);
    calculated.hyperSecondaryStats = classInfo.primary
      .map(statName => stats.hyper[statName]);

    calculated.attackPercent = 100.0 + (stats.magnificentSoul ? 3 : 0) + stats.familiar.badgeAttPercentSum + 
      stats.familiar.potentialAttPercentSum + stats.bonusPotentialAtt + classInfo.attPercent + FormulaUtils.getWeaponSecondaryEmblemAttack(stats);
    // 100 + soul + familiar badges + familiar potential + bonus potential att % (non-reboot) + class att % + attack from WSE
    calculated.statValue = FormulaUtils.getStatValue(selectedClass, calculated.primaryStats, calculated.secondaryStats);
    calculated.totalJobAttack = FormulaUtils.getTotalJobAttack(stats.upperShownDmgRange, weaponMultiplier, calculated.statValue, stats.dmgPercent, stats.finalDmg)
    calculated.attack = Math.floor(calculated.totalJobAttack / (calculated.attackPercent / 100));
    // calculated.dmgPercent = stats.dmgPercent + classInfo.dmgPercent; // damage percent + class damage percent

    calculated.finalStatPrimary = (30 * calculated.hyperPrimaryStats[0]) + stats.symbolStats + stats.legion.primary;
    calculated.finalStatSecondary = (30 * calculated.hyperSecondaryStats[0]) + stats.legion.secondary;
    calculated.primaryBaseTotalStat = (calculated.primaryStats[0] - calculated.finalStatPrimary) / (1.0 + (calculated.primaryStatPercents[0] / 100.0));
    calculated.secondaryBaseTotalStat = (calculated.secondaryStats[0] - calculated.finalStatSecondary) / (1.0 + (calculated.secondaryStatPercents[0] / 100.0));

    calculated.primaryRatio = (calculated.primaryBaseTotalStat + 1) * (1 + calculated.primaryStatPercents[0]/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.percentRatio = (calculated.primaryBaseTotalStat) * (1 + (calculated.primaryStatPercents[0] + 1)/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.attackRatio = (calculated.primaryStats[0] + calculated.secondaryStats[0] / 4) / calculated.attack
    calculated.secondaryRatio = (calculated.secondaryBaseTotalStat + 1) * (1 + calculated.secondaryStatPercents[0]/ 100.0) + calculated.finalStatSecondary - calculated.secondaryStats[0]

    setStatEquivalence({
      ...statEquivalence,
      attackEquivalence: calculated.attackRatio / calculated.primaryRatio,
      secondaryEquivalence: calculated.secondaryRatio / calculated.primaryRatio,
      percentAllEquivalence: calculated.percentRatio / calculated.primaryRatio
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
      <HeadingBar/>
      <div className="App-Body">
        { statEquivalence.attackEquivalence != null ? 
          <Container>
            <Row><Col><h4><u>Stat Equivalence</u></h4></Col></Row>
            <Row><Col><label>1% All Stats:</label> {statEquivalence.percentAllEquivalence.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Attack:</label> {statEquivalence.attackEquivalence.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Secondary Stat:</label> {statEquivalence.secondaryEquivalence.toFixed(2)} primary stat</Col></Row>
            {/* <br/>
            <Row><Col><label>Primary ratio:</label> {statEquivalence.primaryRatio.toFixed(2)}</Col></Row>
            <Row><Col><label>1% ratio:</label> {statEquivalence.percentRatio.toFixed(2)}</Col></Row>
            <Row><Col><label>Attack ratio:</label> {statEquivalence.attackRatio.toFixed(2)}</Col></Row> */}
          </Container>
          : null
        }
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row><Col><h4><u>Character Info</u></h4></Col></Row>
            <Row>
              <Col><DropdownSelector label={'Class'} optionsList={ClassUtils.getClassNames()} selected={selectedClass} setSelected={setSelectedClass}/></Col>
              <Col><DropdownSelector label={'Main weapon'} optionsList={ClassUtils.getWeaponNames()} selected={weapon} setSelected={setWeapon}/></Col>
              <Col><StatBox label={'Level'} stat={stats.level} type={'number'} setStatValue={s => {setStats({...stats, level: Number(s)})}}/></Col>
              <Col><StatBox label={'Upper Damage Range'} stat={stats.upperShownDmgRange} type={'number'} setStatValue={s => {setStats({...stats, upperShownDmgRange: Number(s)})}}/></Col>
            </Row>
            <Row>
              <HideableStatColumn label={'STR'} stat={stats.STR.total} type={'number'} setStatValue={s => {setStats({...stats, STR: {...stats.STR, total: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('STR')}/>
              <HideableStatColumn label={'DEX'} stat={stats.DEX.total} type={'number'} setStatValue={s => {setStats({...stats, DEX: {...stats.DEX, total: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('DEX')}/>
              <HideableStatColumn label={'LUK'} stat={stats.LUK.total} type={'number'} setStatValue={s => {setStats({...stats, LUK: {...stats.LUK, total: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('LUK')}/>
              <HideableStatColumn label={'INT'} stat={stats.INT.total} type={'number'} setStatValue={s => {setStats({...stats, INT: {...stats.INT, total: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('INT')}/>
              <HideableStatColumn label={'HP'} stat={stats.hp} type={'number'} setStatValue={s => {setStats({...stats, hp: Number(s)})}} shouldShow={selectedClass === 'Demon Avenger'}/>
              <HideableStatColumn label={'MP'} stat={stats.mp} type={'number'} setStatValue={s => {setStats({...stats, mp: Number(s)})}} shouldShow={selectedClass === 'Kanna'}/>
            </Row>
            {/* <Row>
              <HideableStatColumn label={'STR AP'} stat={stats.STR.total} type={'number'} setStatValue={s => {setStats({...stats, STR: {...stats.STR, ap: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('STR')}/>
              <HideableStatColumn label={'DEX AP'} stat={stats.DEX.total} type={'number'} setStatValue={s => {setStats({...stats, DEX: {...stats.DEX, ap: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('DEX')}/>
              <HideableStatColumn label={'LUK AP'} stat={stats.LUK.total} type={'number'} setStatValue={s => {setStats({...stats, LUK: {...stats.LUK, ap: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('LUK')}/>
              <HideableStatColumn label={'INT AP'} stat={stats.INT.total} type={'number'} setStatValue={s => {setStats({...stats, INT: {...stats.INT, ap: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('INT')}/>
            </Row> */}
            <Row>
              <HideableStatColumn label={'STR% on equips'} stat={stats.STR.percent} type={'number'} setStatValue={s => {setStats({...stats, STR: {...stats.STR, percent: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('STR')}/>
              <HideableStatColumn label={'DEX% on equips'} stat={stats.DEX.percent} type={'number'} setStatValue={s => {setStats({...stats, DEX: {...stats.DEX, percent: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('DEX')}/>
              <HideableStatColumn label={'LUK% on equips'} stat={stats.LUK.percent} type={'number'} setStatValue={s => {setStats({...stats, LUK: {...stats.LUK, percent: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('LUK')}/>
              <HideableStatColumn label={'INT% on equips'} stat={stats.INT.percent} type={'number'} setStatValue={s => {setStats({...stats, INT: {...stats.INT, percent: Number(s)}})}} shouldShow={classInfo.primary.concat(classInfo.secondary).includes('INT')}/>
              <Col><StatBox label={'All stat% on equips'} stat={stats.percentAllStat} type={'number'} setStatValue={s => {setStats({...stats, percentAllStat: Number(s)})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox label={'Damage %'} stat={stats.dmgPercent} type={'number'} setStatValue={s => {setStats({...stats, dmgPercent: Number(s)})}}/></Col>
              <Col><StatBox label={'Final Damage'} stat={stats.finalDmg} type={'number'} setStatValue={s => {setStats({...stats, finalDmg: Number(s)})}}/></Col>
            </Row>
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
              {/* <Col><input id="weaponLevel" type="checkbox" checked={stats.weapon.highLevel} onChange={_s => {setStats({...stats, weapon: {highLevel: !stats.weapon.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> <label for="weaponLevel">Lvl 150+</label></Col> */}
              {/* <Col><input id="secondaryLevel" type="checkbox" checked={stats.secondary.highLevel} onChange={_s => {setStats({...stats, secondary: {highLevel: !stats.secondary.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> <label for="secondaryLevel">Lvl 150+</label></Col>
              <Col><input id="emblemLevel" type="checkbox" checked={stats.emblem.highLevel} onChange={_s => {setStats({...stats, emblem: {highLevel: !stats.emblem.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/> <label for="emblemLevel">Lvl 150+</label></Col> */}
              <Col><Form.Check inline type='checkbox' label='Lvl 150+' checked={stats.weapon.highLevel} onChange={_s => {setStats({...stats, weapon: {highLevel: !stats.weapon.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/></Col>
              <Col><Form.Check inline type='checkbox' label='Lvl 150+' checked={stats.secondary.highLevel} onChange={_s => {setStats({...stats, secondary: {highLevel: !stats.secondary.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/></Col>
              <Col><Form.Check inline type='checkbox' label='Lvl 150+' checked={stats.emblem.highLevel} onChange={_s => {setStats({...stats, emblem: {highLevel: !stats.secondary.highLevel, primaryLine: 'N/A', secondaryLine: 'N/A', tertiaryLine: 'N/A'}})}}/></Col>
            </Row>
            <Row>
              <Col><DropdownSelector label='Primary line' optionsList={FormulaUtils.getPrimaryPotentialOptions(stats.weapon.highLevel)} selected={stats.weapon.primaryLine} setSelected={s => {setStats({...stats, weapon: {...stats.weapon, primaryLine: s}})}}/></Col>
              <Col><DropdownSelector label='Primary line' optionsList={FormulaUtils.getPrimaryPotentialOptions(stats.secondary.highLevel)} selected={stats.secondary.primaryLine} setSelected={s => {setStats({...stats, secondary: {...stats.secondary, primaryLine: s}})}}/></Col>
              <Col><DropdownSelector label='Primary line' optionsList={FormulaUtils.getPrimaryPotentialOptions(stats.emblem.highLevel)} selected={stats.emblem.primaryLine} setSelected={s => {setStats({...stats, emblem: {...stats.emblem, primaryLine: s}})}}/></Col>
            </Row>
            <Row>
              <Col><DropdownSelector label={'Secondary line'} optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.weapon.highLevel)} selected={stats.weapon.secondaryLine} setSelected={s => {setStats({...stats, weapon: {...stats.weapon, secondaryLine: s}})}}/></Col>
              <Col><DropdownSelector label={'Secondary line'} optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.secondary.highLevel)} selected={stats.secondary.secondaryLine} setSelected={s => {setStats({...stats, secondary: {...stats.secondary, secondaryLine: s}})}}/></Col>
              <Col><DropdownSelector label={'Secondary line'} optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.emblem.highLevel)} selected={stats.emblem.secondaryLine} setSelected={s => {setStats({...stats, emblem: {...stats.emblem, secondaryLine: s}})}}/></Col>
            </Row>
            <Row>
              <Col><DropdownSelector label={'Tertiary line'} optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.weapon.highLevel)} selected={stats.weapon.tertiaryLine} setSelected={s => {setStats({...stats, weapon: {...stats.weapon, tertiaryLine: s}})}}/></Col>
              <Col><DropdownSelector label={'Tertiary line'} optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.secondary.highLevel)} selected={stats.secondary.tertiaryLine} setSelected={s => {setStats({...stats, secondary: {...stats.secondary, tertiaryLine: s}})}}/></Col>
              <Col><DropdownSelector label={'Tertiary line'} optionsList={FormulaUtils.getSecondaryPotentialOptions(stats.emblem.highLevel)} selected={stats.emblem.tertiaryLine} setSelected={s => {setStats({...stats, emblem: {...stats.emblem, tertiaryLine: s}})}}/></Col>
            </Row>
            <Row><Col><h4><u>Bonus Potentials</u></h4></Col></Row>
            <Row>
              <Col><StatBox label={'Total Attack %'} stat={stats.bonusPotentialAtt} type={'number'} setStatValue={s => {setStats({...stats, bonusPotentialAtt: Number(s)})}}/></Col>
            </Row>
            <Row><Col><h4><u>Hyper Stats</u></h4></Col></Row>
            <HyperStatDropdownSelector label={'STR'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.STR} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, STR: s}})}}/>
            <HyperStatDropdownSelector label={'DEX'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.DEX} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, DEX: s}})}}/>
            <HyperStatDropdownSelector label={'LUK'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.LUK} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, LUK: s}})}}/>
            <HyperStatDropdownSelector label={'INT'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.INT} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, INT: s}})}}/>
            <HyperStatDropdownSelector label={'HP'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.hp} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, hp: s}})}}/>
            <HyperStatDropdownSelector label={'MP'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.mp} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, mp: s}})}}/>
            <HyperStatDropdownSelector label={'DF/TF/Mana'} optionsList={Array.from({length: 11}, (_v, i) => i)} selected={stats.hyper.dftfmana} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, dftfmana: s}})}}/>
            <HyperStatDropdownSelector label={'Critical Rate'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.critRate} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, critRate: s}})}}/>
            <HyperStatDropdownSelector label={'Critical Damage'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.critDmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, critDmg: s}})}}/>
            <HyperStatDropdownSelector label={'IED'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.ied} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, ied: s}})}}/>
            <HyperStatDropdownSelector label={'Damage'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.dmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, dmg: s}})}}/>
            <HyperStatDropdownSelector label={'Boss Damage'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.bossDmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, bossDmg: s}})}}/>
            <HyperStatDropdownSelector label={'Status Resistance'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.statusResistance} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, statusResistance: s}})}}/>
            <HyperStatDropdownSelector label={'Knockback Resistance'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.knockbackResistance} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, knockbackResistance: s}})}}/>
            <HyperStatDropdownSelector label={'Weapon and Magic ATT'} optionsList={Array.from({length: 16}, (_v, i) => i)} selected={stats.hyper.jobAtt} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, jobAtt: s}})}}/>
            <Row><Col><h4><u>Souls</u></h4></Col></Row>
            <Row>
              <Col><input id="magnificentSoul" type="checkbox" checked={stats.magnificentSoul} onChange={_s => {setStats({...stats, magnificentSoul: !stats.magnificentSoul})}}/> <label for="magnificentSoul">Magnificent (ATT +3%)</label></Col>
            </Row>
            <Row><Col><h4><u>Familiars</u></h4></Col></Row>
            <Row><Col><h5>Badge Effect</h5></Col><Col><h5>Potentials</h5></Col></Row>
            <Row>
              <Col><StatBox label={'Total Attack %'} stat={stats.familiar.badgeAttPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiar: {...stats.familiar, badgeAttPercentSum: Number(s)}})}}/></Col>
              <Col><StatBox label={'Total Attack %'} stat={stats.familiar.potentialAttPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiar: {...stats.familiar, potentialAttPercentSum: Number(s)}})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox label={'Primary Stat'} stat={stats.familiar.badgePrimarySum} type={'number'} setStatValue={s => {setStats({...stats, familiar: {...stats.familiar, badgePrimarySum: Number(s)}})}}/></Col>
              <Col><StatBox label={'Primary Stat'} stat={stats.familiar.potentialPrimarySum} type={'number'} setStatValue={s => {setStats({...stats, familiar: {...stats.familiar, potentialPrimarySum: Number(s)}})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox label={'All Stat'} stat={stats.familiar.badgeAllStatSum} type={'number'} setStatValue={s => {setStats({...stats, familiar: {...stats.familiar, badgeAllStatSum: Number(s)}})}}/></Col>
              <Col><StatBox label={'All Stat'} stat={stats.familiar.potentialAllStatSum} type={'number'} setStatValue={s => {setStats({...stats, familiar: {...stats.familiar, potentialAllStatSum: Number(s)}})}}/></Col>
            </Row>
            <br/>
            <Button variant="primary" type="submit">Submit</Button>
          </Container>
        </Form>
      </div>
    </>
  );
}

export default App;
