import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

const ActorDetail = () => {
  const [actor, setActor] = useState(null);
  const { actorid } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/person/${actorid}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true) {
          setActor(res.data);
        }
      })
      .catch((err) => alert("Error in getting data"));
  }, [actorid]);

  return (
    <>
      <Row>
        {actor && (
          <>
            <Col xs={12} md={8}>
              <h3>{actor.name}</h3>
              <div>
                <b>Date Of Birth:</b>
              </div>
              <div>{actor.dateOfBirth && actor.dateOfBirth.split("T")[0]}</div>
              <div>
                <b>Movies:</b>
              </div>
              <ul>{actor.movies.map((x, index) => <li key={index}>{x}</li>)}</ul>
            </Col>
            <Col>
              <Link to="/">Go to home page</Link>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default ActorDetail;
