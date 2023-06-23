import Col from 'react-bootstrap/Col';

export default function StatBox({ statName, stat, type, setStatValue }) {
    function onStatChange(e) {
        setStatValue(e.target.value);
    }

    return (
        <label>{statName}
            <input className="Stat-Box" type={type} min="0" defaultValue={stat} onChange={onStatChange}/>
        </label>
    );
}

export function HideableStatColumn({ statName, stat, type, setStatValue, classInfo }) {
    return (
        classInfo.primary.concat(classInfo.secondary).includes(statName) && 
            <Col>
                <StatBox statName={statName} stat={stat} type={type} setStatValue={setStatValue}/>
            </Col>
    );
}