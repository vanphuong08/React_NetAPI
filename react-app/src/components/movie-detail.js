import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import NoImage from "../no-image.png";
import { Link, useParams } from "react-router-dom";

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const { movieid } = useParams();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/movie/" + movieid)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true) {
          setMovie(res.data);
        }
      })
      .catch((err) => alert("Error in getting data"));
  }, [movieid]);

  return (
    <>
      <Row>
        {movie && (
          <>
            <Col xs={12} md={4}>
              <img src={movie.coverImage || NoImage} alt="Cover" style={{ width: 300, height: 300 }} />
            </Col>
            <Col xs={12} md={8}>
              <h3>{movie.title}</h3>
              <p>{movie.description || "N/A"}</p>
              <div><b>Language:</b> {movie.language}</div>
              <div><b>Release Date:</b> {movie.releaseData && movie.releaseData.split("T")[0]}</div>
              <div><b>Cast:</b> {movie.actions.map((x) => x.name).join(",")}</div>
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

export default MovieDetail;
