import React, { useEffect, useState } from "react";
import MovieItem from "./movie-item";
import ReactPaginate from "react-paginate";


const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [moviesCount, setMoviesCount] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        // get all movies
        getMovies();
    }, [page]);

    const getMovies = () => {
        fetch(`${process.env.REACT_APP_API_URL}/movie?pageSize=${process.env.REACT_APP_PAGING_SIZE}&pageIndex=${page}`)
            .then(res => res.json())
            .then(res => {
                if (res.status === true && res.data.count > 0) {
                    setMovies(res.data.movies);
                    setMoviesCount(Math.ceil(res.data.count / process.env.REACT_APP_PAGING_SIZE));
                } else if (res.data.count === 0) {
                    alert("There is no movie data in system.");
                }
            })
            .catch(err => alert("Error getting data"));
    }
    const handlePageClick = (pageIndex) => {
        setPage(pageIndex.selected);
    }

    return (
        <>
            {movies.length > 0 ?
                movies.map((m, i) => <MovieItem key={i} data={m} />)
                : <p>No movies available.</p>}

                <div className="d-flex justify-content-center">
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        pageCount={moviesCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        activeClassName={'active'}
                    />
                </div>
        </>
    )
}

export default MovieList;
