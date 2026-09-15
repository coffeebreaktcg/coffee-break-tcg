# Checklist avant production

- [ ] Une seule instance Render écrit dans `DATA_DIR` ; disque persistant monté et espace vérifié.
- [ ] `NODE_ENV`, `DEPLOYMENT_STAGE`, chemins absolus, `PERSISTENT_DISK_MOUNT_PATH`, `PUBLIC_ORIGIN`, `ALLOWED_ORIGINS` et `TRUST_PROXY_HOPS` validés.
- [ ] HTTPS, HSTS, cookies Secure et `X-Request-Id` observés depuis le domaine final.
- [ ] Secrets de la checklist de rotation renouvelés si l’ancienne version était publique.
- [ ] Login admin/Jarvis, expiration, origine intersite et limite de tentatives vérifiés.
- [ ] Fichiers privés et traversées refusés sur le déploiement.
- [ ] Square sandbox validé entièrement, y compris signature, location, montant, répétition et événement tardif.
- [ ] `/api/admin/reconciliation` ne contient aucune anomalie non comprise.
- [ ] Resend testé avec une adresse contrôlée ; renvoi manuel d’un courriel en échec vérifié.
- [ ] Backup local créé, checksum validé, copie Drive vérifiée.
- [ ] Restauration exécutée sur une copie/staging, jamais comme premier essai en production.
- [ ] SIGTERM Render observé avec `server.shutdown.started` et `server.shutdown.completed`.
- [ ] Checkout concurrent testé avec stock 1 ; une seule commande réussit.
- [ ] Paiement tardif avec stock disponible et indisponible vérifié en sandbox.
- [ ] Commande payée passée une seule fois à `fulfilled` depuis l’endpoint admin.
- [ ] CSP testée dans le navigateur. `unsafe-inline` reste nécessaire aux scripts/styles inline actuels ; son retrait demande des nonces ou l’extraction des blocs inline.
- [ ] `npm run check`, `npm run test:security` et `npm run test:phase2` réussissent sur l’artefact déployé.
- [ ] `npm run test:phase3` et `npm run diagnose:staging` réussissent sur le service staging.
