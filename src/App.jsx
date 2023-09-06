import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
//step 1: create the layout
//step 2: add api data
//step 3: make movie box work
//step 4: make the found result work

//step 5:make the watched list work
//step 6: make the summary list worl
const key = "f68c0928";

export default function App() {
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [query, setQuery] = useState("");

  const [selectedID, setSelectedID] = useState(null);

  const movies = useMovies(query);

  // console.log(isLoading);
  //remember to add state variable as dependancy if you want to function in useeffect
  //get executed everytime the state changes.

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <FoundResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          <MovieList movies={movies} setSelectedID={setSelectedID} />
        </Box>
        <Box>
          <MovieDetail
            selectedID={selectedID}
            setWatched={setWatched}
            watched={watched}
          />
        </Box>
        <Box>
          <WatchedList watched={watched} setWatched={setWatched} />
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return <div className='nav-bar '>{children}</div>;
}

function Logo() {
  return (
    <div className='logo'>
      <h1>Panda Movie</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputElement = useRef(null);

  useEffect(function () {
    inputElement.current.focus();
  }, []);

  return (
    <input
      type='text'
      className='search'
      placeholder='Search'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}

function FoundResults({ movies }) {
  return (
    <div className='num-results'>
      Found {movies ? movies.length : 0} results
    </div>
  );
}

function Main({ children }) {
  return <div className='main'>{children}</div>;
}

function Box({ children }) {
  return <div className='box bg-black p-4'>{children}</div>;
}

function MovieList({ movies, setSelectedID, isLoading }) {
  function handleSelected(id) {
    setSelectedID(id);
  }

  const movieElments = movies?.map((movie) => (
    <Movie
      movie={movie}
      key={movie.imdbID}
      handleSelected={() => handleSelected(movie.imdbID)}
    />
  ));

  return (
    <div>
      <h1 className='p-2 text-warning'>Search List</h1>
      {movieElments}
    </div>
  );
}

function Movie({ movie, handleSelected }) {
  return (
    <div className='d-flex gap-5 p-2 ' onClick={handleSelected}>
      <div>
        <img src={movie.Poster} className='moviePoster' />
      </div>
      <div>
        <h3>{movie.Title}</h3>
        <h4>{movie.Year}</h4>
      </div>
    </div>
  );
}

function MovieDetail({ selectedID, setWatched, watched }) {
  const [movieDetail, setMovieDetail] = useState();
  const [myRating, setMyRating] = useState();
  useEffect(
    function () {
      fetch(`https://www.omdbapi.com/?apikey=${key}&i=${selectedID}`)
        .then((res) => res.json())
        .then((data) => setMovieDetail(data));
    },
    [selectedID]
  );

  function handleWatched(id) {
    const movieExists = watched.some((movie) => movie.imdbID === id);

    if (!movieExists) {
      setWatched((prev) => [
        ...prev,
        {
          ...movieDetail,
          myRating: myRating,
        },
      ]);
    }
  }

  return (
    <div>
      <h1 className='p-2 text-warning'>Movie Detail</h1>

      {movieDetail && movieDetail.Response !== "False" && (
        <div className='details '>
          {/* <button onClick={() => setMovieDetail("")} className='btn btn-back'>
            &larr;
          </button> */}
          <div className='d-flex '>
            <img src={movieDetail.Poster} className='object-fit-cover' />
            <div className='details-overview'>
              <h2 className='fw-bold'>{movieDetail.Title}</h2>
              <h4 className='fw-light'>{movieDetail.Released}</h4>
              <h4 className='fw-light'>{movieDetail.Genre}</h4>
              <h4 className='fw-light'>
                IMDB Rating: {movieDetail.imdbRating}
              </h4>
              <h4 className='fw-light'>Box Office: {movieDetail.BoxOffice}</h4>
            </div>
          </div>
          <StarRating maxRating={10} color='yellow' setRating2={setMyRating} />
          <div className='d-flex flex-column gap-2 m-5'>
            <p>{movieDetail.Plot}</p>
            <p>Starring {movieDetail.Actors}</p>
            <p>Directed by {movieDetail.Director}</p>
          </div>
          <button
            onClick={() => handleWatched(movieDetail.imdbID)}
            className='btn-add'
          >
            Add to my list
          </button>
        </div>
      )}
    </div>
  );
}

function WatchedList({ watched, setWatched }) {
  const [rank, setRank] = useState("default");
  let copy;

  if (rank === "myRating") {
    copy = watched.slice(0).sort((a, b) => b.myRating - a.myRating);
  } else if (rank === "imdbRating") {
    copy = watched.slice(0).sort((a, b) => b.imdbRating - a.imdb);
  } else if (rank === "default") {
    copy = watched;
  } else if (rank === "aTOz") {
    copy = watched.slice(0).sort((a, b) => a.Title.localeCompare(b.Title));
  }
  console.log(copy, rank);
  function handleDelete(id) {
    setWatched((prev) => prev.filter((movie) => movie.imdbID !== id));
  }
  const watchedElements = copy?.map((movie) => (
    <WatchedMovie
      movie={movie}
      key={movie.imdbID}
      handleDelete={() => handleDelete(movie.imdbID)}
    />
  ));

  return (
    <div>
      <h1 className='p-2 text-warning'>Watched List</h1>
      <Filter rank={rank} setRank={setRank} />
      {watchedElements}
    </div>
  );
}

function Filter({ rank, setRank }) {
  return (
    <select
      className='form-select m-3'
      onChange={(e) => setRank(e.target.value)}
      value={rank}
    >
      <option value='default'>Rank by Default</option>
      <option value='myRating'>Rank by My Rating</option>
      <option value='imdbRating'>Rank by imdbRating </option>
      <option value='aTOz'>Rank from A to Z </option>
    </select>
  );
}

function WatchedMovie({ movie, handleDelete }) {
  return (
    <>
      {movie ? (
        <div className='d-flex p-3 gap-4'>
          <div>
            <img src={movie.Poster} className='moviePoster' />
          </div>

          <div className='flex-grow-1'>
            <div className='h3'>{movie.Title}</div>
            <div className='h4 fw-light'>IMDB Rating: {movie.imdbRating}</div>
            <div className='h4 fw-light'>Your Rating: {movie.myRating}</div>
            <div className='h4 fw-light'>Box Office: {movie.BoxOffice}</div>
          </div>

          <button onClick={handleDelete} className='btn btn-danger btn-sm'>
            X
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
// function Navbar({ children }) {
//   return <nav className='nav-bar'>{children}</nav>;
// }

// function Logo() {
//   return (
//     <div className='logo'>
//       <span role='img'>🍿</span>
//       <h1>usePopcorn</h1>
//     </div>
//   );
// }

// function Search() {
//   const [query, setQuery] = useState("");

//   return (
//     <input
//       className='search'
//       type='text'
//       placeholder='Search movies...'
//       value={query}
//       onChange={(e) => setQuery(e.target.value)}
//     />
//   );
// }
// function FoundResults({ movies }) {
//   return (
//     <p className='num-results'>
//       Found <strong>{movies.length}</strong> results
//     </p>
//   );
// }

// function Main({ children }) {
//   return <main className='main'>{children}</main>;
// }

// // function WatchedBox({ children }) {
// //   const [isOpen2, setIsOpen2] = useState(true);

// //   return (
// //     <div className='box'>
// //       <button
// //         className='btn-toggle'
// //         onClick={() => setIsOpen2((open) => !open)}
// //       >
// //         {isOpen2 ? "–" : "+"}
// //       </button>
// //       {isOpen2 && <>{children}</>}
// //     </div>
// //   );
// // }

// function WatchedList({ watched }) {
//   return (
//     <ul className='list'>
//       {watched.map((movie) => (
//         <li key={movie.imdbID}>
//           <img src={movie.Poster} alt={`${movie.Title} poster`} />
//           <h3>{movie.Title}</h3>
//           <div>
//             <p>
//               <span>⭐️</span>
//               <span>{movie.imdbRating}</span>
//             </p>
//             <p>
//               <span>🌟</span>
//               <span>{movie.userRating}</span>
//             </p>
//             <p>
//               <span>⏳</span>
//               <span>{movie.runtime} min</span>
//             </p>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }

// function Box({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);

//   return (
//     <div className='box'>
//       <button
//         className='btn-toggle'
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && children}
//     </div>
//   );
// }

// function MovieList({ movies }) {
//   return (
//     <ul className='list'>
//       {movies?.map((movie) => (
//         <Movie movie={movie} key={movie.imdbID} />
//       ))}
//     </ul>
//   );
// }

// function Movie({ movie }) {
//   return (
//     <li key={movie.imdbID}>
//       <img src={movie.Poster} alt={`${movie.Title} poster`} />
//       <h3>{movie.Title}</h3>
//       <div>
//         <p>
//           <span>🗓</span>
//           <span>{movie.Year}</span>
//         </p>
//       </div>
//     </li>
//   );
// }

// function MovieSummary({ watched }) {
//   const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
//   const avgUserRating = average(watched.map((movie) => movie.userRating));
//   const avgRuntime = average(watched.map((movie) => movie.runtime));

//   return (
//     <div className='summary'>
//       <h2>Movies you watched</h2>
//       <div>
//         <p>
//           <span>#️⃣</span>
//           <span>{watched.length} movies</span>
//         </p>
//         <p>
//           <span>⭐️</span>
//           <span>{avgImdbRating}</span>
//         </p>
//         <p>
//           <span>🌟</span>
//           <span>{avgUserRating}</span>
//         </p>
//         <p>
//           <span>⏳</span>
//           <span>{avgRuntime} min</span>
//         </p>
//       </div>
//     </div>
//   );
// }
