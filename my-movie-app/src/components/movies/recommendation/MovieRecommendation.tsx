import React, { useState, useEffect } from 'react';
import './MovieRecommendation.css';

function MovieRecommendation(recommendation: any) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(prevShow => !prevShow);  
  }, [recommendation]);

  return (
    <div>
      {recommendation.recommendation && (
          <div className="alert alert-info recommendation" role="alert">
            <span>Recommended Movie: {recommendation.recommendation}</span>
          </div>
      )}
    </div>
  );
}

export default MovieRecommendation;
