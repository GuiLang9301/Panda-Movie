// import { useState, useEffect } from "react";
// const key = "f68c0928";

// export function useMovies(query) {
//   const [movies, setMovies] = useState();

//   useEffect(
//     function () {
//       fetch(`https://www.omdbapi.com/?apikey=${key}&s=${query}`)
//         .then((res) => {
//           if (!res.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return res.json();
//         })
//         .then((data) => setMovies(data.Search))
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     },
//     [query]
//   );
//   return movies;
// }
import { useQuery } from "@tanstack/react-query";

const key = "f68c0928";

async function fetchMovies(query) {
  if (!query) {
    return []; // Return an empty array for empty queries.
  }

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${key}&s=${query}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.Search || [];
}

export function useMovies(query) {
  const {
    data: movies,
    isLoading,
    isInitialLoading,
  } = useQuery(["movies", query], () => fetchMovies(query), {
    enabled: Boolean(query), // Only enable the query if a non-empty query is provided.
  });

  return { movies, isLoading, isInitialLoading };
}
