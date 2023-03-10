import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox from './StatBox.js';
import ClassSelector from './ClassSelector.js';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function App() {
  let classes = [
    'Adele',
    'Angelic Buster',
    'Aran',
    'Ark',
    'Battle Mage',
    'Bishop',
    'Blaster',
    'Blaze Wizard',
    'Beast Tamer',
    'Bowmaster',
    'Buccaneer',
    'Cadena',
    'Cannoneer',
    'Corsair',
    'Dark Knight',
    'Dawn Warrior',
    'Demon Slayer',
    'Dual Blade',
    'Evan',
    'Fire Poison',
    'Hayato',
    'Hero',
    'Hoyoung',
    'Ice Lightning',
    'Illium',
    'Jett',
    'Kain',
    'Kaiser',
    'Kanna',
    'Kinesis',
    'Lara',
    'Luminous',
    'Marksmen',
    'Mechanic',
    'Mercedes',
    'Mihile',
    'Night Lord',
    'Night Walker',
    'Paladin',
    'Pathfinder',
    'Phantom',
    'Shade',
    'Shadower',
    'Thunder Breaker',
    'Wild Hunter',
    'Wind Archer',
    'Xenon',
    'Zero'
  ];
  let selectedClass = '';
  let stats = {
    str: 123,
    dex: 4,
    luk: 4,
    int: 4
  };

  return (
    <div className="App">
      <Container><HeadingBar/></Container>
      <div className="App-Body">
        <Container>
          <Row>
            <Col><label>Class</label><ClassSelector classes={classes} selectedClass={selectedClass}/></Col>
            <Col><StatBox statDescription={'Level'} stat={''}/></Col>
            <Col><StatBox statDescription={'HP'} stat={''}/></Col>
            <Col><StatBox statDescription={'MP'} stat={''}/></Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col><StatBox statDescription={'STR'} stat={stats.str}/></Col>
            <Col><StatBox statDescription={'DEX'} stat={stats.dex}/></Col>
            <Col><StatBox statDescription={'LUK'} stat={stats.luk}/></Col>
            <Col><StatBox statDescription={'INT'} stat={stats.int}/></Col>
          </Row>
        </Container>
        <br/>
        <Container>
          <Row>
            <StatBox statDescription={'Damage %'} stat={''}/>
            <StatBox statDescription={'Final Damage'} stat={''}/>
            <StatBox statDescription={'Ignore Enemy Defense'} stat={''}/>
            <StatBox statDescription={'Critical Rate'} stat={''}/>
            <StatBox statDescription={'Critical Damage'} stat={''}/>
            <StatBox statDescription={'Boss Damage'} stat={''}/>
            <StatBox statDescription={'Buff Duration'} stat={''}/>
          </Row>
          <Row>
            <StatBox statDescription={'Item Drop Rate'} stat={''}/>
            <StatBox statDescription={'Mesos Obtained'} stat={''}/>
            <StatBox statDescription={'Status Resistance'} stat={''}/>
            <StatBox statDescription={'Defense'} stat={''}/>
            <StatBox statDescription={'Speed'} stat={''}/>
            <StatBox statDescription={'Jump'} stat={''}/>
            <StatBox statDescription={'Knockback Resistance'} stat={''}/>
            <StatBox statDescription={'Star Force'} stat={''}/>
            <StatBox statDescription={'Arcane Power'} stat={''}/>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
