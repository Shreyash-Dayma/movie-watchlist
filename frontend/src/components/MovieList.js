import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieList.css';

const API_URL = 'https://movie-watchlist-uabx.onrender.com/api';


function MovieList() {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ title: '', genre: '', year: '' });
    const [filter, setFilter] = useState('all'); // 'all', 'watched', 'toWatch'

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const response = await axios.get(`${API_URL}/movies`);
        setMovies(response.data);
    };

    const addMovie = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/movies`, newMovie);
        setNewMovie({ title: '', genre: '', year: '' });
        fetchMovies();
    };

    const toggleWatched = async (movie) => {
        await axios.patch(`${API_URL}/movies/${movie._id}`, {
            isWatched: !movie.isWatched
        });
        fetchMovies();
    };

    const deleteMovie = async (id) => {
        await axios.delete(`${API_URL}/movies/${id}`);
        fetchMovies();
    };

    const filteredMovies = movies.filter(movie => {
        if (filter === 'watched') return movie.isWatched;
        if (filter === 'toWatch') return !movie.isWatched;
        return true;
    });

    return (
        <div className="container">
            <h1 className="header">Movie Watchlist</h1>
            
            <form onSubmit={addMovie} className="movie-form">
                <div className="form-group">
                    <input
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                        placeholder="Movie Title"
                        required
                    />
                    <input
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                        placeholder="Genre"
                        required
                    />
                    <input
                        type="number"
                        value={newMovie.year}
                        onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
                        placeholder="Release Year"
                        required
                    />
                    <button type="submit" className="btn btn-primary">Add Movie</button>
                </div>
            </form>

            <div className="filter-buttons">
                <button 
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('all')}
                >
                    All Movies
                </button>
                <button 
                    className={`btn ${filter === 'watched' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('watched')}
                >
                    Watched
                </button>
                <button 
                    className={`btn ${filter === 'toWatch' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('toWatch')}
                >
                    To Watch
                </button>
            </div>

            <div className="movie-grid">
                {filteredMovies.map(movie => (
                    <div key={movie._id} className="movie-card">
                        <h3>{movie.title}</h3>
                        <p>Genre: {movie.genre}</p>
                        <p>Year: {movie.year}</p>
                        <div className="card-actions">
                            <button 
                                onClick={() => toggleWatched(movie)}
                                className={`btn ${movie.isWatched ? 'btn-secondary' : 'btn-primary'}`}
                            >
                                {movie.isWatched ? 'Mark Unwatched' : 'Mark Watched'}
                            </button>
                            <button 
                                onClick={() => deleteMovie(movie._id)}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieList;
