import React from "react";
import { Modal } from "react-bootstrap";
import EditMovie from "./edit-movie";

const CreateMovieModel = (props) => {

    return (
        <>
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Movie</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <EditMovie/>
            </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateMovieModel;