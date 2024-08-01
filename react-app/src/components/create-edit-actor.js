import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const CreateEditActor = () => {
  const [validated, setValidated] = useState(false);
  const [actor, setActor] = useState({
    id: 0,
    name: "",
    dateOfBirth: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.data && location.state.data.id > 0) {
      let personData = location.state.data;
      if (personData.dateOfBirth !== null && personData.dateOfBirth !== undefined) {
        personData.dateOfBirth = personData.dateOfBirth.split("T")[0];
      }
      setActor(personData);
    } else {
      setActor({
        id: 0,
        name: "",
        dateOfBirth: "",
      });
    }
  }, [location.state]);

  const handleSave = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/person`;
    const method = actor.id > 0 ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actor),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true && res.data) {
          let personData = res.data;
          if (personData.dateOfBirth !== null && personData.dateOfBirth !== undefined) {
            personData.dateOfBirth = personData.dateOfBirth.split("T")[0];
          }
          setActor(personData);
          alert(method === "PUT" ? "Update successfully" : "Create successfully");
        }
      })
      .catch((err) => alert("Error in getting data"));
  };

  const handleFieldChange = (event) => {
    setActor({ ...actor, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSave}>
        <Form.Group controlId="formActorName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={actor.name || ""}
            required
            type="text"
            autoComplete="off"
            placeholder="Enter Name"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter actor name
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formActorDateOfBirth">
          <Form.Label>Date Of Birth</Form.Label>
          <Form.Control
            name="dateOfBirth"
            value={actor.dateOfBirth || ""}
            required
            type="date"
            autoComplete="off"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter date of birth
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">{actor.id > 0 ? "Update" : "Create"}</Button>
      </Form>
    </>
  );
};

export default CreateEditActor;
