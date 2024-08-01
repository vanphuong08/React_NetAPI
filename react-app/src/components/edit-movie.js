import React, { useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import NoImage from "../no-image.png";
import AsynsSelect from 'react-select/async'


const EditMovie = () => {
    const [movie, setMovie] = useState({});
    const [actors, setActors] = useState(null);
    const [validated, setValidated] = useState(false);

    const handleFileUpload = (event) =>{
        event.preventDefault();
        var file = event.target.files[0];
        const form = new FormData();
        form.append("imageFile", file);
        fetch(process.env.REACT_APP_API_URL + "/Movie/upload-movie-poster",{
            method: "POST",
            body:form
        })
        .then(res =>{
            return res.json()
        })
        .then(res =>{
            var da = movie;
            da.coverImage = res.profileImage;

            setMovie(oldDate => {return{ ...oldDate, ...da};});
        })
        .catch(err => alert("Error in file upload"));
    }

    const handleSave = (event) =>{
        event.preventDefault();
        const form = event.currentTarget;
        if(form.checkValidity() === false){
            event.stopPropagation();
            setValidated(true);
            return;
        }
        let movieToPost = movie;
        movieToPost.actors = movieToPost.actors.map(x => x.id);
        if(movie && movie.id > 0){
            //update data
            fetch(process.env.REACT_APP_API_URL + "/movie",{
                method: "PUT",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieToPost)
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === true && res.data){
                    setMovie(res.data);
                    alert('Update successfully')
                }
            })
        .catch(err => alert("Error in getting data"))
        }
        else{
            //creat data
            console.log(`${process.env.REACT_APP_API_URL}/movie`);
            fetch(`${process.env.REACT_APP_API_URL}/movie`,{
                method: "POST",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieToPost)
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === true && res.data){
                    setMovie(res.data);
                    alert('Create successfully')
                }
            })
        .catch(err => alert("Error in getting data"))
        }
    }

    const handleFieldChange = (event) =>{
        var da = movie;
            da[event.target.name] = event.target.value;

            setMovie(oldDate => {return{...oldDate, ...da}});
    }

    const promiseOptions = (inputValue) => {
        return fetch(process.env.REACT_APP_API_URL + "/Person/Search/" + inputValue)
        .then(res => res.json())
        .then(res =>{
            if(res.status === true && res.data.length > 0){
                return res.data.map(x => {return {value: x.id, label: x.name}});

            }
            if(res.data.count === 0 ){
                alert("there is no actor matching this name");
            }
        })
        .catch(err => alert("Error getting date"))
    }

    const multiselectchange = (data) =>{
        setActors(data);
        var people = data.map(x =>{return {id: x.value, name: x.label}});
        var da = movie;
        da.actors = people;

        setMovie(oldDate => {return{...oldDate, ...da}});
    }

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
                    <div><input type="file" onChange={handleFileUpload} /></div>
                </Form.Group>
                
                <Form.Group controlId="formmovieTitle">
                    <Form.Label>Movie Title</Form.Label>
                    <Form.Control name="title" value={(movie && movie.title) || ''} required type="text" autoComplete="off" placeholder="Enter Movie Name" onChange={handleFieldChange} />
                    <Form.Control.Feedback type="invalid">
                        Please enter movie name
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formmovieDescription">
                    <Form.Label>Movie Description</Form.Label>
                    <Form.Control name="description" value={(movie && movie.description) || ''} type="textarea" rows={3} placeholder="Enter Movie Description" onChange={handleFieldChange} />
                </Form.Group>
                
                <Form.Group controlId="formmovieReleaseDate">
                    <Form.Label>ReleaseDate</Form.Label>
                    <Form.Control name="releaseDate" value={(movie && movie.releaseDate) || ''} required type="date" autoComplete="off" onChange={handleFieldChange} />
                    <Form.Control.Feedback type="invalid">
                        Please enter release date
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group controlId="formmovieActors">
                    <Form.Label>Actors</Form.Label>
                    <AsynsSelect cacheOptions isMulti value={actors} loadOptions={promiseOptions} onChange={multiselectchange}></AsynsSelect>
                </Form.Group>
                
                <Form.Group controlId="formmovieLanguage">
                    <Form.Label>Movie Language</Form.Label>
                    <Form.Control name="language" value={(movie && movie.language) || ''} type="text" placeholder="Enter Movie Language" onChange={handleFieldChange} />
                </Form.Group>
                <Button type="submit">{movie && movie.id > 0 ? "Update" : "Create"}</Button>
            </Form>
        </>
    );
}

export default EditMovie;