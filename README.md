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
```

Le fichier `data/seed.json` sert à initialiser le disque persistant au premier lancement sans publier les commandes, sessions ou données client locales.
