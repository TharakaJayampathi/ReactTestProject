import { useEffect, useState } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (maxPages, query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let allMovies = [];

      if (query !== "") {
        try {
          const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}`;
          const response = await fetch(endpoint, API_OPTIONS);

          if (!response.ok) {
            throw new Error("Failed to fetch movies");
          }

          const data = await response.json();
          console.log(data);

          if (data.Response === "False") {
            setErrorMessage(data.Error || "Failed to fetch movies");
            setMovieList([]);
            return;
          }

          console.log("Result List", data.results);
          allMovies = data.results;
          console.log("Total Movies Fetched:", allMovies.length);
          setMovieList(allMovies);
        } catch (error) {
          console.error(`Error fetching movies: ${error}`);
          setErrorMessage("Error fetching movies. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else {
        for (let page = 1; page <= maxPages; page++) {
          const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
          const response = await fetch(endpoint, API_OPTIONS);

          if (!response.ok) {
            throw new Error("Failed to fetch movies");
          }

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            allMovies = [...allMovies, ...data.results];
            console.log(`Page ${page} fetched (${data.results.length} movies)`);
          } else {
            console.log(`No results on page ${page}`);
            break;
          }
          await new Promise((r) => setTimeout(r, 300));
        }
      }

      console.log("Total Movies Fetched:", allMovies.length);
      setMovieList(allMovies);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchMovies(0, searchTerm);
    } else {
      fetchMovies(10, searchTerm);
    }
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassel
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[100px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
