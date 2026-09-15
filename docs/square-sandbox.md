# Validation Square sandbox

## Configuration requise

Configurer sans imprimer les valeurs : `SQUARE_ENVIRONMENT=sandbox`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_WEBHOOK_NOTIFICATION_URL`, `PUBLIC_ORIGIN`. L’URL de notification doit être l’URL HTTPS exacte enregistrée dans Square et finir par `/api/square/webhook`.

La validation stricte de production exige `SQUARE_ENVIRONMENT=production` lorsque `DEPLOYMENT_STAGE=production`. Pour un service Render staging fidèle aux protections de production, utiliser `NODE_ENV=production`, `DEPLOYMENT_STAGE=staging` et `SQUARE_ENVIRONMENT=sandbox`.

## Scénario manuel

1. Utiliser une copie anonymisée de la base et un produit sandbox avec un stock de 1.
2. Créer le checkout. Chercher les événements structurés `checkout.reserved` puis `checkout.created` partageant le même `requestId` et `orderId`.
3. Payer avec une carte de test Square. Ne jamais utiliser une vraie carte.
4. Vérifier `square.payment.confirmed`, l’état `paid`, un stock final de 0 et une seule entrée `squareWebhookEvents`.
5. Rejouer le même événement depuis Square. Vérifier `square.webhook.duplicate`, aucun nouveau mouvement de stock et aucun second courriel.
6. Tester une signature invalide, un événement inconnu, un mauvais montant/devise/location et un identifiant de commande inconnu. Les cas incompatibles doivent apparaître dans `/api/admin/reconciliation` ou placer la commande en `manual_review`.
7. Laisser expirer une réservation. Si le stock est encore libre, le paiement tardif passe par `payment_received_after_expiry` puis `paid`. Si le stock a été vendu, la commande passe en `manual_review` sans recréer de stock.
8. Simuler Square indisponible avant de créer un lien : la commande doit être `checkout_failed` et le stock libéré.
9. Vérifier le callback navigateur avant et après le webhook. Le callback ne fait jamais foi : seul le paiement récupéré auprès de Square confirme la commande.

Les tests automatisés utilisent un transport Square simulé et couvrent succès, répétition, concurrence, 429, 500, réseau, JSON invalide et paiements tardifs. La transaction sandbox réelle reste manuelle.
