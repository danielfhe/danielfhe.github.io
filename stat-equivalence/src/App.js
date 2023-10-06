import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox, { HideableStatColumn } from './StatBox.js';
import DropdownSelector, { HyperStatDropdownSelector } from './DropdownSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useEffect, useMemo, useState } from 'react';
import ClassUtils from './ClassUtils';
import FormulaUtils from './FormulaUtils';

const { createWorker } = require('tesseract.js');

function App() {
  const [selectedClass, setSelectedClass] = useState(() => {
    let selected = localStorage.getItem('selectedClass');

    return selected ? JSON.parse(selected) : 'Adele';
  });
  const [weapon, setWeapon] = useState(() => {
    let weapon = localStorage.getItem('weapon');
    
    return weapon ? JSON.parse(weapon) : 'Bladecaster';
  });
  const [stats, setStats] = useState(() => {
    let stats = localStorage.getItem('stats');
    
    return stats ? JSON.parse(stats) : ClassUtils.getInitialStats();
  });
  const [statEquivalence, setStatEquivalence] = useState({
    attackEquivalence: null,
    secondaryEquivalence: null,
    percentAllEquivalence: null
  });
  const [statImage, setStatImage] = useState();

  const classInfo = useMemo(() => ClassUtils.getClassInfo(selectedClass), [selectedClass]);

  useEffect(() => {
    localStorage.setItem('selectedClass', JSON.stringify(selectedClass));
  }, [selectedClass]);
  useEffect(() => {
    localStorage.setItem('weapon', JSON.stringify(weapon));
  }, [weapon]);
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const weaponMultiplier = ClassUtils.getWeaponMultiplier(weapon, selectedClass);
    let calculated = {};

    calculated.primaryStats = classInfo.primary.map(statName => stats[statName].total);
    calculated.secondaryStats = classInfo.secondary.map(statName => stats[statName].total);
    // calculated.primaryStatAPs = classInfo.primary.map(statName => stats[statName].ap);
    // calculated.secondaryStatAPs = classInfo.secondary.map(statName => stats[statName].ap);
    calculated.primaryStatPercents = classInfo.primary.map(statName => stats[statName].percent + stats.percentAllStat);
    calculated.secondaryStatPercents = classInfo.secondary.map(statName => stats[statName].percent + stats.percentAllStat);
    calculated.hyperPrimaryStats = classInfo.primary.map(statName => stats.hyper[statName]);
    calculated.hyperSecondaryStats = classInfo.primary.map(statName => stats.hyper[statName]);

    calculated.attackPercent = 100.0 + (stats.magnificentSoul ? 3 : 0) + stats.familiar.badgeAttPercentSum + 
      stats.familiar.potentialAttPercentSum + stats.bonusPotentialAtt + classInfo.attPercent + FormulaUtils.getWeaponSecondaryEmblemAttack(stats);
    // 100 + soul + familiar badges + familiar potential + bonus potential att % (non-reboot) + class att % + attack from WSE
    calculated.statValue = FormulaUtils.getStatValue(selectedClass, calculated.primaryStats, calculated.secondaryStats);
    calculated.totalJobAttack = FormulaUtils.getTotalJobAttack(stats.upperShownDmgRange, weaponMultiplier, calculated.statValue, stats.dmgPercent, stats.finalDmg)
    calculated.attack = Math.floor(calculated.totalJobAttack / (calculated.attackPercent / 100));

    calculated.finalStatPrimary = (30 * calculated.hyperPrimaryStats[0]) + stats.symbolStats + stats.legion.primary;
    calculated.finalStatSecondary = (30 * calculated.hyperSecondaryStats[0]) + stats.legion.secondary;
    calculated.primaryBaseTotalStat = (calculated.primaryStats[0] - calculated.finalStatPrimary) / (1.0 + (calculated.primaryStatPercents[0] / 100.0));
    calculated.secondaryBaseTotalStat = (calculated.secondaryStats[0] - calculated.finalStatSecondary) / (1.0 + (calculated.secondaryStatPercents[0] / 100.0));

    calculated.primaryRatio = (calculated.primaryBaseTotalStat + 1) * (1 + calculated.primaryStatPercents[0]/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.percentRatio = (calculated.primaryBaseTotalStat) * (1 + (calculated.primaryStatPercents[0] + 1)/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.attackRatio = (calculated.primaryStats[0] + calculated.secondaryStats[0] / 4) / calculated.attack
    calculated.secondaryRatio = (calculated.secondaryBaseTotalStat + 1) * (1 + calculated.secondaryStatPercents[0]/ 100.0) + calculated.finalStatSecondary - calculated.secondaryStats[0]

    setStatEquivalence({
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

    window.scrollTo(0, 0);
  }

  const handleReset = (_event) => {
    setStats(ClassUtils.getInitialStats());
    setStatImage(null);
  }

  async function handleStatWindowImageChange(e) {
    console.log(e.target.files);
    setStatImage(URL.createObjectURL(e.target.files[0]));

    const worker = await createWorker('eng');
    // await worker.setParameters({
    //   tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    // });
    const { data: { text } } = await worker.recognize(statImage);
    console.log(text);
    await worker.terminate();
}

  return (
    <>
      <HeadingBar/>
      <div className="App-Body">
        { statEquivalence.attackEquivalence != null ? 
          <Container className="rounded bg-light p-3 text-center">
            <Row><Col><h4><u>Stat Equivalence</u></h4></Col></Row>
            <Row><Col><label>1% All Stat &lt;=&gt;</label> {statEquivalence.percentAllEquivalence.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Attack &lt;=&gt;</label> {statEquivalence.attackEquivalence.toFixed(2)} primary stat</Col></Row>
            <Row><Col><label>1 Secondary Stat &lt;=&gt;</label> {statEquivalence.secondaryEquivalence.toFixed(2)} primary stat</Col></Row>
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
              <Col md={3}><StatBox label={'Damage %'} stat={stats.dmgPercent} type={'number'} setStatValue={s => {setStats({...stats, dmgPercent: Number(s)})}}/></Col>
              <Col md={3}><StatBox label={'Final Damage %'} stat={stats.finalDmg} type={'number'} setStatValue={s => {setStats({...stats, finalDmg: Number(s)})}}/></Col>
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
              <Col md={2}><StatBox label={'Total Attack %'} stat={stats.bonusPotentialAtt} type={'number'} setStatValue={s => {setStats({...stats, bonusPotentialAtt: Number(s)})}}/></Col>
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
            <Row className="mb-3">
              <h4>Add Stat Window Image:</h4>
              <input type="file" onChange={handleStatWindowImageChange} />
              <img src={statImage} alt='' />
            </Row>
          </Container>
        </Form>
      </div>
      <Navbar fixed="bottom" style={{ backgroundColor: 'gray', position: 'sticky', bottom: 0 }}>
        <Container>
          <Row>
            <Col><Button variant="primary" type="submit" onClick={handleSubmit}>Calculate</Button></Col>
            <Col><Button variant="danger" type="reset" onClick={handleReset}>Clear</Button></Col>
          </Row>
        </Container>
      </Navbar>
    </>
  );
}

export default App;
