async function fetchMovieData() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?&imdb_score_min=9.5";

    try {
        // Première requête : Obtenir la liste des films
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Trouver le film avec le plus de votes
        const movieWithMaxVotes = data.results.reduce((max, item) =>
            max.votes > item.votes ? max : item
        );

        // Deuxième requête : Obtenir les détails du film
        const detailResponse = await fetch(movieWithMaxVotes.url);
        if (!detailResponse.ok) {
            throw new Error(`HTTP error! Status: ${detailResponse.status}`);
        }
        const movieDetails = await detailResponse.json();

        // Mise à jour du contenu HTML
        document.getElementById("movie-title").textContent = movieDetails.title;
        document.getElementById("movie-image").src = movieDetails.image_url;
        document.getElementById("movie-description").textContent = movieDetails.description || "No description available.";
        document.getElementById("movie-details-link").href = movieDetails.url;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);

        // Gérer les erreurs dans le contenu HTML
        document.getElementById("movie-title").textContent = "Error loading movie";
        document.getElementById("movie-description").textContent = "Unable to fetch data.";
    }
}

// Appeler la fonction au chargement de la page
fetchMovieData();