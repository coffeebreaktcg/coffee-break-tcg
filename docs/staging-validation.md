# Validation staging — Phase 3

Cette procédure utilise uniquement un service Render de staging, des données de test, Square Sandbox et des adresses courriel contrôlées. Ne réutiliser ni le disque ni les identifiants Square du service de production.

## 1. Variables Render staging

Configurer `NODE_ENV=production` pour conserver les cookies Secure et les contrôles de production, puis `DEPLOYMENT_STAGE=staging` et `SQUARE_ENVIRONMENT=sandbox`.

Variables obligatoires : `NODE_ENV`, `DEPLOYMENT_STAGE`, `PUBLIC_ORIGIN`, `DATA_DIR`, `UPLOAD_DIR`, `PERSISTENT_DISK_MOUNT_PATH`, `TRUST_PROXY_HOPS`, `ADMIN_PASSWORD_HASH`, `SQUARE_ENVIRONMENT`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_WEBHOOK_SIGNATURE_KEY` et `SQUARE_WEBHOOK_NOTIFICATION_URL`. Définir aussi `ADMIN_EMAIL`, `RESEND_API_KEY` et `RESEND_FROM_EMAIL` pour les essais correspondants.

Valeurs structurelles attendues sur un service dont le disque est monté dans `/var/data` :

```text
NODE_ENV=production
DEPLOYMENT_STAGE=staging
DATA_DIR=/var/data
UPLOAD_DIR=/var/data/uploads
PERSISTENT_DISK_MOUNT_PATH=/var/data
SQUARE_ENVIRONMENT=sandbox
PUBLIC_ORIGIN=https://VOTRE-SERVICE-STAGING.onrender.com
SQUARE_WEBHOOK_NOTIFICATION_URL=https://VOTRE-SERVICE-STAGING.onrender.com/api/square/webhook
```

Dans le shell Render du staging :

```bash
npm run diagnose:staging
```

Le résultat doit contenir `ok: true`, trois probes `data`, `uploads`, `backups`, des chemins réels sous le point de montage et `sameDevice: true`. Le rapport n’affiche que la présence des secrets, jamais leur valeur.

## 2. Diagnostic proxy

Se connecter à `/admin`, puis exécuter dans la console du navigateur :

```js
fetch('/api/admin/staging/proxy', { credentials: 'same-origin' }).then(r => r.json()).then(console.table)
```

Faire l’essai depuis deux connexions différentes, par exemple Wi-Fi puis réseau cellulaire. `warnings` doit être vide, `validChain` vrai et `effectiveIp` doit changer. Comparer `chainLength` à la chaîne de proxies Render et régler `TRUST_PROXY_HOPS` au nombre d’intermédiaires approuvés, en sélectionnant toujours l’adresse depuis la droite. Redéployer après toute modification.

## 3. Square Sandbox réel

1. Dans Square Developer, sélectionner l’application Sandbox et l’établissement Sandbox correspondant à `SQUARE_LOCATION_ID`.
2. Enregistrer exactement `https://VOTRE-SERVICE-STAGING.onrender.com/api/square/webhook` et l’événement `payment.updated`.
3. Créer dans l’admin staging un produit de test publié, prix connu, stock 1. Ne pas copier de fiche client réelle.
4. Depuis une fenêtre privée, placer une commande et vérifier `checkout.reserved`, puis `checkout.created` avec le même `requestId`/`orderId`.
5. Revenir par le callback Square avant la livraison du webhook : la commande doit rester `pending_payment` jusqu’au webhook.
6. Payer avec une [carte de test Square Sandbox](https://developer.squareup.com/docs/devtools/sandbox/payments). Après le webhook HTTPS, vérifier `paid`, le stock 0 et `square.payment.confirmed`.
7. Depuis Square Developer, rejouer le même événement. Vérifier `square.webhook.duplicate`, un seul événement enregistré et aucun second courriel.
8. Pour l’ordre inverse, créer une autre commande de test, laisser Square livrer le webhook avant d’ouvrir l’URL de retour, puis ouvrir le callback. L’état doit rester `paid`.
9. Pour un paiement tardif, laisser expirer la réservation. Tester une fois avec stock encore libre (`paid`) et une fois après avoir utilisé le stock avec une autre commande (`manual_review`).
10. Consulter `/api/admin/reconciliation`; aucune anomalie inexpliquée ne doit rester.

## 4. Email et renvoi

Avec un domaine/adresse Resend de staging, provoquer temporairement une erreur contrôlée en retirant uniquement la clé du service staging, puis effectuer un paiement Sandbox. La commande doit rester `paid` et `emailStatus` doit indiquer l’échec. Restaurer la clé staging et utiliser le renvoi de courriel admin. Vérifier `order.email_resend`, l’arrivée unique aux adresses contrôlées et l’absence de données de paiement dans le message.

## 5. Persistance, restart et restauration

1. Exécuter `npm run diagnose:staging` dans le shell Render.
2. Télécharger `/api/admin/backup.json` et noter le nom du nouveau fichier dans `/var/data/backups` avec `ls -lt /var/data/backups`.
3. Créer une fiche de test et une réservation active. Noter uniquement leurs identifiants.
4. Utiliser **Manual Deploy > Restart service** dans Render.
5. Relancer le diagnostic, vérifier que le backup existe encore et que la fiche/réservation est récupérée. Une réservation arrivée à échéance doit passer une seule fois à `expired`; une réservation active doit rester `pending_payment`.
6. Sur staging, créer un backup, effectuer une mutation clairement identifiable, arrêter le service, puis lancer `node server.js restore-backup NOM.json` dans un job/shell où aucune autre instance n’écrit.
7. Redémarrer et comparer l’inventaire, les commandes, utilisateurs de test, outbox et rapprochement avec le backup téléchargé. Vérifier la présence de `backup.restored`.

## 6. Audit des logs

Exporter uniquement les logs du créneau de test staging. Rechercher les événements attendus et les noms de champs interdits :

```bash
rg 'server.started|checkout.reserved|checkout.created|square.payment|square.webhook|order.email_resend|backup.created|backup.restored|server.shutdown' staging.log
rg -i 'authorization|cookie|password|access[_-]?token|private[_-]?key|card[_-]?number|cvv|cvc' staging.log
```

La seconde commande ne doit retourner aucune valeur sensible. Inspecter aussi quelques lignes pour confirmer la présence de `requestId` et des identifiants techniques utiles. Ne joindre pas le fichier complet à un ticket s’il contient des adresses IP ou des identifiants clients.

## Checklist de résultat

| Test | Automatique | Manuel requis | Résultat |
|---|---|---|---|
| Configuration stricte staging | Oui | Configurer les variables Render | Test local réussi; Render à vérifier |
| Diagnostic `TRUST_PROXY_HOPS` | Oui, calcul et endpoint | Essai depuis deux réseaux | En attente Render |
| DATA_DIR, uploads et backups sur le disque | Oui, probes atomiques | Exécuter sur le shell Render et redémarrer | Test local réussi; Render à vérifier |
| Callback avant webhook | Oui, simulation HTTP | Refaire avec Square Sandbox HTTPS | Test local réussi; Sandbox réel en attente |
| Webhook avant callback et rejeu | Oui, simulation HTTP | Refaire depuis Square Developer | Test local réussi; Sandbox réel en attente |
| Paiement tardif | Oui, simulation | Deux paiements Sandbox contrôlés | Test local réussi; Sandbox réel en attente |
| Deux checkouts sur stock 1 | Oui | Refaire avec deux navigateurs si désiré | Réussi localement |
| Email en panne puis renvoi | Oui, fournisseur simulé | Resend staging réel | Test local réussi; email réel en attente |
| Backup, mutation, restore, comparaison | Oui | Restauration sur le disque staging | Test local réussi; staging réel en attente |
| Restart et réservations | Oui, deux processus | Redémarrage Render | Test local réussi; Render en attente |
| Absence de secrets dans les logs | Oui, redaction | Auditer l’export Render | Test local réussi; logs Render en attente |
