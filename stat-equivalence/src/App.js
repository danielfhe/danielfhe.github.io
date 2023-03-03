import './App.css';
import HeadingBar from './HeadingBar.js';
import StatBox from './StatBox.js';
import ClassSelector from './ClassSelector.js';

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
      <HeadingBar/>
      <ClassSelector classes={classes} selectedClass={selectedClass}/>
      <StatBox statDescription={'HP'} stat={''}/>
      <StatBox statDescription={'MP'} stat={''}/>
      <StatBox statDescription={'STR'} stat={stats.str}/>
      <StatBox statDescription={'DEX'} stat={stats.dex}/>
      <StatBox statDescription={'LUK'} stat={stats.luk}/>
      <StatBox statDescription={'INT'} stat={stats.int}/>
      <StatBox statDescription={'Damage %'} stat={''}/>
      <StatBox statDescription={'Final Damage'} stat={''}/>
      <StatBox statDescription={'Ignore Enemy Defense'} stat={''}/>
      <StatBox statDescription={'Critical Rate'} stat={''}/>
      <StatBox statDescription={'Critical Damage'} stat={''}/>
      <StatBox statDescription={'Boss Damage'} stat={''}/>
      <StatBox statDescription={'Buff Duration'} stat={''}/>
      <StatBox statDescription={'Item Drop Rate'} stat={''}/>
      <StatBox statDescription={'Mesos Obtained'} stat={''}/>
      <StatBox statDescription={'Status Resistance'} stat={''}/>
      <StatBox statDescription={'Defense'} stat={''}/>
      <StatBox statDescription={'Speed'} stat={''}/>
      <StatBox statDescription={'Jump'} stat={''}/>
      <StatBox statDescription={'Knockback Resistance'} stat={''}/>
      <StatBox statDescription={'Star Force'} stat={''}/>
      <StatBox statDescription={'Arcane Power'} stat={''}/>
    </div>
  );
}

export default App;
