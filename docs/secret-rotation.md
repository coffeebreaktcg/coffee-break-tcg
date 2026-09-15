# Rotation manuelle des secrets

Ne copier aucune valeur dans un ticket, un log ou une capture. Effectuer la rotation depuis les consoles officielles, mettre Render à jour, redéployer, puis révoquer l’ancienne valeur.

| Service | Variables | Action et impact |
|---|---|---|
| Square | `SQUARE_ACCESS_TOKEN`, `SQUARE_WEBHOOK_SIGNATURE_KEY` | Créer de nouvelles valeurs, mettre Render et la souscription webhook à jour, tester en sandbox, puis révoquer les anciennes. Les checkouts ouverts avec l’ancien environnement doivent être rapprochés. |
| Resend | `RESEND_API_KEY` | Remplacer la clé et vérifier le domaine expéditeur. Les courriels en échec restent dans `emailOutbox` et peuvent être renvoyés depuis l’endpoint admin. |
| Google Drive | `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON`, `GOOGLE_DRIVE_PRIVATE_KEY` ou fichier de compte de service | Créer une nouvelle clé, autoriser le même dossier, tester une sauvegarde, puis supprimer l’ancienne clé. |
| Admin | `ADMIN_PASSWORD_HASH` | Générer un nouveau hash hors ligne. Le changement de hash n’invalide pas automatiquement les sessions persistées : supprimer les entrées `adminSessions` pendant une fenêtre de maintenance si une compromission est suspectée. |
| Pokémon/prix/adresses | `POKEMON_TCG_API_KEY`, `TCG_API_KEY`, `CANADA_POST_ADDRESS_KEY` | Remplacer selon les consoles des fournisseurs si l’ancienne application publique a été exposée. |

La recherche Git automatisée n’a pas confirmé de secret commité. L’ancienne version pouvait servir `.env` par HTTP : si elle a été accessible publiquement, considérer les valeurs déployées comme potentiellement exposées et effectuer toutes les rotations ci-dessus.
