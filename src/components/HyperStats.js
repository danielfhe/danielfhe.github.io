import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/esm/Row';
import { HyperStatDropdownSelector } from './DropdownSelector';

export default function HyperStats({ stats, setStats }) {
  function getOptionsList(length) {
    return Array.from({length: length}, (_v, i) => i);
  }

  return(
    <>
      <Row><Col><h4><u>Hyper Stats</u></h4></Col></Row>
      <HyperStatDropdownSelector label={'STR'} optionsList={getOptionsList(16)} selected={stats.hyper.STR} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, STR: s}})}}/>
      <HyperStatDropdownSelector label={'DEX'} optionsList={getOptionsList(16)} selected={stats.hyper.DEX} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, DEX: s}})}}/>
      <HyperStatDropdownSelector label={'LUK'} optionsList={getOptionsList(16)} selected={stats.hyper.LUK} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, LUK: s}})}}/>
      <HyperStatDropdownSelector label={'INT'} optionsList={getOptionsList(16)} selected={stats.hyper.INT} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, INT: s}})}}/>
      <HyperStatDropdownSelector label={'HP'} optionsList={getOptionsList(16)} selected={stats.hyper.HP} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, HP: s}})}}/>
      <HyperStatDropdownSelector label={'MP'} optionsList={getOptionsList(16)} selected={stats.hyper.MP} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, MP: s}})}}/>
      <HyperStatDropdownSelector label={'DF/TF/Mana'} optionsList={getOptionsList(11)} selected={stats.hyper.dftfmana} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, dftfmana: s}})}}/>
      <HyperStatDropdownSelector label={'Critical Rate'} optionsList={getOptionsList(16)} selected={stats.hyper.critRate} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, critRate: s}})}}/>
      <HyperStatDropdownSelector label={'Critical Damage'} optionsList={getOptionsList(16)} selected={stats.hyper.critDmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, critDmg: s}})}}/>
      <HyperStatDropdownSelector label={'IED'} optionsList={getOptionsList(16)} selected={stats.hyper.ied} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, ied: s}})}}/>
      <HyperStatDropdownSelector label={'Damage'} optionsList={getOptionsList(16)} selected={stats.hyper.dmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, dmg: s}})}}/>
      <HyperStatDropdownSelector label={'Boss Damage'} optionsList={getOptionsList(16)} selected={stats.hyper.bossDmg} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, bossDmg: s}})}}/>
      <HyperStatDropdownSelector label={'Status Resistance'} optionsList={getOptionsList(16)} selected={stats.hyper.statusResistance} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, statusResistance: s}})}}/>
      <HyperStatDropdownSelector label={'Knockback Resistance'} optionsList={getOptionsList(16)} selected={stats.hyper.knockbackResistance} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, knockbackResistance: s}})}}/>
      <HyperStatDropdownSelector label={'Weapon and Magic ATT'} optionsList={getOptionsList(16)} selected={stats.hyper.jobAtt} setSelected={s => {setStats({...stats, hyper: {...stats.hyper, jobAtt: s}})}}/>
    </>
  );
};
