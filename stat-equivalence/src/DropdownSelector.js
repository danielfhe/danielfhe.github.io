import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/esm/Row';

export default function DropdownSelector({ label, optionsList, selected, setSelected }) {
    function onDropdownSelected(e) {
        setSelected(e.target.value);
    }

    let options = optionsList.map(o => <option key={o} value={o}>{o}</option> );

    return(
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Select value={selected} onChange={onDropdownSelected}>
                {options}
            </Form.Select>
        </Form.Group>
    );
};

export function HyperStatDropdownSelector({ label, optionsList, selected, setSelected }) {
    function onDropdownSelected(e) {
        setSelected(e.target.value);
    }

    let options = optionsList.map(o => <option key={o} value={o}>{o}</option> );

    return(
        <Form.Group as={Row}>
            <Form.Label column md={3}>{label}</Form.Label>
            <Col md={1}>
                <Form.Select value={selected} onChange={onDropdownSelected}>
                    {options}
                </Form.Select>
            </Col>
        </Form.Group>
    );
};
