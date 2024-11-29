async function fetchMovieData() {
    const firstApiUrl = "http://localhost:8000/api/v1/titles/?&imdb_score_min=9.5";
    const secondApiUrl = "http://localhost:8000/api/v1/titles/?&imdb_score_min=9.4";
    const secondPageApiUrl = "http://localhost:8000/api/v1/titles/?imdb_score_min=9.4&page=2";
    const thirdApiUrl = "http://localhost:8000/api/v1/titles/?&genre=Sci-Fi&imdb_score_min=8";
    const thirdPageApiUrl = "http://localhost:8000/api/v1/titles/?&genre=Sci-Fi&imdb_score_min=8&page=2";
    const fourthApiUrl = "http://localhost:8000/api/v1/titles/?&genre=History&imdb_score_min=8.8";
    const fourthPageApiUrl = "http://localhost:8000/api/v1/titles/?&genre=History&imdb_score_min=8.8&page=2";

    try {
        // Effectuer les requêtes en parallèle
        const [
            firstResponse,
            secondResponse,
            secondPageResponse,
            thirdResponse,
            thirdPageResponse,
            fourthResponse,
            fourthPageResponse
        ] = await Promise.all([
            fetch(firstApiUrl),
            fetch(secondApiUrl),
            fetch(secondPageApiUrl),
            fetch(thirdApiUrl),
            fetch(thirdPageApiUrl),
            fetch(fourthApiUrl),
            fetch(fourthPageApiUrl)
        ]);

        // Vérifier les réponses
        if (
            !firstResponse.ok ||
            !secondResponse.ok ||
            !secondPageResponse.ok ||
            !thirdResponse.ok ||
            !thirdPageResponse.ok ||
            !fourthResponse.ok ||
            !fourthPageResponse.ok
        ) {
            throw new Error("HTTP error! One or more requests failed.");
        }

        // Récupérer les données JSON
        const firstData = await firstResponse.json();
        const secondData = await secondResponse.json();
        const secondPageData = await secondPageResponse.json();
        const thirdData = await thirdResponse.json();
        const thirdPageData = await thirdPageResponse.json();
        const fourthData = await fourthResponse.json();
        const fourthPageData = await fourthPageResponse.json();

        // *** Mise à jour des informations pour le meilleur film ***
        const movieWithMaxVotes = firstData.results.reduce((max, item) =>
            max.votes > item.votes ? max : item
        );
        const detailResponse = await fetch(movieWithMaxVotes.url);
        if (!detailResponse.ok) {
            throw new Error(`HTTP error! Status: ${detailResponse.status}`);
        }
        const movieDetails = await detailResponse.json();

        // Injection des données dans le DOM pour le meilleur film
        document.getElementById("movie-title").textContent = movieDetails.title;
        document.getElementById("movie-image").src = movieDetails.image_url;
        document.getElementById("movie-description").textContent = movieDetails.description || "No description available.";

        // Mise à jour de la modale pour le meilleur film
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

        // *** Mise à jour des films les mieux notés (2e requête) ***
        const combinedSecondQueryResults = [...secondData.results, ...secondPageData.results];
        const topMoviesSecondQuery = combinedSecondQueryResults.slice(0, 6);
        const topRatedMoviesContainer = document.getElementById("top-rated-movies");
        topRatedMoviesContainer.innerHTML = ""; // Nettoyer avant l'injection
        topMoviesSecondQuery.forEach(movie => {
            topRatedMoviesContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 pb-4">
                    <div class="card">
                        <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                </div>
            `;
        });

        // *** Mise à jour des films Sci-Fi (3e requête) ***
        const combinedThirdQueryResults = [...thirdData.results, ...thirdPageData.results];
        const topMoviesSciFi = combinedThirdQueryResults.slice(0, 6);
        const sciFiMoviesContainer = document.getElementById("sci-fi-movies");
        sciFiMoviesContainer.innerHTML = ""; // Nettoyer avant l'injection
        topMoviesSciFi.forEach(movie => {
            sciFiMoviesContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 pb-4">
                    <div class="card">
                        <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                </div>
            `;
        });

        // *** Mise à jour des films History (4e requête) ***
        const combinedFourthQueryResults = [...fourthData.results, ...fourthPageData.results];
        const topMoviesHistory = combinedFourthQueryResults.slice(0, 6);
        const historyMoviesContainer = document.getElementById("history-movies");
        historyMoviesContainer.innerHTML = ""; // Nettoyer avant l'injection
        topMoviesHistory.forEach(movie => {
            historyMoviesContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 pb-4">
                    <div class="card">
                        <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Appeler la fonction au chargement de la page
fetchMovieData();
