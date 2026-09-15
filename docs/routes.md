# Routes CoffeeBreakTCG

Inventaire des routes actives. Les routes admin après connexion passent toutes par le contrôle de session serveur commun.

## Pages publiques

`/`, `/nouveautes`, `/singles`, `/slabs`, `/graded`, `/sealed`, `/one-piece`, `/one-piece/singles`, `/one-piece/slabs`, `/one-piece/box`, `/accessoires`, `/checkout`, `/compte`, `/creer-compte`, `/vendre`, `/livraison`, `/faq`, `/apropos` et `/produit/:id` utilisent l’application publique.

`/admin` charge l’interface d’administration; ses données restent protégées par les routes API authentifiées.

`/robots.txt`, `/sitemap.xml` et `/merchant-feed.json` sont des sorties publiques destinées aux moteurs et catalogues.

## API publique et client

| Méthode | Route | Accès | Usage |
|---|---|---|---|
| POST | `/api/square/webhook` | Signature Square | Confirmation de paiement |
| GET | `/api/me` | Public/session client | Session courante |
| POST | `/api/profile` | Client | Mise à jour du profil |
| GET | `/api/my-orders` | Client | Commandes du compte |
| GET | `/api/products` | Public | Inventaire publié |
| GET | `/api/card-shows` | Public | Événements actifs |
| GET | `/api/reviews` | Public | Avis publiés |
| GET | `/api/new-arrival-slides` | Public | Nouveautés publiées |
| GET | `/api/address/find` | Public, limité | Recherche d’adresse |
| GET | `/api/address/retrieve` | Public, limité | Détail d’adresse |
| POST | `/api/signup` | Public | Création de compte |
| POST | `/api/login` | Public | Connexion client |
| POST | `/api/logout` | Client | Déconnexion client |
| POST | `/api/sell-request` | Public, limité | Demande de vente/buylist |
| POST | `/api/order` | Public/client, limité | Réservation et checkout |

## API d’administration

| Méthode | Route | Usage |
|---|---|---|
| POST | `/api/admin/login` | Connexion admin |
| POST | `/api/admin/logout` | Déconnexion admin |
| GET | `/api/admin/me` | Session admin courante |
| GET | `/api/admin/reconciliation` | Anomalies de paiement et traitement |
| GET | `/api/admin/staging/proxy` | Diagnostic interne du proxy |
| POST | `/api/admin/orders/transition` | Transition contrôlée d’une commande |
| POST | `/api/admin/orders/resend-emails` | Renvoi des courriels d’une commande |
| GET | `/api/admin/reports/sales.csv` | Export des ventes |
| GET | `/api/admin/reports/monthly.csv` | Export mensuel |
| GET | `/api/admin/reports/inventory.csv` | Export d’inventaire |
| GET | `/api/admin/reports/pending.csv` | Export des commandes en attente |
| GET | `/api/admin/reports/taxes.csv` | Export des taxes |
| GET | `/api/admin/backup.json` | Backup JSON |
| GET | `/api/admin/backup.zip` | Backup complet avec uploads |
| POST | `/api/admin/backup/google-drive` | Copie du backup sur Google Drive |
| GET | `/api/admin/summary` | État complet du tableau de bord |
| POST | `/api/admin/merchandising` | Décisions de mise en avant |
| POST | `/api/admin/prices/sync` | Synchronisation des prix |
| POST | `/api/admin/sales` | Enregistrement d’une vente admin |
| POST | `/api/admin/products/discount` | Rabais produit |
| POST | `/api/admin/products/remove` | Retrait réversible d’un produit |
| POST | `/api/admin/products/delete` | Suppression d’un produit |
| POST | `/api/admin/orders/cancel` | Annulation d’une commande |
| POST | `/api/admin/orders/paid` | Confirmation manuelle autorisée |
| GET | `/api/admin/sets` | Recherche d’extensions |
| GET | `/api/admin/card-images` | Recherche d’images de cartes |
| GET | `/api/admin/market-suggest` | Suggestion de prix |
| POST | `/api/admin/products` | Création ou modification d’un produit |
| POST | `/api/admin/products/publish-drafts` | Publication de brouillons |
| POST | `/api/admin/card-shows` | Création ou modification d’un événement |
| POST | `/api/admin/card-shows/delete` | Suppression d’un événement |
| POST | `/api/admin/reviews` | Création ou modification d’un avis |
| POST | `/api/admin/reviews/delete` | Suppression d’un avis |
| POST | `/api/admin/new-arrival-slides` | Création ou modification d’une nouveauté |
| POST | `/api/admin/new-arrival-slides/delete` | Suppression d’une nouveauté |

Toutes ces routes sont utilisées par l’application, les flux Square ou les outils d’exploitation. Aucune route obsolète identifiée ne reste exposée.
