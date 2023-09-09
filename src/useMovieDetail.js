import { useQuery } from "@tanstack/react-query";

const key = "f68c0928";

async function fetchMovieDetail(selectedID) {
  if (!selectedID) return;
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${key}&i=${selectedID}`
  );

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return await res.json();
}

export function useMovieDetail(selectedID) {
  const { data: movieDetail, isInitialLoading } = useQuery({
    queryFn: () => fetchMovieDetail(selectedID),
    queryKey: ["movieDetail", selectedID],
    enabled: Boolean(selectedID),
  });

  return { movieDetail, isInitialLoading };
}
