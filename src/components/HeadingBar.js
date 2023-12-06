import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";

export default function HeadingBar() {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>Maple Armory</Navbar.Brand>
        <Nav variant="underline" className="me-auto">
          <Nav.Item>
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/stat-equivalence">Stat Equivalence</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}
