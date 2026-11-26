# Module Actualités IA

## 1. Présentation

Le module Actualités IA enrichit le Répertoire IA avec une veille technologique consacrée à l'intelligence artificielle.

Il vise à présenter des informations utiles pour l'Afrique francophone et le public international.

## 2. Fonctionnement

Le système fonctionne en cinq étapes :

1. Collecte automatique des flux RSS et Atom.
2. Extraction des titres, descriptions, dates et liens.
3. Détection des doublons.
4. Classement éditorial préliminaire.
5. Validation humaine avant publication.

## 3. Organisation des fichiers

- `data/news_sources.json` : liste des sources d'actualités.
- `data/news_pending.json` : actualités en attente de validation.
- `data/news.json` : actualités approuvées.
- `scripts/news_collector.py` : programme de collecte.
- `.github/workflows/news-collector.yml` : automatisation quotidienne.
- `CHARTE-ETHIQUE.md` : règles éditoriales et éthiques.

## 4. Sources surveillées

Les premières sources sont :

- OpenAI News
- Google DeepMind
- Hugging Face
- Google Research
- arXiv Artificial Intelligence
- arXiv Machine Learning

De nouvelles sources pourront être ajoutées progressivement.

## 5. Classification éditoriale

Trois statuts sont prévus :

- `recommande` : usage bénéfique et légitime.
- `a_examiner` : usage sensible ou à double usage.
- `non_recommande` : usage manifestement nuisible ou incompatible avec la charte.

Le classement automatique est indicatif. Une vérification humaine reste obligatoire.

## 6. Validation des actualités

Aucune actualité n'est publiée automatiquement.

Les propositions sont enregistrées dans `news_pending.json`.

Après vérification, les actualités approuvées peuvent être transférées dans `news.json`.

## 7. Respect du droit d'auteur

Le projet conserve les titres, les métadonnées, les résumés courts et les liens vers les sources originales.

Il ne republie pas les articles complets.

Les conditions d'utilisation des sources doivent être respectées.

## 8. Automatisation

Le workflow GitHub Actions prévoit :

- Une collecte quotidienne à 07 h UTC.
- Un déclenchement manuel.
- L'enregistrement des nouvelles propositions dans le dépôt.

Le workflow planifié doit être activé depuis la branche par défaut du dépôt.

## 9. Coût et technologies

Le module utilise :

- Python
- RSS et Atom
- GitHub Actions
- JSON

Aucune API d'intelligence artificielle payante n'est nécessaire dans cette première version.

## 10. Évolutions futures

Les prochaines améliorations pourront inclure :

- Une interface de validation administrative.
- Des résumés en français et en anglais.
- Des catégories thématiques.
- Des filtres par date et par source.
- Une rubrique Actualités intégrée au site.
- Un système de recherche dans les actualités.
