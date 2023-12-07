import { Button, Card } from 'react-bootstrap';
import './App.css';
import HeadingBar from './components/HeadingBar';
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <HeadingBar/>
      <div className="front-page">
        <ToolBox toolName="Stat Equivalence" toolUrl="/stat-equivalence" />
        <ToolBox toolName="Tool 2" toolUrl="/tool2" />
        <ToolBox toolName="Tool 3" toolUrl="/tool3" />
      </div>
    </>
  );
}

const ToolBox = ({ toolName, toolUrl }) => {
  return (
    <Card bg={'light'} className='tool-box'>
      <Card.Body style={{width: '100%'}}>
        <Card.Title>{toolName}</Card.Title>
        <Button className="d-grid" variant='secondary' as={Link} to={toolUrl}>Calculator</Button>
      </Card.Body>
    </Card>
  );
};

export default App;
