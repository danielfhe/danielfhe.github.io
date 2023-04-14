import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox from './StatBox.js';
import ClassSelector from './ClassSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';
import ClassUtils from './ClassUtils';

function App() {
  const [selectedClass, setSelectedClass] = useState('');
  const [stats, setStats] = useState({
    level: 0,
    hp: 0,
    mp: 0,
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
    arcanePower: 0
  });

  useEffect(() => {
    console.log(stats);
  })

  return (
    <>
      <Container><HeadingBar/></Container>
      <div className="App-Body">
        <Container>
          <Row>
            <Col><label>Class</label><ClassSelector classes={ClassUtils.getClassNames()} setSelectedClass={setSelectedClass}/></Col>
            <Col><StatBox statName={'Level'} stat={stats.level} type={'number'} setStatValue={s => {setStats({...stats, level: Number(s)})}}/></Col>
            <Col><StatBox statName={'HP'} stat={stats.hp} type={'number'} setStatValue={s => {setStats({...stats, hp: Number(s)})}}/></Col>
            <Col><StatBox statName={'MP'} stat={stats.mp} type={'number'} setStatValue={s => {setStats({...stats, mp: Number(s)})}}/></Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col><StatBox statName={'STR'} stat={stats.str} type={'number'} setStatValue={s => {setStats({...stats, str: Number(s)})}}/></Col>
            <Col><StatBox statName={'DEX'} stat={stats.dex} type={'number'} setStatValue={s => {setStats({...stats, dex: Number(s)})}}/></Col>
            <Col><StatBox statName={'LUK'} stat={stats.luk} type={'number'} setStatValue={s => {setStats({...stats, luk: Number(s)})}}/></Col>
            <Col><StatBox statName={'INT'} stat={stats.int} type={'number'} setStatValue={s => {setStats({...stats, int: Number(s)})}}/></Col>
          </Row>
        </Container>
        <br/>
        <Container>
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
        </Container>
      </div>
    </>
  );
}

export default App;
