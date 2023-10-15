import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './MovieRecommendation.css';

function MovieRecommendation(recommendation: any) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(prevShow => !prevShow);  // Toggle the show state whenever a new recommendation is received
  }, [recommendation]);

  return (
    <div className="genre-recommendation">
      {recommendation.recommendation && (
        <CSSTransition
          in={show}
          timeout={300}
          classNames="fade"
          appear
        >
          <div>
            <p>Recommended Movie: {recommendation.recommendation}</p>
          </div>
        </CSSTransition>
      )}
    </div>
  );
}

export default MovieRecommendation;
