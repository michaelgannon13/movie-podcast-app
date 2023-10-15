
function MovieRecommendation( recommendation: any ) {

    return (
            <div className="genre-recommendation">
            {recommendation.recommendation && (
                <div>
                    <p>Recommended Movie: {recommendation.recommendation}</p>
                </div>
            )}
        </div> 
    );
}

export default MovieRecommendation;
