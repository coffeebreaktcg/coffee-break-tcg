# Coffee Break TCG

Site boutique Coffee Break TCG avec vitrine, panier, checkout Square, admin inventaire, avis, card shows, comptabilité légère et sauvegarde Google Drive.

## Lancement local

```bash
node server.js
```

Puis ouvrir:

```txt
http://localhost:4173
```

Admin local:

```txt
http://localhost:4173/admin
```

## Variables Render principales

Utiliser `.env.example` comme modèle dans Render.

Valeurs importantes:

```txt
NODE_ENV=production
DATA_DIR=/var/data
UPLOAD_DIR=/var/data/uploads
SQUARE_ENVIRONMENT=production
SQUARE_WEBHOOK_NOTIFICATION_URL=https://coffeebreaktcg.com/api/square/webhook
```

Le fichier `data/seed.json` sert à initialiser le disque persistant au premier lancement sans publier les commandes, sessions ou données client locales.

## Admin et sécurité

Créer un mot de passe admin haché avant la mise en ligne:

```bash
node server.js hash-admin-password "un-mot-de-passe-long-et-unique"
```

Mettre le résultat dans Render:

```txt
ADMIN_PASSWORD_HASH=...
MAX_JSON_BODY_BYTES=8388608
```

Ne pas utiliser `ADMIN_PASSWORD` en production. Le serveur ajoute aussi des en-têtes de sécurité, limite la taille des requêtes et active les cookies `Secure` quand `NODE_ENV=production`.

## Webhook Square

Configurer dans Square Developer Console:

```txt
Notification URL: https://coffeebreaktcg.com/api/square/webhook
Events: payment.updated
```

Ajouter ensuite dans Render:

```txt
SQUARE_WEBHOOK_SIGNATURE_KEY=...
SQUARE_WEBHOOK_NOTIFICATION_URL=https://coffeebreaktcg.com/api/square/webhook
```

## Sécurisation phase 1

Voir `docs/security-phase1.md` pour les protections, limites et contrôles avant déploiement.

```bash
npm run check
npm test
```

Les tests HTTP utilisent uniquement une base temporaire et des réponses Square simulées.

La Phase 2 ajoute la validation stricte de production, les paiements tardifs, le rapprochement, les logs structurés et la restauration vérifiée. Commencer par `docs/production-checklist.md`. La restauration s’exécute, service arrêté, avec `node server.js restore-backup NOM.json`.

La Phase 3 ajoute le diagnostic de staging (`npm run diagnose:staging`), le contrôle du disque persistant et les scénarios réalistes décrits dans `docs/staging-validation.md`.
