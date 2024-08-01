import './App.css';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Actors from './pages/actors';
import EditMovie from './components/edit-movie';
import MovieDetail from './components/movie-detail';
import CreateEditActor from './components/create-edit-actor';
import ActorDetail from './components/actor-details';

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/">Movie World</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Movie</Nav.Link>
            <Nav.Link as={Link} to="/actors">Actors</Nav.Link>
          </Nav>
        </Navbar>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/details/:movieid" element={<MovieDetail />} />
          <Route exact path="/edit/:movieid" element={<EditMovie />} />
          <Route exact path="/actors" element={<Actors />} />
          <Route exact path="/actors/create-edit" element={<CreateEditActor />} />
          <Route exact path="/actors/details/:actorid" element={<ActorDetail />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
