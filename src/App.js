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
    <div className="tool-box">
      <Link to={toolUrl}>{toolName}</Link>
    </div>
  );
};

export default App;
