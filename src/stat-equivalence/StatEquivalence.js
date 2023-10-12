import '../App.css';
import HeadingBar from '../components/HeadingBar.js';
import StatBox, { HideableStatColumn } from '../components/StatBox.js';
import DropdownSelector from '../components/DropdownSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useEffect, useMemo, useState } from 'react';
import ClassUtils from '../utilities/ClassUtils';
import FormulaUtils from '../utilities/FormulaUtils';
import HyperStats from '../components/HyperStats';
import Nav from 'react-bootstrap/Nav';

const { createWorker } = require('tesseract.js');

function StatEquivalence() {
  const [slot, setSlot] = useState(() => {
    let current = localStorage.getItem('slot');
    
    return current ? JSON.parse(current) : 'character-slot-1';
  });
  const [selectedClass, setSelectedClass] = useState(() => {
    let selected = localStorage.getItem(`${slot}.selectedClass`);

    return selected ? JSON.parse(selected) : 'Adele';
  });
  const [weapon, setWeapon] = useState(() => {
    let weapon = localStorage.getItem(`${slot}.weapon`);
    
    return weapon ? JSON.parse(weapon) : 'Bladecaster';
  });
  const [stats, setStats] = useState(() => {
    let stats = localStorage.getItem(`${slot}.stats`);
    
    return stats ? JSON.parse(stats) : ClassUtils.getInitialStats();
  });
  const [statEquivalence, setStatEquivalence] = useState({
    attackEquivalence: null,
    secondaryEquivalences: null,
    percentAllEquivalence: null
  });
  const [statImage, setStatImage] = useState();

  const classInfo = useMemo(() => ClassUtils.getClassInfo(selectedClass), [selectedClass]);

  useEffect(() => {
    localStorage.setItem(`${slot}.selectedClass`, JSON.stringify(selectedClass));
  }, [selectedClass]);
  useEffect(() => {
    localStorage.setItem(`${slot}.weapon`, JSON.stringify(weapon));
  }, [weapon]);
  useEffect(() => {
    localStorage.setItem(`${slot}.stats`, JSON.stringify(stats));
  }, [stats]);
  useEffect(() => {
    localStorage.setItem('slot', JSON.stringify(slot));

    setSelectedClass(localStorage.getItem(`${slot}.selectedClass`) ? JSON.parse(localStorage.getItem(`${slot}.selectedClass`)) : 'Adele');
    setWeapon(localStorage.getItem(`${slot}.weapon`) ? JSON.parse(localStorage.getItem(`${slot}.weapon`)) : 'Bladecaster');
    setStats({...(localStorage.getItem(`${slot}.stats`) ? JSON.parse(localStorage.getItem(`${slot}.stats`)) : ClassUtils.getInitialStats())});
  }, [slot]);

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
    calculated.hyperStatPrimaries = classInfo.primary.map(statName => stats.hyper[statName]);
    calculated.hyperStatSecondaries = classInfo.secondary.map(statName => stats.hyper[statName]);

    calculated.attackPercent = 100.0 + (stats.magnificentSoul ? 3 : 0) + stats.familiars.badgeAttPercentSum + 
      stats.familiars.potentialAttPercentSum + stats.bonusPotentialAtt + classInfo.attPercent + FormulaUtils.getWeaponSecondaryEmblemAttack(stats);
    // 100 + soul + familiar badges + familiar potential + bonus potential att % (non-reboot) + class att % + attack from WSE
    calculated.statValue = FormulaUtils.getStatValue(selectedClass, calculated.primaryStats, calculated.secondaryStats);
    calculated.totalJobAttack = FormulaUtils.getTotalJobAttack(stats.upperShownDmgRange, weaponMultiplier, calculated.statValue, stats.dmgPercent, stats.finalDmg)
    calculated.attack = Math.floor(calculated.totalJobAttack / (calculated.attackPercent / 100));

    calculated.finalStatPrimary = (30 * calculated.hyperStatPrimaries[0]) + stats.symbolStats + stats.legion.primary;
    calculated.finalStatSecondaries = calculated.hyperStatSecondaries.map(h => (30 * h) + stats.legion.secondary);
    calculated.primaryBaseTotalStat = (calculated.primaryStats[0] - calculated.finalStatPrimary) / (1.0 + (calculated.primaryStatPercents[0] / 100.0));
    calculated.secondaryBaseTotalStats = calculated.secondaryStats.map((s, i) => (s - calculated.finalStatSecondaries[i]) / (1.0 + (calculated.secondaryStatPercents[i] / 100.0)));

    calculated.primaryRatio = (calculated.primaryBaseTotalStat + 1) * (1 + calculated.primaryStatPercents[0]/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.percentRatio = (calculated.primaryBaseTotalStat) * (1 + (calculated.primaryStatPercents[0] + 1)/ 100.0) + calculated.finalStatPrimary - calculated.primaryStats[0]
    calculated.attackRatio = (calculated.primaryStats[0] + calculated.secondaryStats.reduce((a, b) => a + b, 0) / 4.0) / calculated.attack
    calculated.secondaryRatios = calculated.secondaryBaseTotalStats.map((s, i) => 
      (s + 1) * (1 + calculated.secondaryStatPercents[i]/ 100.0) + calculated.finalStatSecondaries[i] - calculated.secondaryStats[i]
    );

    setStatEquivalence({
      percentAllEquivalence: calculated.percentRatio / calculated.primaryRatio,
      attackEquivalence: calculated.attackRatio / calculated.primaryRatio,
      secondaryEquivalences: calculated.secondaryRatios.map(s => calculated.primaryRatio / (s / 4.0)),
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
    setStats(ClassUtils.getInitialStats);
    setStatImage(null);
  }

  async function handleStatWindowImageChange(e) {
    console.log(e.target.files);
    setStatImage(URL.createObjectURL(e.target.files[0]));

    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(statImage);
    console.log(text);
    await worker.terminate();
}

  return (
    <>
      <HeadingBar/>
      <div className="App-Body">
        <Navbar>
          <Container>
            Slots:
            <Nav variant="pills" className="me-auto" onSelect={setSlot} defaultActiveKey={slot}>
              <Nav.Item>
                <Nav.Link eventKey="character-slot-1">1</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="character-slot-2">2</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="character-slot-3">3</Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>
        { statEquivalence.attackEquivalence != null ? 
          <Container className="rounded bg-light p-3 text-center">
            <Row><Col><h4><u>Stat Equivalence</u></h4></Col></Row>
            {
              classInfo.primary.map(pri =>
                <>
                <Row><Col><label>1% All Stat &lt;=&gt;</label> {statEquivalence.percentAllEquivalence.toFixed(2)} {pri}</Col></Row>
                <Row><Col><label>1 Attack &lt;=&gt;</label> {statEquivalence.attackEquivalence.toFixed(2)} {pri}</Col></Row>
                {statEquivalence.secondaryEquivalences.map((sec, i) => 
                  <Row key={`${pri}-${sec}`}><Col><label>{sec.toFixed(2)} {classInfo.secondary[i]} &lt;=&gt;</label> 1 {pri}</Col></Row>
                )}
                </>
              )
            }
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
            <HyperStats stats={stats} setStats={setStats}/>
            <Row><Col><h4><u>Soul Weapon</u></h4></Col></Row>
            <Row>
              <Col><input id="magnificentSoul" type="checkbox" checked={stats.magnificentSoul} onChange={_s => {setStats({...stats, magnificentSoul: !stats.magnificentSoul})}}/> <label for="magnificentSoul">Magnificent (ATT +3%)</label></Col>
            </Row>
            <Row><Col><h4><u>Familiars</u></h4></Col></Row>
            <Row><Col><h5>Badge Effect</h5></Col><Col><h5>Potentials</h5></Col></Row>
            <Row>
              <Col><StatBox label={'Attack %'} stat={stats.familiars.badgeAttPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiars: {...stats.familiars, badgeAttPercentSum: Number(s)}})}}/></Col>
              <Col><StatBox label={'Attack %'} stat={stats.familiars.potentialAttPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiars: {...stats.familiars, potentialAttPercentSum: Number(s)}})}}/></Col>
            </Row>
            <Row>
              <Col><StatBox label={'All Stat %'} stat={stats.familiars.badgeAllStatPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiars: {...stats.familiars, badgeAllStatPercentSum: Number(s)}})}}/></Col>
              <Col><StatBox label={'All Stat %'} stat={stats.familiars.potentialAllStatPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiars: {...stats.familiars, potentialAllStatPercentSum: Number(s)}})}}/></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col><StatBox label={'Primary Stat %'} stat={stats.familiars.potentialPrimaryPercentSum} type={'number'} setStatValue={s => {setStats({...stats, familiars: {...stats.familiars, potentialPrimaryPercentSum: Number(s)}})}}/></Col>
            </Row>
            <br/>
            {/* <Row className="mb-3">
              <h4>Add Stat Window Image:</h4>
              <input type="file" onChange={handleStatWindowImageChange} />
              <img src={statImage} alt='' />
            </Row> */}
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

export default StatEquivalence;
