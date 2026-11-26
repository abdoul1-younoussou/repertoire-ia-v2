# Guide — Validation des actualités IA

1. Téléchargez `data/news_pending.json` et `data/news.json` depuis GitHub.
2. Ouvrez `validation-actualites.html` dans Chrome, Firefox ou Edge.
3. Chargez les deux fichiers JSON.
4. Ouvrez chaque article original et vérifiez les faits, la date, le contexte et la charte éditoriale.
5. Approuvez ou rejetez chaque proposition.
6. Téléchargez les deux JSON modifiés.
7. Vérifiez leur contenu, puis remplacez les fichiers correspondants dans `data/` sur GitHub.

Les propositions rejetées restent dans `news_pending.json` avec le statut `rejected`. Les propositions approuvées sont déplacées dans `news.json` avec le statut `published`. Aucun contenu n'est publié automatiquement. Ne reproduisez pas les articles complets : rédigez des résumés originaux et brefs.
