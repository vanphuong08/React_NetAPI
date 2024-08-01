import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import ActorList from "../components/actor-list";

const Actors = (props) => {
    
  const navigate = useNavigate();
    return (
        <>
            <Row>
                <Col xs={12} md={10}>
                    <h2>Actors</h2>
                </Col>
                <Col xs={12} md={2} className="align-self-center">
                    <Button className="float-right" onClick={() => navigate('/actors/create-edit')}>Add new Actors</Button>{' '} 
                </Col>
            </Row>

            <ActorList/>
        </>
    )
}
export default Actors;