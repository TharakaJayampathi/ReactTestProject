import React from "react";

const MovieCard = ({
  movie: { title, vote_average, poster_path, relesase_date, original_language },
}) => {
  return (
    <div className="movie-card">
      <p className="text-white">
        {/* {title} */}
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}></img>
      </p>
    </div>
  );
};

export default MovieCard;
