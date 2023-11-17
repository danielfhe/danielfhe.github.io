import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { BsInfoCircle } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip'

export default function StatBox({ label, stat, type, setStatValue }) {
  function onStatChange(e) {
    setStatValue(e.target.value);
  }

  return (
    <Form.Group>
      <Form.Label><LabelWithTooltip label={label}/></Form.Label>
      <Form.Control type={type} min="0" defaultValue={stat} onChange={onStatChange}/>
    </Form.Group>
  );
}

export function HideableStatColumn({ label, stat, type, setStatValue, shouldShow }) {
  return (
    shouldShow && 
      <Col md={3}>
        <StatBox label={label} stat={stat} type={type} setStatValue={setStatValue}/>
      </Col>
  );
}

function LabelWithTooltip({ label }) {
  return (
    <>
      {label}&nbsp;
      {
        Object.keys(tooltips).includes(label) &&
          <>
            <Tooltip anchorSelect={'.' + tooltips[label].anchor}>{tooltips[label].text}</Tooltip>
            <span className={tooltips[label].anchor}>
              <BsInfoCircle/>
            </span>
          </>
      }
    </>
  );
}

const tooltips = {
  'Upper Damage Range': {
    'text': 'Used to calculate total job ATT',
    'anchor': 'tooltip-anchor-upper-damage-range'
  },
  // 'HP': {
  //   'text': 'something for HP',
  //   'anchor': 'tooltip-anchor-hp'
  // }
}