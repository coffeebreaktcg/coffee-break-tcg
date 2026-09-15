# Sauvegarde et restauration

Les sauvegardes locales se trouvent dans `DATA_DIR/backups`. Elles utilisent le format `coffeebreak-backup-v2`, un checksum SHA-256, un horodatage et une raison. Les fichiers sont écrits sous un nom temporaire puis renommés. Les 40 plus récents sont conservés. Google Drive reste une copie additionnelle et ne remplace pas les sauvegardes locales.

## Restaurer

1. Mettre le service en maintenance et arrêter toutes les autres instances. Une seule instance peut écrire le JSON.
2. Copier le disque persistant ou déclencher une sauvegarde admin avant intervention.
3. Choisir un nom retourné par le dossier `backups`, sans chemin.
4. Dans le shell Render du service arrêté, exécuter `node server.js restore-backup NOM_DU_FICHIER.json`.
5. La commande valide le JSON, sa structure et son checksum, crée un backup `pre-restore`, puis remplace atomiquement la base. Une entrée d’audit `backup.restored` est ajoutée.
6. Redémarrer une seule instance et vérifier inventaire, commandes, rapprochement et login admin.

Les anciennes sauvegardes JSON brutes restent acceptées si leur structure minimale est valide. Il faut les copier et calculer un checksum externe avant une restauration réelle. Une sauvegarde corrompue est refusée ; la base courante reste intacte.

## Incident disque

Une erreur d’écriture ou de renommage remonte comme erreur serveur. Le fichier de base précédent n’est pas remplacé par du vide. Vérifier l’espace, les permissions, les fichiers temporaires et les logs `request.failed`/`backup.*`. Ne jamais effacer une base ou un backup avant d’avoir validé une autre copie.
