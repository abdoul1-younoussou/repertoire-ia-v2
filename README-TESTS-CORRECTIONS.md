# Correctifs de la version GitHub Pages

Cette version inclut les ajustements suivants :

- Les liens externes des outils, formations et tutoriels s'ouvrent dans le même onglet. Le bouton Retour du navigateur ramène donc à Répertoire IA.
- Le dossier `reports/` et un fichier `status.json` initial sont présents : la requête ne renvoie plus 404 lors d'un test local.
- Le rapport reste indiqué comme « en attente » tant que le workflow GitHub Actions n'a pas produit un vrai rapport. Les compteurs ne sont pas présentés comme des résultats de vérification.
- Les cartes de statistiques du tableau de bord Surveillance sont des indicateurs, pas des boutons. Le bouton « Actualiser le rapport » recharge le dernier rapport publié ; il ne lance pas le vérificateur depuis un hébergement statique.

## Générer le rapport réel

Après publication dans GitHub, lancer le workflow **Vérification hebdomadaire des liens** depuis l'onglet Actions. Le workflow génère `reports/status.json`, l'enregistre dans le dépôt et publie le site avec le rapport.

## Test local

Ouvrir `index.html` avec Live Server. Vérifier les liens d'outils, la navigation Retour, la page Surveillance et l'affichage mobile. Le rapport restera « en attente » tant que le workflow n'aura pas tourné.
