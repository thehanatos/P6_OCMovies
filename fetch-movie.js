// Fonction pour récupérer les genres depuis l'API
async function fetchGenres() {
    try {
        const genreUrls = [
            "http://localhost:8000/api/v1/genres/?page_size=25"
        ];

        // Récupération des genres sur plusieurs pages
        const genreResponses = await Promise.all(genreUrls.map((url) => fetch(url)));
        const genreData = await Promise.all(genreResponses.map((res) => res.json()));

        // Fusionner les résultats
        const allGenres = genreData.flatMap((data) => data.results);

        return allGenres.map((genre) => genre.name); // Retourner une liste des noms des genres
    } catch (error) {
        console.error("Erreur lors de la récupération des genres :", error);
        return [];
    }
}

// Fonction pour récupérer les films par genre
async function fetchMoviesByGenre(genre) {
    try {
        // Requête pour récupérer les films selon le genre
        const firstPageUrl = `http://localhost:8000/api/v1/titles/?&genre=${genre}&imdb_score_min=8&page_size=25`;

        const [firstPageResponse] = await Promise.all([
            fetch(firstPageUrl)
        ]);

        if (!firstPageResponse.ok) {
            throw new Error("Erreur lors de la récupération des films.");
        }

        const firstPageData = await firstPageResponse.json();
        const movies = [...firstPageData.results].slice(0, 6);

        return movies;
    } catch (error) {
        console.error("Erreur lors de la récupération des films par genre :", error);
        return [];
    }
}

