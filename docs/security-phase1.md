# Sécurisation phase 1 — CoffeeBreakTCG

## Périmètre

Allowlist HTTP, authentification, secrets, Square, validation serveur, limites de fréquence et protection des requêtes intersites. Pas de migration SQL ni de refonte visuelle. Les tests ne chargent pas `.env`, ne touchent pas `data/db.json` et interdisent les appels externes réels.

## Protections

- Seuls les points d’entrée navigateur nommés dans `security.js`, les routes publiques connues et les formats images/fonts sous `assets/` sont servis. Les uploads publics sont limités à PNG/JPEG/WebP ; les justificatifs `expense-*` sont exclus. Aucun fallback HTML pour un chemin inconnu. Les dotfiles, traversées, encodages ambigus et symlinks sont rejetés.
- `assets/` est un espace **public** : ne jamais y stocker des documents privés, même sous une extension image. Les sauvegardes et credentials doivent rester ailleurs.
- Les routes admin et Jarvis gardent leurs contrôles de session serveur. Cookies HttpOnly, Secure en production, Path=/, SameSite Strict pour admin/Jarvis et Lax pour clients.
- Sessions : admin 8 h, Jarvis 12 h, clients 7 jours ou 30 jours avec « se souvenir ». Les anciennes sessions clients sans expiration ne sont plus acceptées ; reconnexion nécessaire.
- Nouveaux hashes scrypt ; les hashes PBKDF2 existants restent vérifiables. Nouveaux comptes : 12 à 256 caractères. Les mots de passe admin/Jarvis en clair ne sont pas acceptés en production.
- Les POST du navigateur exigent JSON et une origine autorisée lorsqu’elle est présente. Sec-Fetch-Site cross-site est refusé. Aucun CORS permissif ni accès authentifié cross-origin n’est activé. Le webhook Square est exempté de ce contrôle et exige sa signature.
- Limites par IP et fenêtre de 15 min : authentification 20, checkout 30, formulaires de vente 10, recherches externes/Jarvis 120, admin général 600, autres API 1200. Le blocage admin/Jarvis après cinq échecs reste actif. Les limites sont en mémoire, bornées et réinitialisées au redémarrage.
- Checkout : quantités entières 1–1000, consolidation par produit, contrôle du statut/stock/limite, prix serveur uniquement. Le checkout est désactivé si la configuration de signature webhook manque.
- Square : signature HMAC sur URL configurée et corps original, vérification du paiement via Square, correspondance de commande non vide, statut COMPLETED, montant exact, CAD et établissement. Déduplication persistée par event_id, garde de statut pour des événements distincts du même paiement. La commande payée est écrite avant l’envoi des courriels.
- Données JSON : écritures atomiques et sérialisation des API dans **un seul processus**. Une base corrompue ne déclenche plus une réinitialisation silencieuse. Ceci ne remplace pas des transactions multi-processus.
- Uploads : identifiants sûrs, taille bornée, format raster et signature de fichier, écriture sans suivre un symlink. Ce contrôle n’est pas un réencodage complet d’image.
- Headers existants conservés : CSP, nosniff, referrer policy, permissions policy, anti-iframe et HSTS en production. Réponses JSON non mises en cache. Les erreurs de fournisseurs ne renvoient plus leur corps brut.

## Avant Render / production

1. Déployer une seule instance Node sur le disque persistant. Ne pas lancer de worker/instance supplémentaire écrivant le même JSON.
2. Définir `NODE_ENV=production`, `PUBLIC_ORIGIN` sur le domaine HTTPS canonique et, si nécessaire, `ALLOWED_ORIGINS` sur les alias exacts. Vérifier les redirections OAuth et Square.
3. Configurer `TRUST_PROXY_HOPS` selon la chaîne effective Render. La valeur locale 0 ignore X-Forwarded-For. Une valeur positive sélectionne l’adresse depuis la droite après le nombre de proxies approuvés. Ne pas recopier arbitrairement une valeur et ne pas exposer directement le processus en contournant les proxies approuvés. Vérifier que deux visiteurs distincts ont des limites distinctes et qu’ajouter une adresse à gauche ne contourne pas la limite.
4. Vérifier `ADMIN_PASSWORD_HASH` et `JARVIS_PASSWORD_HASH`. Une configuration Jarvis avec uniquement un mot de passe en clair ne fonctionnera plus en production. Les mots de passe existants ne sont pas changés par cette passe.
5. Vérifier `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_WEBHOOK_NOTIFICATION_URL`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID` et l’environnement Square. L’URL signée doit correspondre exactement à celle enregistrée chez Square.
6. Si la version permissive a été exposée, traiter les secrets présents sur le serveur comme potentiellement exposés : rotation Square, Resend, Google et authentification selon leur présence ; invalider les sessions concernées. Aucun accès illicite n’a été confirmé par cet audit. La correction seule ne révoque pas des secrets copiés auparavant.
7. Préférer `JARVIS_TOKEN_SECRET` dédié et stable. Les anciens tokens chiffrés avec un secret dérivé nécessitent une reconnexion Google après changement du secret. Ne pas modifier ce secret sans préparer cette reconnexion.
8. Exécuter les tests puis vérifier HTTPS, cookies, fichiers privés, IP proxy et un webhook en sandbox sur le déploiement. Aucun paiement réel ni courriel réel n’a été effectué pendant cette passe.

## Limites restantes

- La phase 2 traite maintenant les paiements tardifs : elle reprend le stock lorsqu’il est disponible et place sinon la commande en révision manuelle. Ce scénario doit encore être validé de bout en bout en sandbox avant d’ouvrir les paiements réels.
- Une interruption entre la sauvegarde du paiement et la préparation des courriels peut nécessiter le renvoi manuel maintenant disponible dans l’admin. Une livraison répétée ne relance pas la vente.
- La file d’API borne les écritures concurrentes mais peut faire attendre d’autres requêtes derrière une intégration lente. Les timeouts limitent ce risque ; une file transactionnelle dédiée est un travail futur.
- Limites en mémoire : pas de protection distribuée, pas de 2FA, hashes hérités acceptés. La migration SQL et une authentification plus avancée restent hors périmètre.
- CSP conserve unsafe-inline pour compatibilité avec les templates existants. L’échappement systématique des templates et une CSP à nonce constituent une prochaine étape ; cette passe ne représente pas un audit XSS exhaustif de Jarvis et de toute la vitrine.
- L’ancienne migration d’effacement d’inventaire reste présente : ne pas restaurer un inventaire ancien sans examiner ses marqueurs de migration. Aucune migration n’a été lancée sur les données réelles pendant les tests.

## Tests

`npm run test:security` exécute des tests HTTP sur loopback, base temporaire, transport Square simulé. Le système interdit les requêtes externes inattendues. Tests : fichiers privés/traversées/symlinks, routes publiques, CORS/CSRF/headers, authentification, JSON/taille, checkout et concurrence, webhook/idempotence, formulaires admin/uploads, hashes/cookies/expiration, configuration absente, base corrompue, brute force.

## Sources de vérification

- Square : https://developer.squareup.com/docs/webhooks/step3validate
- Square et event_id : https://developer.squareup.com/docs/webhooks/step1createurl
- Render et IP proxy : https://render.com/articles/how-render-handles-ddos-attacks
