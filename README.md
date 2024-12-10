# P6_OCMovies

Cette application web permet de découvrir des films en fonction de leur genre, et de leur note IMDB.  
L'application récupère des données depuis une API pour afficher les films, ainsi que leurs détails, dans une interface interactive et responsive.

## Fonctionnalités

- **Affichage des films** : L'application affiche une liste de films triés par genre, et meilleure note IMDB.
- **Filtres par genre** : Les utilisateurs peuvent sélectionner un genre de films à partir d'un menu déroulant, ce qui met à jour la liste des films affichés.
- **Films populaires et mieux notés** : Les films sont filtrés en fonction de leur note IMDb dans toutes les catégories confondues.
- **Détails des films** : Lorsqu'un utilisateur clique sur un film, une modale s'ouvre pour afficher les détails du film (titre, année, durée, acteurs, etc.).
- **Responsive Design** : L'application est entièrement responsive, s'adaptant aux différentes tailles d'écran (desktop, tablette, mobile).
- **Chargement dynamique** : L'affichage des films est dynamique avec la possibilité de charger plus de films en cliquant sur un bouton "Voir plus".

## Aperçu

L'interface utilisateur de l'application permet de visualiser les films par catégories (top-rated, sci-fi, history, etc.). Lorsqu'un utilisateur sélectionne un genre dans le menu déroulant, les films associés à ce genre sont affichés avec des images, des titres et des descriptions. Une modale permet de visualiser plus de détails pour chaque film.

## Technologies utilisées

- **HTML5** : Structure de la page web.
- **CSS3** : Mise en forme de la page, utilisation de Flexbox et Grid pour la mise en page responsive.
- **JavaScript (ES6+)** : Manipulation dynamique du DOM, gestion des événements et requêtes API.
- **Bootstrap 5** : Framework CSS pour le responsive design et les composants UI (comme les cartes, les modales et les boutons).
- **API REST** : Utilisation d'une API pour récupérer les données des films.

## Installation

### Prérequis

Suivre les étapes du repository suivant pour se servir de l'API :  
[https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR)

### Cloner le projet

Clonez ce dépôt sur votre machine locale à l'aide de la commande suivante :

```bash
git clone https://github.com/thehanatos/P6_OCMovies.git
```

### Lancer l'application
Ouvrez le projet dans votre éditeur de texte préféré et lancez LiveStream pour l'utiliser dans votre navigateur.

### API
L'application récupère les films à partir d'une API REST. Assurez-vous que l'API est opérationnelle à l'URL suivante :
http://localhost:8000/api/v1/

### Structure du projet
```bash
Voici un aperçu de la structure du projet :  
│  
├── index.html        # Page d'accueil de l'application  
├── styles.css        # Styles personnalisés  
├── script.js         # Code JavaScript principal
├── /image-preview    # Dossier contenant les captures d'écran pour l'aperçu  
│   └── screenshot.png # Capture d'écran de l'application  
└── README.md         # Fichier README du projet
```

## Aperçu de l'application

Voici un aperçu de l'application montrant l'interface utilisateur avec les films affichés par genre et par note IMDb.

![Aperçu de l'application](./image-preview/screenshot.png)

