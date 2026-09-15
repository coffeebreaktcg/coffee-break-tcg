# Données personnelles

`DATA_DIR/db.json` peut contenir noms, courriels, téléphones, adresses postales, notes de livraison, comptes, commandes, inscriptions marketing, sessions et demandes de vente. `emailOutbox` contient le contenu des notifications. Les uploads peuvent contenir des photos de collections ; les pièces comptables `expense-*` ne sont pas servies publiquement.

Les mêmes données sont présentes dans les sauvegardes locales et, si configuré, dans le backup Google Drive. Les logs structurés ajoutés par cette phase utilisent des identifiants techniques et évitent les secrets, cookies et coordonnées clients.

Aucune durée de conservation automatique n’est appliquée actuellement. Définir manuellement une politique conforme aux besoins légaux/comptables du Québec et du Canada, puis ajouter une purge testée dans une phase dédiée. Avant de partager une base pour test, anonymiser utilisateurs, adresses, commandes, courriels, sessions et jetons.
