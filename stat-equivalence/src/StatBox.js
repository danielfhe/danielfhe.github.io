import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default function StatBox({ label, stat, type, setStatValue }) {
    function onStatChange(e) {
        setStatValue(e.target.value);
    }

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control type={type} min="0" defaultValue={stat} onChange={onStatChange}/>
        </Form.Group>
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