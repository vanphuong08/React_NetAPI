import React, { useEffect, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import NoImage from "../no-image.png";
import AsyncSelect from 'react-select/async';
import { useParams } from 'react-router-dom';

const EditMovie = () => {
  const [movie, setMovie] = useState({});
  const [actors, setActors] = useState(null);
  const [validated, setValidated] = useState(false);
  const { movieid } = useParams();

  useEffect(() => {
    if (movieid) {
      fetch(`${process.env.REACT_APP_API_URL}/movie/${movieid}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.status === true) {
            let movieData = res.data;
            if (movieData.releaseDate) {
              movieData.releaseDate = movieData.releaseDate.split("T")[0];
            }
            setMovie(movieData);
            setActors(movieData.actors.map((x) => ({ value: x.id, label: x.name })));
          }
        })
        .catch((err) => alert("Error in getting data"));
    }
  }, [movieid]);

  const handleFileUpload = (event) => {
    event.preventDefault();
    var file = event.target.files[0];
    const form = new FormData();
    form.append("imageFile", file);
    fetch(`${process.env.REACT_APP_API_URL}/Movie/upload-movie-poster`, {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        var da = movie;
        da.coverImage = res.profileImage;
        setMovie({ ...movie, ...da });
      })
      .catch((err) => alert("Error in file upload"));
  };
  const handleSave = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.stopPropagation();
        setValidated(true);
        return;
    }

    // Ensure actors is an array before calling map
    let movieToPost = {
        ...movie,
        actors: (movie.actors || []).map((x) => x.id) // Use default empty array if actors is undefined
    };

    if (movie.id > 0) {
        // Update data
        fetch(`${process.env.REACT_APP_API_URL}/movie`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(movieToPost),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === true && res.data) {
                    let movieData = res.data;
                    if (movieData.releaseDate) {
                        movieData.releaseDate = movieData.releaseDate.split("T")[0];
                    }
                    setMovie(movieData);
                    alert("Update successfully");
                }
            })
            .catch((err) => alert("Error in getting data"));
    } else {
        // Create data
        fetch(`${process.env.REACT_APP_API_URL}/movie/`, {
            method: movie.id > 0 ? "PUT" : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieToPost),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === true && res.data) {
                    let movieData = res.data;
                    if (movieData.releaseDate) {
                        movieData.releaseDate = movieData.releaseDate.split("T")[0];
                    }
                    setMovie(movieData);
                    alert("Create successfully");
                }
            })
            .catch((err) => alert("Error in getting data"));
    }
};

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
  };

  const promiseOptions = (inputValue) => {
    return fetch(`${process.env.REACT_APP_API_URL}/Person/Search/${inputValue}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true && res.data.length > 0) {
          return res.data.map((x) => ({ value: x.id, label: x.name }));
        }
        if (res.data.count === 0) {
          alert("There is no actor matching this name");
        }
      })
      .catch((err) => alert("Error getting data"));
  };

  const multiselectchange = (data) => {
    setActors(data);
    var people = data.map((x) => ({ id: x.value, name: x.label }));
    setMovie((prevMovie) => ({ ...prevMovie, actors: people }));
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSave}>
        <Form.Group className="d-flex justify-content-center">
          <Image
            width="200"
            height="200"
            src={(movie && movie.coverImage) || NoImage}
          />
        </Form.Group>

        <Form.Group className="d-flex justify-content-center">
          <div>
            <input type="file" onChange={handleFileUpload} />
          </div>
        </Form.Group>

        <Form.Group controlId="formmovieTitle">
          <Form.Label>Movie Title</Form.Label>
          <Form.Control
            name="title"
            value={movie.title || ""}
            required
            type="text"
            autoComplete="off"
            placeholder="Enter Movie Name"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter movie name
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formmovieDescription">
          <Form.Label>Movie Description</Form.Label>
          <Form.Control
            name="description"
            value={movie.description || ""}
            type="textarea"
            rows={3}
            placeholder="Enter Movie Description"
            onChange={handleFieldChange}
          />
        </Form.Group>

        <Form.Group controlId="formmovieReleaseDate">
          <Form.Label>Release Date</Form.Label>
          <Form.Control
            name="releaseDate"
            value={movie.releaseDate || ""}
            required
            type="date"
            autoComplete="off"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter release date
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formmovieActors">
          <Form.Label>Actors</Form.Label>
          <AsyncSelect
            cacheOptions
            isMulti
            value={actors}
            loadOptions={promiseOptions}
            onChange={multiselectchange}
          />
        </Form.Group>

        <Form.Group controlId="formmovieLanguage">
          <Form.Label>Movie Language</Form.Label>
          <Form.Control
            name="language"
            value={movie.language || ""}
            type="text"
            placeholder="Enter Movie Language"
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Button type="submit">{movie.id > 0 ? "Update" : "Create"}</Button>
      </Form>
    </>
  );
};

export default EditMovie;
