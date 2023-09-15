import Col from 'react-bootstrap/Col';

export default function StatBox({ label, stat, type, setStatValue }) {
    function onStatChange(e) {
        setStatValue(e.target.value);
    }

    return (
        <label>{label}
            <input className="Stat-Box" type={type} min="0" defaultValue={stat} onChange={onStatChange}/>
        </label>
    );
}

export function HideableStatColumn({ label, stat, type, setStatValue, shouldShow }) {
    return (
        shouldShow && 
            <Col>
                <StatBox label={label} stat={stat} type={type} setStatValue={setStatValue}/>
            </Col>
    );
}