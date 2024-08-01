import React from "react";
import { useNavigate } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import NoImage from "../no-image.png";
import Button from "react-bootstrap/Button"; // Cần nhập đúng đường dẫn cho component Button từ react-bootstrap

const MovieItem = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <Row>
        <Col xs={12} md={2}>
          <img src={props.data.coverImage || NoImage} alt="Cover" style={{ width: 150, height: 150 }} />
        </Col>
        <Col xs={12} md={10}>
          <div><b>{props.data.title}</b></div>
          <div>Actors: {props.data.actors.map(x => x.name).join(", ")}</div>
          {/* props.history.push => navigate */}
          <Button onClick={() => navigate('/details/' + props.data.id)}>See Details</Button>{' '} 
          <Button onClick={() => navigate('/edit/' + props.data.id)}>Edit</Button>{' '} 
          <Button variant="danger" onClick={() => props.deleteMovie(props.data.id)}danger>Delete</Button>
        </Col>
        <Col xs={12}>
          <hr />
        </Col>
      </Row>
    </>
  );
};

export default MovieItem;
