async function fetchMovieData() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?&imdb_score_min=9.5";

    try {
        // Première requête pour obtenir la liste des films
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Trouver le film avec le plus de votes
        const movieWithMaxVotes = data.results.reduce((max, item) =>
            max.votes > item.votes ? max : item
        );

        // Deuxième requête pour les détails du film
        const detailResponse = await fetch(movieWithMaxVotes.url);
        if (!detailResponse.ok) {
            throw new Error(`HTTP error! Status: ${detailResponse.status}`);
        }
        const movieDetails = await detailResponse.json();

        // Mise à jour du contenu de la carte
        document.getElementById("movie-title").textContent = movieDetails.title;
        document.getElementById("movie-image").src = movieDetails.image_url;
        document.getElementById("movie-description").textContent = movieDetails.description || "No description available.";

        // Mise à jour du contenu de la modale
        document.getElementById("modal-title").textContent = movieDetails.title;
        document.getElementById("modal-year").textContent = movieDetails.year;
        document.getElementById("modal-genre").textContent = movieDetails.genres.join(", ");
        document.getElementById("modal-pegi").textContent = movieDetails.rated || "N/A";
        document.getElementById("modal-duration").textContent = `${movieDetails.duration} min`;
        document.getElementById("modal-imdb").textContent = movieDetails.imdb_score;
        document.getElementById("modal-director").textContent = movieDetails.directors.join(", ");
        document.getElementById("modal-description").textContent = movieDetails.description || "No description available.";
        document.getElementById("modal-actors").textContent = movieDetails.actors.join(", ");
        document.getElementById("modal-image").src = movieDetails.image_url;
        document.getElementById("modal-link").href = movieDetails.url;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);

        // Gestion des erreurs
        document.getElementById("movie-title").textContent = "Error loading movie";
        document.getElementById("movie-description").textContent = "Unable to fetch data.";
        // Gestion des erreurs modale
        document.getElementById("modal-title").textContent = "Error loading movie";
        document.getElementById("modal-description").textContent = "Unable to fetch data.";
    }
}

// Appeler la fonction au chargement de la page
fetchMovieData();