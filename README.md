# Répertoire IA — Version 2

Catalogue statique d'outils d'intelligence artificielle, de formations gratuites et de tutoriels. Le projet fonctionne sans base de données : les ressources sont conservées dans des fichiers JSON faciles à versionner.

## Fonctionnalités

- Interface responsive pour ordinateur et mobile.
- Recherche textuelle, filtre par catégorie et filtre par niveau de priorité.
- Fiches détaillées avec les informations disponibles dans les données, site officiel et formation associée.
- Tableau de bord affichant le dernier rapport de surveillance des liens.
- Vérificateur Python qui distingue les liens fonctionnels, redirections, erreurs 4xx, erreurs temporaires, restrictions d'accès et erreurs de connexion.
- Aucun remplacement ou changement automatique des URL.
- Déploiement automatisé sur GitHub Pages et vérification hebdomadaire des liens.

## Prérequis

Python 3.10+ et Visual Studio Code.

## Installation Windows / PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Lancer le site en local

Depuis la racine du dépôt :

```powershell
python -m http.server 8000
```

Ouvrir ensuite http://localhost:8000. Ne pas ouvrir `index.html` directement : les fichiers JSON sont chargés par `fetch` et nécessitent un serveur HTTP local.

## Vérifier les liens et actualiser le tableau de bord

```powershell
python -m scripts.run_monitor
```

Le rapport est écrit dans `reports/status.json`. Actualiser ensuite la page du navigateur. Les statuts `401`, `403` et `429` sont classés `non_verifiable`, pas `broken`. Les erreurs serveur temporaires et erreurs de connexion sont séparées. Les redirections sont signalées mais les URL sources ne sont jamais réécrites.

## Tests

```powershell
python -m unittest discover -s tests -v
```

## Données

- `data/tools.json` : catalogue d'outils et métadonnées disponibles.
- `data/formations.json` : formations séparées.
- `data/tutorials.json` : tutoriels vidéo.
- `data/imports/outils_ia_source_200.csv` : CSV source conservé pour référence.

Pour une fiche détaillée plus complète, tu peux ajouter ultérieurement des champs tels que `long_description`, `features`, `use_cases`, `pricing` ou `languages`. Le site affiche uniquement les informations réellement présentes.

## GitHub Pages

Deux workflows sont inclus :

- `.github/workflows/pages.yml` : déploiement à chaque push sur `main` et déclenchement manuel.
- `.github/workflows/weekly-link-check.yml` : vérification hebdomadaire le lundi à 06:00 UTC et déclenchement manuel.

Dans GitHub, ouvrir **Settings → Pages** et sélectionner **GitHub Actions** comme source de déploiement. Dans **Settings → Actions → General**, autoriser les permissions d'écriture si le workflow de surveillance doit pousser le rapport `status.json`.

Après le premier push, vérifier l'exécution du workflow Pages. Le tableau de bord reste en état « en attente » tant qu'un premier rapport `reports/status.json` n'a pas été généré et publié.


## Tutoriels et surveillance des liens

Le catalogue `data/tutorials.json` contient des guides et tutoriels identifiés sur les sites officiels des éditeurs. La présence d'une ressource dans le catalogue ne garantit pas sa disponibilité permanente : le statut de lien est établi par le vérificateur.

Le tableau de surveillance lit `reports/status.json`. Le bouton « Recharger le rapport » relit ce fichier ; il ne lance pas Python depuis le navigateur. Pour créer un nouveau rapport, ouvrez GitHub → Actions → « Vérification hebdomadaire des liens et publication » → Run workflow. Le workflow vérifie les liens, met à jour le rapport et republie le site sur GitHub Pages. Une exécution automatique est également programmée chaque lundi à 06:00 UTC.

Netlify Drop est un hébergement statique manuel : déposer un ZIP ne connecte pas le site à GitHub Actions et ne déclenche pas le vérificateur. Pour que le tableau de bord se mette à jour automatiquement, le site doit être déployé par le workflow GitHub Pages ou Netlify doit être connecté au dépôt avec un déploiement automatisé.
