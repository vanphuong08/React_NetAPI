import React from "react";
import {Row, Col } from "react-bootstrap";
import NoImage from "../no-image.png";

const MovieItem = (props) => {

    return (
        <>
            <Row>
                <Col item xs={12} md={2}>
                    <img src={props.data.coverImage || NoImage} style={{ width: 150, height: 150 }} />
                </Col>
                <Col item xs={12} md={10}>
                    <div><b>{props.data.title}</b></div>
                    <div>Actors: {props.data.actors.map(x => x.name).join(",")}</div>
                </Col>
                <Col item xs={12} md={2}>
                    <hr/>
                </Col>

            </Row>
        </>
    )
}

export default MovieItem;