import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function HeadingBar() {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand>Maple Armory</Navbar.Brand>
                <Navbar.Toggle />
            </Container>
        </Navbar>
    );
}