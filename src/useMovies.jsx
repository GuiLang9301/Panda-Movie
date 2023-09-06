import { useState, useEffect } from "react";
const key = "f68c0928";

export function useMovies(query) {
  const [movies, setMovies] = useState();

  useEffect(
    function () {
      fetch(`https://www.omdbapi.com/?apikey=${key}&s=${query}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => setMovies(data.Search))
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    [query]
  );
  return movies;
}