//Fonction pour afficher les films du genre sélectionné
async function updateMoviesByGenre(genre) {
    const genreMoviesContainer = document.getElementById("genre-movies");
    genreMoviesContainer.innerHTML = ""; // Nettoyer le conteneur

    const topMoviesGenre = await fetchMoviesByGenre(genre);

     // Afficher les films avec gestion des résolutions
    topMoviesGenre.forEach((movie, index) => {
        // Appliquer une classe hidden aux films à partir du 3e (sur petite résolution)
        let hiddenClass = '';
        if (index >= 2) {
            hiddenClass = 'hidden'; // Cacher au-delà du 2e film pour la petite résolution
        }
        genreMoviesContainer.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 movie ${hiddenClass}">
                <div class="card" style="cursor: pointer;">
                    <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                    </div>
                </div>
            </div>
        `;
    });

    addCardClickEvent("genre-movies", topMoviesGenre); // Associer les événements de clic

}


// Fonction pour gérer l'affichage de la modale avec les détails du film
function displayMovieInModal(movie) {
    // Mise à jour des informations de la modale
    document.getElementById("modal-title").textContent = movie.title;
    document.getElementById("modal-year").textContent = movie.year || "N/A";
    document.getElementById("modal-genre").textContent = movie.genres ? movie.genres.join(", ") : "N/A";
    document.getElementById("modal-pegi").textContent = movie.rated || "N/A";
    document.getElementById("modal-duration").textContent = movie.duration ? `${movie.duration} min` : "N/A";
    document.getElementById("modal-imdb").textContent = movie.imdb_score || "N/A";
    document.getElementById("modal-director").textContent = movie.directors ? movie.directors.join(", ") : "N/A";
    document.getElementById("modal-description").textContent = movie.description || "No description available.";
    document.getElementById("modal-actors").textContent = movie.actors ? movie.actors.join(", ") : "N/A";
    document.getElementById("modal-image").src = movie.image_url || "https://via.placeholder.com/150";
    document.getElementById("modal-link").href = movie.url || "#";

    // Afficher la modale
    const modal = new bootstrap.Modal(document.getElementById("movieModal"));
    modal.show();
}

// Fonction pour ajouter un événement de clic aux cartes de films
function addCardClickEvent(containerId, movies) {
    const container = document.getElementById(containerId);

    container.querySelectorAll(".card").forEach((card, index) => {
        card.addEventListener("click", () => {
            // Afficher les détails du film correspondant
            displayMovieInModal(movies[index]);
        });
    });
}

// Fonction principale pour récupérer les films
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
        const topMoviesSecondQuery = combinedSecondQueryResults.slice(0, 6); // Limiter à 6 éléments
        const topRatedMoviesContainer = document.getElementById("top-rated-movies");
        topRatedMoviesContainer.innerHTML = ""; // Nettoyer avant l'injection

        // Ajout des films selon les résolutions spécifiques
        topMoviesSecondQuery.forEach((movie) => {
            topRatedMoviesContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 movie">
                    <div class="card" style="cursor: pointer;">
                        <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                </div>
            `;
        });

        // Ajouter l'événement de clic
        addCardClickEvent("top-rated-movies", topMoviesSecondQuery);

        // *** Mise à jour des films Sci-Fi (3e requête) ***
        const combinedThirdQueryResults = [...thirdData.results, ...thirdPageData.results];
        const topMoviesSciFi = combinedThirdQueryResults.slice(0, 6);
        const sciFiMoviesContainer = document.getElementById("sci-fi-movies");
        sciFiMoviesContainer.innerHTML = ""; // Nettoyer avant l'injection

        // Ajout des films Sci-Fi avec gestion des résolutions spécifiques
        topMoviesSciFi.forEach((movie) => {
            sciFiMoviesContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 movie">
                    <div class="card" style="cursor: pointer;">
                        <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                </div>
            `;
        });

        // Ajouter l'événement de clic
        addCardClickEvent("sci-fi-movies", topMoviesSciFi);

        // *** Mise à jour des films History (4e requête) ***
        const combinedFourthQueryResults = [...fourthData.results, ...fourthPageData.results];
        const topMoviesHistory = combinedFourthQueryResults.slice(0, 6);
        const historyMoviesContainer = document.getElementById("history-movies");
        historyMoviesContainer.innerHTML = ""; // Nettoyer avant l'injection

        // Ajout des films History avec gestion des résolutions spécifiques
        topMoviesHistory.forEach((movie) => {
            historyMoviesContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 movie">
                    <div class="card" style="cursor: pointer;">
                        <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                </div>
            `;
        });

        // Ajouter l'événement de clic
        addCardClickEvent("history-movies", topMoviesHistory);

        initializeMovieDisplay();

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Fonction pour gérer l'affichage dynamique des films
function toggleMovies(categoryId, buttonId) {
    const categoryContainer = document.getElementById(categoryId);
    const button = document.getElementById(buttonId);
    const allMovies = categoryContainer.querySelectorAll('.movie');

    // Vérifier si tous les films sont visibles ou non
    const hiddenMovies = categoryContainer.querySelectorAll('.movie.hidden');

    if (hiddenMovies.length > 0) {
        // Montrer les films cachés
        allMovies.forEach((movie) => movie.classList.remove('hidden'));
        button.textContent = "Voir moins";  // Mettre à jour le texte du bouton
    } else {
        // Cacher certains films en fonction de la largeur de la fenêtre
        allMovies.forEach((movie, index) => {
            if (window.innerWidth <= 576 && index >= 2) {
                movie.classList.add('hidden');
            } else if (window.innerWidth > 576 && window.innerWidth <= 992 && index >= 4) {
                movie.classList.add('hidden');
            } else if (window.innerWidth > 992 && index >= 6) {
                movie.classList.add('hidden');
            }
        });
        button.textContent = "Voir plus";  // Mettre à jour le texte du bouton
    }
}

// Fonction principale pour récupérer et afficher les genres
async function fetchAndDisplayGenres() {
    const genres = await fetchGenres();
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Ajouter les genres à la liste déroulante
    genres.forEach((genre) => {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = genre;
        button.className = "dropdown-item";
        button.type = "button";

        // Ajouter un événement de clic
        button.addEventListener("click", () => {
            updateMoviesByGenre(genre); // Mettre à jour les films selon le genre
        });

        listItem.appendChild(button);
        dropdownMenu.appendChild(listItem);
    });
}

// Fonction d'initialisation de l'affichage par catégorie
function initializeMovieDisplay() {
    const categories = ['top-rated-movies', 'sci-fi-movies', 'history-movies', 'genre-movies'];
    categories.forEach(categoryId => {
        const categoryContainer = document.getElementById(categoryId);
        const movies = categoryContainer.querySelectorAll('.movie');

        // Appliquer la classe `hidden` à tous les films sauf les 2 premiers (petite résolution)
        movies.forEach((movie, index) => {
            if (index >= 2) movie.classList.add('hidden');
        });
    });
}

// Appeler l'initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les événements aux boutons
    document.getElementById('see-more-top-rated').addEventListener('click', () => toggleMovies('top-rated-movies', 'see-more-top-rated'));
    document.getElementById('see-more-sci-fi').addEventListener('click', () => toggleMovies('sci-fi-movies', 'see-more-sci-fi'));
    document.getElementById('see-more-history').addEventListener('click', () => toggleMovies('history-movies', 'see-more-history'));
    document.getElementById('see-more-genre').addEventListener('click', () => toggleMovies('genre-movies', 'see-more-genre'));

    // Initialisation de l'affichage des films
    fetchAndDisplayGenres(); 
    fetchMovieData();  
});