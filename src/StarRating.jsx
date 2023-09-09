import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function StarRating({ maxRating = 7, setRating2 }) {
  const [rating, setRating] = useState(0);

  const starElements = Array.from({ length: maxRating }, (_, i) => (
    <Star
      key={i}
      handleRating={() => {
        setRating(i + 1);
        setRating2(i + 1);
      }}
      full={rating >= i + 1}
    />
  ));

  return (
    <div
      className={
        "d-flex gap-4 align-items-center rounded p-4 mt-5 mb-5 justify-content-center "
      }
    >
      <div className='d-flex'>{starElements}</div>
      <div className='fs-3'>{rating || ""}</div>
    </div>
  );
}

function Star({ handleRating, full }) {
  const star = full ? (
    <AiFillStar onClick={handleRating} className='fs-1' />
  ) : (
    <AiOutlineStar onClick={handleRating} className='fs-1' />
  );

  return <div>{star}</div>;
}
