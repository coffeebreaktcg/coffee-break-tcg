let inventory = [];

const state = {
  category: "all",
  game: "Pokemon",
  search: "",
  sort: "featured",
  typeFilter: "all",
  setFilter: "all",
  conditionFilter: "all",
  availabilityFilter: "available",
};

const mobileShopQuery = window.matchMedia("(max-width: 680px)");

const money = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
});

const productGrid = document.querySelector("#productGrid");
const trustStrip = document.querySelector(".trust-strip");
const cartItems = document.querySelector("#cartItems");
const cartTotals = document.querySelector("#cartTotals");
const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotals = document.querySelector("#checkoutTotals");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutStatus = document.querySelector("#checkoutStatus");
const searchInput = document.querySelector("#searchInput");
const searchOverlay = document.querySelector("#searchOverlay");
const searchOverlayInput = document.querySelector("#searchOverlayInput");
const inventoryTools = document.querySelector("#inventoryTools");
const sortSelect = document.querySelector("#sortSelect");
const setFilterSelect = document.querySelector("#setFilterSelect");
const categoryTitle = document.querySelector("#categoryTitle");
const categoryEyebrow = document.querySelector("#categoryEyebrow");
const categoryIntro = document.querySelector("#categoryIntro");
const categorySeoPanel = document.querySelector("#categorySeoPanel");
const conditionFilterSelect = document.querySelector("#conditionFilterSelect");
const availabilityFilterSelect = document.querySelector("#availabilityFilterSelect");
const adminPage = document.querySelector("#adminPage");
const adminLogin = document.querySelector("#adminLogin");
const adminContent = document.querySelector("#adminContent");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginStatus = document.querySelector("#adminLoginStatus");
const adminLogoutButton = document.querySelector("#adminLogoutButton");
const adminSidebarLogoutButton = document.querySelector("#adminSidebarLogoutButton");
const adminPageTitle = document.querySelector("#adminPageTitle");
const adminMetrics = document.querySelector("#adminMetrics");
const adminPriceSync = document.querySelector("#adminPriceSync");
const syncPricesButton = document.querySelector("#syncPricesButton");
const adminInventoryRows = document.querySelector("#adminInventoryRows");
const adminInventorySearch = document.querySelector("#adminInventorySearch");
const adminInventoryCategory = document.querySelector("#adminInventoryCategory");
const adminInventoryGame = document.querySelector("#adminInventoryGame");
const adminInventoryStatus = document.querySelector("#adminInventoryStatus");
const adminInventorySort = document.querySelector("#adminInventorySort");
const adminOrderRows = document.querySelector("#adminOrderRows");
const adminCardShowForm = document.querySelector("#adminCardShowForm");
const adminCardShowRows = document.querySelector("#adminCardShowRows");
const cardShowStatus = document.querySelector("#cardShowStatus");
const cardShowImagePreview = document.querySelector("#cardShowImagePreview");
const adminReviewForm = document.querySelector("#adminReviewForm");
const adminReviewRows = document.querySelector("#adminReviewRows");
const reviewStatus = document.querySelector("#reviewStatus");
const accountingDashboard = document.querySelector("#accountingDashboard");
const reportStatus = document.querySelector("#reportStatus");
const adminProductForm = document.querySelector("#adminProductForm");
const pokemonSetSelect = document.querySelector("#pokemonSetSelect");
const cardLanguageSelect = document.querySelector("#cardLanguageSelect");
const adminSearchIntentChips = document.querySelector("#adminSearchIntentChips");
const productGameSelect = document.querySelector("#productGameSelect");
const toggleSoldCardsButton = document.querySelector("#toggleSoldCardsButton");
const soldCardsWrap = document.querySelector("#soldCardsWrap");
const searchCardImageButton = document.querySelector("#searchCardImageButton");
const selectedCardImageUrl = document.querySelector("#selectedCardImageUrl");
const selectedGalleryImageUrls = document.querySelector("#selectedGalleryImageUrls");
const editingProductId = document.querySelector("#editingProductId");
const editingProductStatus = document.querySelector("#editingProductStatus");
const draftInventoryCount = document.querySelector("#draftInventoryCount");
const publishDraftProductsButton = document.querySelector("#publishDraftProductsButton");
const publishDraftStatus = document.querySelector("#publishDraftStatus");
const adminOpenAddButton = document.querySelector("#adminOpenAddButton");
const adminOpenCardShowButton = document.querySelector("#adminOpenCardShowButton");
const adminOpenSessionButton = document.querySelector("#adminOpenSessionButton");
const adminCommandPaletteButton = document.querySelector("#adminCommandPaletteButton");
const adminProductDrawer = document.querySelector("#adminProductDrawer");
const adminSessionDrawer = document.querySelector("#adminSessionDrawer");
const adminSessionList = document.querySelector("#adminSessionList");
const adminSessionValue = document.querySelector("#adminSessionValue");
const quickBatchInput = document.querySelector("#quickBatchInput");
const quickBatchGame = document.querySelector("#quickBatchGame");
const quickBatchPreviewButton = document.querySelector("#quickBatchPreviewButton");
const quickBatchCreateButton = document.querySelector("#quickBatchCreateButton");
const quickBatchPreview = document.querySelector("#quickBatchPreview");
const quickBatchStatus = document.querySelector("#quickBatchStatus");
const adminSaleModal = document.querySelector("#adminSaleModal");
const adminSaleForm = document.querySelector("#adminSaleForm");
const adminPriceModal = document.querySelector("#adminPriceModal");
const adminPriceForm = document.querySelector("#adminPriceForm");
const adminCommandPalette = document.querySelector("#adminCommandPalette");
const adminProductDrawerMode = document.querySelector("#adminProductDrawerMode");
const adminProductDrawerTitle = document.querySelector("#adminProductDrawerTitle");
const adminSaveProductButton = document.querySelector("#adminSaveProductButton");
const adminSavePublishButton = document.querySelector("#adminSavePublishButton");
const adminSaveDraftButton = document.querySelector("#adminSaveDraftButton");
const adminDrawerProductSummary = document.querySelector("#adminDrawerProductSummary");
const adminPrevItemButton = document.querySelector("#adminPrevItemButton");
const adminNextItemButton = document.querySelector("#adminNextItemButton");
const adminUsePriceSuggestionButton = document.querySelector("#adminUsePriceSuggestionButton");
const adminEditActions = document.querySelector("#adminEditActions");
const adminDrawerPriceButton = document.querySelector("#adminDrawerPriceButton");
const adminDrawerSaleButton = document.querySelector("#adminDrawerSaleButton");
const adminDrawerRemoveButton = document.querySelector("#adminDrawerRemoveButton");
const adminOnlineToggle = document.querySelector("#adminOnlineToggle");
const adminDiscardModal = document.querySelector("#adminDiscardModal");
const adminDiscardCancelButton = document.querySelector("[data-admin-discard-cancel]");
const adminDiscardConfirmButton = document.querySelector("[data-admin-discard-confirm]");
const imageSearchPreview = document.querySelector("#imageSearchPreview");
const imageSearchStatus = document.querySelector("#imageSearchStatus");
const suggestMarketButton = document.querySelector("#suggestMarketButton");
const marketSuggestStatus = document.querySelector("#marketSuggestStatus");
const productDetailContent = document.querySelector("#productDetailContent");
const contentPageContent = document.querySelector("#contentPageContent");
const accountContent = document.querySelector("#accountContent");
const accountModal = document.querySelector("#accountModal");
const cardShowsGrid = document.querySelector("#cardShowsGrid");
const featuredSections = document.querySelector("#featuredSections");
const curatedSections = document.querySelector("#curatedSections");
const newArrivalsGrid = document.querySelector("#newArrivalsGrid");
const newArrivalsCarousel = document.querySelector("#newArrivalsCarousel");
const coffeeVitrineGrid = document.querySelector("#coffeeVitrineGrid");
const onePieceGrid = document.querySelector("#onePieceGrid");
const accessibleGrid = document.querySelector("#accessibleGrid");
const merchandisingSections = document.querySelector("#merchandisingSections");
const merchandisingStatus = document.querySelector("#merchandisingStatus");
const recalculateMerchandisingButton = document.querySelector("#recalculateMerchandisingButton");
const resetMerchandisingButton = document.querySelector("#resetMerchandisingButton");
const reviewSection = document.querySelector("#reviewSection");
const adminNewArrivalSlideForm = document.querySelector("#adminNewArrivalSlideForm");
const adminNewArrivalSlideRows = document.querySelector("#adminNewArrivalSlideRows");
const newArrivalSlideStatus = document.querySelector("#newArrivalSlideStatus");
const languageLoader = document.querySelector("#languageLoader");
const welcomeToast = document.querySelector("#welcomeToast");
let adminInventoryCache = [];
let adminInventoryView = { search: "", category: "all", game: "all", status: "all", sort: "recent" };
let activeAdminSection = "inventory";
let adminSubmitMode = "session";
let adminProductFormPristine = "";
let pendingAdminDiscardAction = null;
let merchandisingState = { decisions: {}, history: [], updatedAt: "" };
let merchandisingAlternativeSection = "";
const merchandisingScoreCache = new Map();
let cart = JSON.parse(localStorage.getItem("coffeeBreakCart") || "[]");
let lastShopView = JSON.parse(sessionStorage.getItem("coffeeBreakLastShopView") || "null");
let cardShows = [];
let reviews = [];
let newArrivalSlides = [];
let currentUser = null;
let customerOrders = [];
let profileEditMode = false;
let currentLang = localStorage.getItem("coffeeBreakLang") || "fr";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const translations = {
  fr: {
    menuOpen: "Ouvrir le menu",
    search: "Rechercher",
    cartOpen: "Ouvrir le panier",
    account: "Compte",
    navAbout: "À propos",
    heroEyebrow: "CoffeeBreakTCG · Laval",
    heroTitle: "Des cartes qu’on choisirait pour nous.",
    heroText: "Singles, slabs et sealed choisis par des collectionneurs. Du beau stock, des deals clairs, pis du monde avec qui c’est le fun de jaser cartes.",
    shopNow: "Voir ce qui vient d’arriver",
    seeOptions: "Fais-nous voir ta collection",
    trustPhotos: "Par des collectionneurs",
    trustShipping: "Deals clairs",
    trustPayment: "Emballé comme si c’était à nous",
    trustReserve: "Réservation 10 min",
    trustLocal: "Laval, Québec",
    searchCard: "Rechercher une carte",
    sortProducts: "Trier les produits",
    sortFeatured: "En vedette",
    sortRecent: "Ajouts récents",
    sortPriceAsc: "Prix: bas à haut",
    sortPriceDesc: "Prix: haut à bas",
    sortMarketDesc: "Valeur marché: haut à bas",
    sortMarketAsc: "Valeur marché: bas à haut",
    sortGradeDesc: "Grade: haut à bas",
    sortConditionDesc: "Condition: meilleure d’abord",
    sortStock: "Disponibilité",
    sortNameAsc: "Nom: A-Z",
    sortNameDesc: "Nom: Z-A",
    all: "Tout",
    newCategory: "Nouveauté",
    saleCategory: "Rabais",
    inventory: "Vitrine",
    availableCards: "Produits disponibles",
    shopEmpty: "Aucun produit ne correspond à ta recherche.",
    details: "Voir détails",
    viewCard: "Voir la carte →",
    addToCartShort: "+",
    addToCartFull: "Ajouter au panier",
    reserved: "RÉSERVÉ",
    cart: "Panier",
    cartEmpty: "Ton panier est vide.",
    remove: "Retirer",
    subtotal: "Sous-total",
    discount: "Rabais",
    delivery: "Livraison",
    deliveryNotCharged: "Non facturée au paiement",
    freeShippingProgress: "Livraison gratuite atteinte selon la politique affichée.",
    freeShippingRemaining: "Il te manque {amount} pour atteindre le seuil de livraison gratuite.",
    total: "Total",
    checkoutButton: "Passer à la commande",
    order: "Commande",
    checkoutTitle: "Finaliser",
    accountTitle: "Mon compte",
    accountText: "Connecte-toi pour voir tes commandes, garder tes informations de livraison et accélérer tes prochains achats.",
    accountPopupTitle: "Connexion client",
    accountPopupText: "Connecte-toi pour voir tes commandes et garder tes informations de livraison.",
    backShop: "Retour boutique",
    summary: "Récapitulatif",
    shipping: "Livraison",
    fullName: "Nom complet",
    email: "Courriel",
    phone: "Téléphone",
    address: "Adresse",
    city: "Ville",
    province: "Province",
    postal: "Code postal",
    deliveryNotes: "Notes de livraison",
    deliveryNotesPlaceholder: "Appartement, instructions, etc.",
    paySquare: "Payer avec Square",
    login: "Connexion",
    rememberMe: "Se souvenir de moi",
    createAccount: "Créer un compte",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    editProfile: "Modifier le profil",
    profileSaved: "Profil mis à jour.",
    marketingOptIn: "Recevoir les offres exclusives et les prochains drops à l’avance.",
    updateProfile: "Mettre à jour mes informations",
    orderHistory: "Commandes précédentes",
    noOrders: "Aucune commande pour le moment.",
    logout: "Déconnexion",
    saveProfile: "Sauvegarder ces informations dans mon compte",
    or: "ou",
    sellCards: "On achète vos cartes",
    stayTuned: "Les drops qui valent la peine, avant tout le monde.",
    emailPlaceholder: "Votre courriel",
    curatedEyebrow: "Sélection Coffee Break",
    featuredTitle: "LA VITRINE COFFEEBREAK",
    featuredText: "Le stock qu’on mettrait sur notre propre table.",
    newTitle: "Nouveautés",
    newText: "Ce qui vient d’atterrir sur la table.",
    viewAllNew: "Voir tout ce qui vient d’arriver →",
    viewFullSelection: "Voir toute la sélection →",
    exploreTitle: "Choisis ton coin de table",
    exploreText: "Va direct à ce que tu veux voir.",
    exploreSingles: "Cartes modernes, coups de cœur et ajouts faciles.",
    exploreGraded: "Grosses cartes protégées, prêtes pour la vitrine.",
    exploreSealed: "À garder fermé, ouvrir entre amis ou mettre de côté.",
    exploreOnePiece: "Un deuxième univers pour les gros hits et les belles pièces.",
    exploreUnder100: "Des cartes protégées qui restent accessibles.",
    sellTradeTitle: "On achète aussi",
    sellStepOne: "Montre-nous ce que t’as.",
    sellStepTwo: "On te revient avec un deal clair.",
    sellStepThree: "On règle ça simplement.",
    howItWorks: "Comment ça fonctionne",
    viewAllGradedArrow: "Voir les slabs →",
    viewAllOnePieceArrow: "Voir One Piece →",
    newsletterTitle: "Pré-commande / Mystery Box.",
    newsletterText: "Les pré-commandes, mystery boxes et drops spéciaux avant leur mise en ligne officielle.",
    newsletterCta: "Recevoir les alertes →",
    under25Title: "Singles sous 25 $",
    under25Text: "Des ajouts faciles pour compléter une commande.",
    onePieceTitle: "One Piece",
    onePieceText: "Singles, slabs et boîtes pour ouvrir une deuxième vitrine.",
    reviewsEyebrow: "Avis clients",
    reviewsTitle: "Des collectionneurs nous font <span>confiance</span>.",
    reviewsText: "",
    reviewsEmpty: "Les premiers avis clients apparaîtront ici bientôt.",
    stockPreorder: "dispo en précommande",
    inStock: "en stock",
    limit: "Limite",
    perRequest: "par demande",
    categoryAll: "Produits disponibles",
    mobileMoreTitle: "Voir plus",
    mobileMoreText: "Ouvre la collection complète sur une page dédiée.",
    viewAllSingles: "Voir tous les singles",
    viewAllGraded: "Voir tous les slabs",
    viewAllSealed: "Voir tout le sealed",
    buyCardsEyebrow: "On achète vos cartes",
    buyCardsTitle: "Fais-nous voir ta collection.",
    buyCardsCardTitle: "On achète vos cartes",
    buyCardsCardText: "Soumets ta collection de 1 000 $ et plus avec un résumé clair, les cartes importantes et des photos nettes.",
    submitCollection: "Envoyer ma collection",
    shippingCardTitle: "Livraison claire",
    shippingCardText: "Livraison depuis Laval, suivi inclus, avec protection adaptée pour singles, sealed et slabs.",
    viewShipping: "Voir la livraison",
    eventsEyebrow: "On apporte les cartes. Tu apportes ton binder.",
    upcomingShows: "Viens nous voir en vrai.",
    upcomingShowsShort: "Prochains arrêts",
    footerLocation: "Laval, Québec · Cartes aujourd’hui. Coffee shop demain.",
    pokemonCategory: "Pokémon",
    accessoriesCategory: "Accessoires",
    accessoriesAll: "Tous les accessoires",
    onePieceBoxes: "Box / boîtes",
    communityCategory: "Communauté",
    helpCategory: "Aide",
    tradeCard: "Échanger une carte",
  },
  en: {
    menuOpen: "Open menu",
    search: "Search",
    cartOpen: "Open cart",
    account: "Account",
    navAbout: "About",
    heroEyebrow: "CoffeeBreakTCG · Laval",
    heroTitle: "Cards we’d pick for ourselves.",
    heroText: "Singles, slabs and sealed picked by collectors. Good stock, clear deals and people who actually like talking cards.",
    shopNow: "See what just landed",
    seeOptions: "Show us your collection",
    trustPhotos: "By collectors",
    trustShipping: "Clear deals",
    trustPayment: "Packed like it was ours",
    trustReserve: "10-minute checkout hold",
    trustLocal: "Laval, Quebec",
    searchCard: "Search for a card",
    sortProducts: "Sort products",
    sortFeatured: "Featured",
    sortRecent: "Recent arrivals",
    sortPriceAsc: "Price: low to high",
    sortPriceDesc: "Price: high to low",
    sortMarketDesc: "Market value: high to low",
    sortMarketAsc: "Market value: low to high",
    sortGradeDesc: "Grade: high to low",
    sortConditionDesc: "Condition: best first",
    sortStock: "Availability",
    sortNameAsc: "Name: A-Z",
    sortNameDesc: "Name: Z-A",
    all: "All",
    newCategory: "New",
    saleCategory: "Sale",
    inventory: "Showcase",
    availableCards: "Available products",
    shopEmpty: "No products match your search.",
    details: "View details",
    viewCard: "View card →",
    addToCartShort: "+",
    addToCartFull: "Add to cart",
    reserved: "RESERVED",
    cart: "Cart",
    cartEmpty: "Your cart is empty.",
    remove: "Remove",
    subtotal: "Subtotal",
    discount: "Discount",
    delivery: "Shipping",
    deliveryNotCharged: "Not charged at payment",
    freeShippingProgress: "Free shipping threshold reached based on the displayed policy.",
    freeShippingRemaining: "{amount} left to reach the free shipping threshold.",
    total: "Total",
    checkoutButton: "Go to checkout",
    order: "Order",
    checkoutTitle: "Checkout",
    accountTitle: "My account",
    accountText: "Sign in to view previous orders, keep your shipping details and make future purchases faster.",
    accountPopupTitle: "Customer login",
    accountPopupText: "Sign in to view your orders and keep your shipping details.",
    backShop: "Back to shop",
    summary: "Summary",
    shipping: "Shipping",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    province: "Province",
    postal: "Postal code",
    deliveryNotes: "Delivery notes",
    deliveryNotesPlaceholder: "Apartment, instructions, etc.",
    paySquare: "Pay with Square",
    login: "Sign in",
    rememberMe: "Remember me",
    createAccount: "Create account",
    password: "Password",
    confirmPassword: "Confirm password",
    editProfile: "Edit profile",
    profileSaved: "Profile updated.",
    marketingOptIn: "Get exclusive offers and early access to upcoming drops.",
    updateProfile: "Update my information",
    orderHistory: "Previous orders",
    noOrders: "No orders yet.",
    logout: "Sign out",
    saveProfile: "Save these details to my account",
    or: "or",
    sellCards: "We buy your cards",
    stayTuned: "Only the drops worth opening, before everyone else.",
    emailPlaceholder: "Your email",
    curatedEyebrow: "Coffee Break picks",
    featuredTitle: "The CoffeeBreak Showcase",
    featuredText: "The kind of stock we would put on our own table.",
    newTitle: "New arrivals",
    newText: "What just landed on the table.",
    viewAllNew: "See everything that just landed →",
    viewFullSelection: "View the full selection →",
    exploreTitle: "Pick your side of the table",
    exploreText: "Go straight to what you want to see.",
    exploreSingles: "Modern cards, favorites and easy pickups.",
    exploreGraded: "Big protected cards, ready for the showcase.",
    exploreSealed: "Keep it sealed, rip it with friends or put it away.",
    exploreOnePiece: "A second universe for big hits and clean pieces.",
    exploreUnder100: "Protected cards that stay accessible.",
    sellTradeTitle: "We buy too",
    sellStepOne: "Show us what you have.",
    sellStepTwo: "We come back with a clear deal.",
    sellStepThree: "We make it simple.",
    howItWorks: "How it works",
    viewAllGradedArrow: "View slabs →",
    viewAllOnePieceArrow: "View One Piece →",
    newsletterTitle: "Preorder / Mystery Box.",
    newsletterText: "Preorders, mystery boxes and special drops before they go live.",
    newsletterCta: "Get alerts →",
    under25Title: "Singles under $25",
    under25Text: "Easy additions to complete an order.",
    onePieceTitle: "One Piece",
    onePieceText: "Singles, slabs and boxes for a second showcase.",
    reviewsEyebrow: "Customer reviews",
    reviewsTitle: "Collectors <span>trust</span> us.",
    reviewsText: "",
    reviewsEmpty: "The first customer reviews will appear here soon.",
    stockPreorder: "available for preorder",
    inStock: "in stock",
    limit: "Limit",
    perRequest: "per request",
    categoryAll: "Available products",
    mobileMoreTitle: "See more",
    mobileMoreText: "Open the full collection on a dedicated page.",
    viewAllSingles: "View all singles",
    viewAllGraded: "View all slabs",
    viewAllSealed: "View all sealed",
    buyCardsEyebrow: "We buy cards",
    buyCardsTitle: "Show us your collection.",
    buyCardsCardTitle: "We buy cards",
    buyCardsCardText: "Submit your collection of $1,000 and up with a clear summary, key cards and sharp photos.",
    submitCollection: "Send my collection",
    shippingCardTitle: "Clear shipping",
    shippingCardText: "Shipping from Laval, tracking included, with protection adapted to singles, sealed products and slabs.",
    viewShipping: "View shipping",
    eventsEyebrow: "We bring the cards. You bring the binder.",
    upcomingShows: "Come see us in person.",
    upcomingShowsShort: "Upcoming stops",
    footerLocation: "Laval, Quebec · Cards today. Coffee shop tomorrow.",
    pokemonCategory: "Pokemon",
    accessoriesCategory: "Accessories",
    accessoriesAll: "All accessories",
    onePieceBoxes: "Boxes",
    communityCategory: "Community",
    helpCategory: "Help",
    tradeCard: "Trade a card",
  },
};

function t(key) {
  return translations[currentLang]?.[key] ?? translations.fr[key] ?? key;
}

const provinceCodes = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];
const FREE_SHIPPING_THRESHOLD = 100;

function provinceOptions(selected = "QC") {
  return provinceCodes
    .map((code) => `<option value="${code}" ${code === selected ? "selected" : ""}>${code}</option>`)
    .join("");
}

function passwordInput(name, label, autocomplete = "new-password") {
  return `
    <label class="password-field">
      ${label}
      <input name="${name}" type="password" autocomplete="${autocomplete}" minlength="6" required />
      <button type="button" data-toggle-password aria-label="Afficher le mot de passe">👁</button>
    </label>
  `;
}

function isSaleProduct(product) {
  return Number(product.compareAtPrice || 0) > Number(product.price || 0);
}

const categoryRoutes = {
  "/": "all",
  "/singles": "Singles",
  "/sealed": "Sealed",
  "/slabs": "Graded",
  "/graded": "Graded",
  "/accessoires": "Accessories",
};

const gameRoutes = {
  "/one-piece": { category: "all", game: "One Piece" },
  "/one-piece/singles": { category: "Singles", game: "One Piece" },
  "/one-piece/slabs": { category: "Graded", game: "One Piece" },
  "/one-piece/box": { category: "Sealed", game: "One Piece" },
};

const categoryLabels = {
  all: () => t("availableCards"),
  new: () => t("newCategory"),
  sale: () => t("saleCategory"),
  featured: () => t("featuredTitle"),
  Singles: "Singles",
  Sealed: "Sealed",
  Graded: "Slabs",
  Preorder: "Pré-commande / Mystery Box",
  Accessories: "Accessoires",
};

const categoryPageCopy = {
  fr: {
    "/singles": {
      eyebrow: "Pokémon",
      title: "Singles",
      intro: "Cartes Pokémon singles inspectées une par une, avec photos réelles, condition claire et expédition suivie partout au Canada.",
      metaTitle: "Singles Pokémon Canada | Coffee Break TCG",
      metaDescription: "Magasine des singles Pokémon inspectés, photographiés et expédiés avec suivi depuis le Québec. Cartes modernes, hits, promos et ajouts de collection.",
      proof: ["Photos réelles", "Condition NM / LP / MP indiquée", "Emballage rigide", "Expédition suivie au Canada"],
      seoText: "Les singles sont pensés pour les collectionneurs qui veulent compléter un binder, ajouter un coup de cœur moderne ou trouver une carte propre sans deviner l’état. Chaque carte publiée est sélectionnée, photographiée et préparée pour arriver protégée.",
    },
    "/slabs": {
      eyebrow: "Pokémon",
      title: "Slabs",
      intro: "Cartes Pokémon gradées PSA, CGC, SGC, TAG ou Beckett, choisies pour la vitrine, l’investissement personnel et les belles collections.",
      metaTitle: "Slabs Pokémon gradés Canada | Coffee Break TCG",
      metaDescription: "Découvre des slabs Pokémon gradés PSA, CGC, SGC, TAG et Beckett. Cartes inspectées, photos réelles, emballage protecteur et livraison suivie au Canada.",
      proof: ["Slabs protégés", "Compagnie et grade affichés", "Photos nettes", "Expédition en boîte solide"],
      seoText: "La page slabs regroupe les cartes gradées prêtes à exposer ou à garder long terme. On met de l’avant les grades, la compagnie de gradation, l’état visuel du slab et les détails qui comptent avant d’acheter.",
    },
    "/graded": {
      eyebrow: "Pokémon",
      title: "Slabs",
      intro: "Cartes Pokémon gradées PSA, CGC, SGC, TAG ou Beckett, choisies pour la vitrine, l’investissement personnel et les belles collections.",
      metaTitle: "Slabs Pokémon gradés Canada | Coffee Break TCG",
      metaDescription: "Découvre des slabs Pokémon gradés PSA, CGC, SGC, TAG et Beckett. Cartes inspectées, photos réelles, emballage protecteur et livraison suivie au Canada.",
      proof: ["Slabs protégés", "Compagnie et grade affichés", "Photos nettes", "Expédition en boîte solide"],
      seoText: "La page slabs regroupe les cartes gradées prêtes à exposer ou à garder long terme. On met de l’avant les grades, la compagnie de gradation, l’état visuel du slab et les détails qui comptent avant d’acheter.",
    },
    "/sealed": {
      eyebrow: "Pokémon",
      title: "Sealed",
      intro: "Produits Pokémon sealed pour rip, garder fermé ou préparer un prochain drop : ETB, packs, boîtes et items scellés sélectionnés.",
      metaTitle: "Produits Pokémon sealed Canada | Coffee Break TCG",
      metaDescription: "Boîtes, ETB, packs et produits Pokémon sealed sélectionnés par Coffee Break TCG. Expédition suivie au Canada et emballage protecteur.",
      proof: ["Scellé vérifié", "Protection adaptée", "Drops et précommandes", "Shipping suivi"],
      seoText: "Le sealed attire autant les collectionneurs patients que ceux qui veulent ouvrir entre amis. On met l’accent sur l’état du produit, la protection d’expédition et les items qui ont du sens pour une collection.",
    },
    "/one-piece": {
      eyebrow: "TCG",
      title: "One Piece",
      intro: "Tous les produits One Piece disponibles : singles, slabs et boîtes.",
      metaTitle: "One Piece TCG Canada | Coffee Break TCG",
      metaDescription: "Singles, slabs et boîtes One Piece TCG sélectionnés par Coffee Break TCG, avec photos réelles et expédition suivie au Canada.",
      proof: ["Singles et slabs", "Photos réelles", "Stock sélectionné", "Expédition suivie"],
      seoText: "One Piece TCG est traité comme une vraie deuxième vitrine : beaux hits, cartes populaires et produits choisis pour les collectionneurs qui veulent sortir du Pokémon sans perdre le niveau de soin Coffee Break.",
    },
  },
  en: {
    "/singles": {
      eyebrow: "Pokemon",
      title: "Singles",
      intro: "Pokemon singles inspected one by one, with real photos, clear condition notes and tracked shipping across Canada.",
      metaTitle: "Pokemon Singles Canada | Coffee Break TCG",
      metaDescription: "Shop inspected Pokemon singles with real photos, clear condition notes and tracked Canadian shipping from Coffee Break TCG.",
      proof: ["Real photos", "NM / LP / MP condition", "Rigid protection", "Tracked Canadian shipping"],
      seoText: "Singles are for collectors who want to complete a binder, grab a modern hit or buy a clean card without guessing condition. Every listed card is selected, photographed and packed with care.",
    },
    "/slabs": {
      eyebrow: "Pokemon",
      title: "Slabs",
      intro: "Graded Pokemon cards from PSA, CGC, SGC, TAG and Beckett, chosen for showcases and serious collections.",
      metaTitle: "Graded Pokemon Slabs Canada | Coffee Break TCG",
      metaDescription: "Shop graded Pokemon slabs from PSA, CGC, SGC, TAG and Beckett with real photos, protective packaging and tracked Canadian shipping.",
      proof: ["Protected slabs", "Company and grade shown", "Clear photos", "Solid box shipping"],
      seoText: "The slabs page brings together graded cards ready to display or hold long term. We focus on grade, grading company, visual condition and the details that matter before buying.",
    },
    "/graded": {
      eyebrow: "Pokemon",
      title: "Slabs",
      intro: "Graded Pokemon cards from PSA, CGC, SGC, TAG and Beckett, chosen for showcases and serious collections.",
      metaTitle: "Graded Pokemon Slabs Canada | Coffee Break TCG",
      metaDescription: "Shop graded Pokemon slabs from PSA, CGC, SGC, TAG and Beckett with real photos, protective packaging and tracked Canadian shipping.",
      proof: ["Protected slabs", "Company and grade shown", "Clear photos", "Solid box shipping"],
      seoText: "The slabs page brings together graded cards ready to display or hold long term. We focus on grade, grading company, visual condition and the details that matter before buying.",
    },
    "/sealed": {
      eyebrow: "Pokemon",
      title: "Sealed",
      intro: "Pokemon sealed products for ripping, holding or planning the next drop: ETBs, packs, boxes and selected sealed items.",
      metaTitle: "Pokemon Sealed Products Canada | Coffee Break TCG",
      metaDescription: "Pokemon sealed products, ETBs, packs and boxes selected by Coffee Break TCG with protective packaging and tracked Canadian shipping.",
      proof: ["Seal checked", "Protected packaging", "Drops and preorders", "Tracked shipping"],
      seoText: "Sealed products speak to both patient collectors and people who want to rip with friends. We focus on product condition, shipping protection and items that make sense for a collection.",
    },
    "/one-piece": {
      eyebrow: "TCG",
      title: "One Piece",
      intro: "All available One Piece products: singles, slabs and boxes.",
      metaTitle: "One Piece TCG Canada | Coffee Break TCG",
      metaDescription: "Shop selected One Piece TCG singles, slabs and boxes from Coffee Break TCG with real photos and tracked Canadian shipping.",
      proof: ["Singles and slabs", "Real photos", "Curated stock", "Tracked shipping"],
      seoText: "One Piece TCG is treated like a real second showcase: clean hits, popular cards and product chosen for collectors who want something beyond Pokemon with the same Coffee Break care.",
    },
  },
};

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("active", button.dataset.language === currentLang);
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLang));
  });
  updateCategoryHeading();
  renderReviews();
  updateAccountButtons();
  updatePageMeta();
  if (document.body.classList.contains("account-mode")) renderAccount();
}

function categoryCopyForPath(pathname = window.location.pathname) {
  const directCopy = categoryPageCopy[currentLang]?.[pathname] || categoryPageCopy.fr[pathname];
  if (directCopy) return directCopy;
  const route = gameRoutes[pathname];
  if (route?.game !== "One Piece") return null;
  const base = categoryPageCopy[currentLang]?.["/one-piece"] || categoryPageCopy.fr["/one-piece"];
  const categoryName = productCategoryLabel({ category: route.category });
  const title = route.category === "all" ? base.title : `One Piece ${categoryName}`;
  const categoryNote =
    route.category === "Singles"
      ? currentLang === "en"
        ? "One Piece singles selected for collectors, with clear photos and tracked Canadian shipping."
        : "Singles One Piece sélectionnés pour les collectionneurs, avec photos claires et expédition suivie au Canada."
      : route.category === "Graded"
        ? currentLang === "en"
          ? "One Piece slabs and graded cards presented with the same Coffee Break care."
          : "Slabs et cartes gradées One Piece présentées avec le même soin Coffee Break."
        : currentLang === "en"
          ? "One Piece sealed boxes and product drops selected for collectors."
          : "Boîtes et produits One Piece scellés sélectionnés pour les collectionneurs.";
  return {
    ...base,
    title,
    intro: categoryNote,
    metaTitle: `${title} Canada | Coffee Break TCG`,
    metaDescription: categoryNote,
    seoText: categoryNote,
  };
}

function pageMetaForPath(pathname = window.location.pathname) {
  const routeCopy = categoryCopyForPath(pathname);
  if (routeCopy) {
    return {
      title: routeCopy.metaTitle || `${routeCopy.title} | Coffee Break TCG`,
      description: routeCopy.metaDescription || routeCopy.intro,
      url: `https://coffeebreaktcg.com${pathname}`,
    };
  }
  const contentMeta = {
    "/vendre": {
      title: currentLang === "en" ? "Sell Your Pokémon Cards | Coffee Break TCG" : "Vendre vos cartes Pokémon | Coffee Break TCG",
      description:
        currentLang === "en"
          ? "Submit a $1,000+ collection to Coffee Break TCG with photos, key cards and an asking price."
          : "Soumettez une collection de 1 000 $ et plus à Coffee Break TCG avec photos, cartes importantes et prix demandé.",
    },
    "/livraison": {
      title: currentLang === "en" ? "Shipping and Card Protection | Coffee Break TCG" : "Livraison et protection des cartes | Coffee Break TCG",
      description:
        currentLang === "en"
          ? "Tracked Canadian shipping from Laval with protective packaging adapted to singles, slabs and sealed products."
          : "Livraison suivie au Canada depuis Laval avec emballage protecteur adapté aux singles, slabs et produits sealed.",
    },
    "/faq": {
      title: "FAQ | Coffee Break TCG",
      description:
        currentLang === "en"
          ? "Answers about Coffee Break TCG shipping, card protection, payments, card shows and selling your collection."
          : "Réponses sur la livraison, la protection des cartes, le paiement, les card shows et la vente de collections Coffee Break TCG.",
    },
    "/apropos": {
      title: currentLang === "en" ? "About Coffee Break TCG | Laval, Quebec" : "À propos de Coffee Break TCG | Laval, Québec",
      description:
        currentLang === "en"
          ? "Coffee Break TCG is a Laval-based TCG shop built by collectors with a coffee shop vision for the future."
          : "Coffee Break TCG est une boutique TCG basée à Laval, bâtie par des collectionneurs avec une vision de coffee shop pour le futur.",
    },
  }[pathname];
  if (contentMeta) return { ...contentMeta, url: `https://coffeebreaktcg.com${pathname}` };
  if (pathname.match(/^\/produit\//)) {
    return {
      title: "Produit Pokémon | Coffee Break TCG",
      description: "Fiche produit Coffee Break TCG avec photos, détails, prix et expédition suivie au Canada.",
      url: `https://coffeebreaktcg.com${pathname}`,
    };
  }
  return {
    title: "Coffee Break TCG | Pokémon TCG",
    description: "Powered by coffee and cardboard. Premium Pokémon singles, slabs and sealed product from 2 guys, shipped across Canada.",
    url: "https://coffeebreaktcg.com/",
  };
}

function setMetaContent(selector, value) {
  const node = document.querySelector(selector);
  if (node && value) node.setAttribute("content", value);
}

function absoluteUrl(path) {
  if (!path) return "https://coffeebreaktcg.com/";
  if (/^https?:\/\//i.test(path)) return path;
  return `https://coffeebreaktcg.com${String(path).startsWith("/") ? path : `/${path}`}`;
}

function setStructuredData(payload) {
  const node = document.querySelector("#structuredData");
  if (!node) return;
  node.textContent = JSON.stringify(payload, null, 2);
}

function setRobots(indexable = true) {
  let node = document.querySelector('meta[name="robots"]');
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", "robots");
    document.head.appendChild(node);
  }
  node.setAttribute("content", indexable ? "index,follow" : "noindex,follow");
}

function trackShopEvent(name, details = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: name,
    source: "coffeebreaktcg",
    ...details,
    timestamp: new Date().toISOString(),
  });
}

function baseStructuredData(meta) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Coffee Break TCG",
      url: "https://coffeebreaktcg.com/",
      email: "coffeebreaktcg@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Laval",
        addressRegion: "QC",
        addressCountry: "CA",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Coffee Break TCG",
      url: "https://coffeebreaktcg.com/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://coffeebreaktcg.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Coffee Break TCG", item: "https://coffeebreaktcg.com/" },
        { "@type": "ListItem", position: 2, name: meta.title.replace(" | Coffee Break TCG", ""), item: meta.url },
      ],
    },
  ];
}

function updatePageMeta() {
  const meta = pageMetaForPath();
  const noindexPaths = new Set(["/checkout", "/compte", "/creer-compte", "/admin", "/jarvis"]);
  setRobots(!noindexPaths.has(window.location.pathname));
  document.title = meta.title;
  setMetaContent('meta[name="description"]', meta.description);
  setMetaContent('meta[property="og:title"]', meta.title);
  setMetaContent('meta[property="og:description"]', meta.description);
  setMetaContent('meta[property="og:url"]', meta.url);
  setMetaContent('meta[name="twitter:title"]', meta.title);
  setMetaContent('meta[name="twitter:description"]', meta.description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", meta.url);
  setStructuredData(baseStructuredData(meta));
}

function updateProductMeta(product) {
  if (!product) return;
  const category = productCategoryLabel(product);
  const descriptionParts = [
    product.name,
    product.setName,
    product.cardNumber ? `#${product.cardNumber}` : "",
    product.condition,
    product.gradingCompany && product.grade ? `${product.gradingCompany} ${product.grade}` : "",
  ].filter(Boolean);
  const description = `${descriptionParts.join(" - ")}. Produit inspecté, photos réelles quand disponibles et expédition suivie au Canada depuis le Québec.`;
  document.title = `${product.name} | ${category} | Coffee Break TCG`;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', `${product.name} | Coffee Break TCG`);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', `https://coffeebreaktcg.com${productDetailPath(product)}`);
  setMetaContent('meta[name="twitter:title"]', `${product.name} | Coffee Break TCG`);
  setMetaContent('meta[name="twitter:description"]', description);
  if (productImageUrl(product)) {
    setMetaContent('meta[property="og:image"]', productImageUrl(product));
    setMetaContent('meta[name="twitter:image"]', productImageUrl(product));
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `https://coffeebreaktcg.com${productDetailPath(product)}`);
  const isTestProduct = /(^codex-test-|test\s)/i.test(String(product.id || "")) || /(^codex-test-|test\s)/i.test(String(product.name || ""));
  setRobots(getProductStatus(product) !== "removed" && !isTestProduct);
  setStructuredData([
    ...baseStructuredData({ title: `${product.name} | Coffee Break TCG`, url: absoluteUrl(productDetailPath(product)) }),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: productGalleryImages(product).map(absoluteUrl),
      description,
      sku: product.sku || product.id,
      brand: { "@type": "Brand", name: productGame(product) === "One Piece" ? "One Piece Card Game" : "Pokémon" },
      category: productCategoryLabel(product),
      itemCondition: cardConditionCode(product) ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
      offers: {
        "@type": "Offer",
        url: absoluteUrl(productDetailPath(product)),
        priceCurrency: "CAD",
        price: roundMoney(product.price || 0).toFixed(2),
        availability: getProductStatus(product) === "available" || getProductStatus(product) === "preorder" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    },
  ]);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showTransitionLoader(label = currentLang === "en" ? "Loading" : "Chargement") {
  if (!languageLoader) return;
  languageLoader.querySelector("p").textContent = label;
  languageLoader.setAttribute("aria-hidden", "false");
  document.body.classList.add("language-loading");
}

function hideTransitionLoader() {
  if (!languageLoader) return;
  document.body.classList.remove("language-loading");
  languageLoader.setAttribute("aria-hidden", "true");
}

async function setLanguage(lang) {
  const nextLang = lang === "en" ? "en" : "fr";
  if (nextLang === currentLang) return;
  showTransitionLoader(nextLang === "en" ? "Loading" : "Chargement");
  await wait(260);
  currentLang = nextLang;
  localStorage.setItem("coffeeBreakLang", currentLang);
  applyTranslations();
  renderProducts();
  renderCart();
  if (window.location.pathname.match(/^\/(vendre|livraison|faq|apropos)$/)) {
    renderContentPage(window.location.pathname.slice(1));
  }
  await wait(240);
  hideTransitionLoader();
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Erreur serveur");
  return payload;
}

function getDeal(product) {
  return (product.features || []).slice(0, product.category === "Singles" ? 1 : 2);
}

function isRecentProduct(product) {
  const created = new Date(product.createdAt || product.updatedAt || 0).getTime();
  return Number.isFinite(created) && Date.now() - created < 1000 * 60 * 60 * 24 * 21;
}

function productBadge(product) {
  if (product.badge) return product.badge;
  if (product.category === "Sealed" && Number(product.stock || 0) === 1 && getProductStatus(product) === "available") return "Dernier exemplaire";
  if (product.featured) return "En vedette";
  if (isRecentProduct(product)) return "Nouveau";
  return "";
}

function cardConditionCode(product) {
  const condition = String(product.condition || "").toLowerCase();
  if (condition.includes("damaged") || condition.includes("damage")) return "Damaged";
  if (condition.includes("moderately") || condition.includes(" mp") || condition.includes("- mp")) return "MP";
  if (condition.includes("lightly") || condition.includes("light play") || condition.includes(" lp") || condition.includes("- lp")) return "LP";
  if (condition.includes("near mint") || condition.includes("mint") || condition.includes(" nm") || condition.includes("- nm")) return "NM";
  return product.category === "Singles" ? "NM" : "";
}

function tagClass(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productPills(product, features) {
  const condition = cardConditionCode(product);
  const pills = [];
  if (condition) pills.push(`<span class="condition-pill tag-${tagClass(condition)}">${condition}</span>`);
  const badge = productBadge(product);
  if (badge) pills.push(`<span class="market-pill badge-pill tag-${tagClass(badge)}">${escapeAttribute(badge)}</span>`);
  pills.push(...features.map((feature) => `<span class="market-pill tag-${tagClass(feature)}">${feature}</span>`));
  return pills.join("");
}

function conditionDetailLabel(product) {
  const code = cardConditionCode(product);
  const labels = {
    NM: "Near Mint",
    LP: "Lightly Played",
    MP: "Moderately Played",
    Damaged: "Heavily Played / Damaged",
  };
  if (code) return `${labels[code] || code} (${code})`;
  const rawCondition = String(product.condition || "");
  const conditionLower = rawCondition.toLowerCase();
  if (conditionLower.includes("scell")) {
    if (conditionLower.includes("endommag")) return currentLang === "en" ? "Sealed damaged" : "Scellé endommagé";
    if (conditionLower.includes("parfait")) return currentLang === "en" ? "Sealed perfect" : "Scellé parfait";
    return currentLang === "en" ? "Sealed" : "Scellé";
  }
  return product.condition || "";
}

function getProductStatus(product) {
  if (product.category === "Preorder") return "preorder";
  if (product.status === "reserved" || (Number(product.stock || 0) <= 0 && Number(product.reservedQuantity || 0) > 0)) return "reserved";
  if (Number(product.stock || 0) <= 0) return "sold";
  if (product.status && product.status !== "available") return product.status;
  return Number(product.stock || 0) > 0 ? "available" : "sold";
}

function statusLabel(status) {
  return (
    {
      available: "Disponible",
      preorder: "Précommande",
      "low-stock": "Disponible",
      reserved: "Réservé",
      sold: "Vendu",
      draft: "En session",
      admin_draft: "Brouillon",
      removed: "Retiré",
      pending_payment: "En attente",
      expired: "Expirée",
      paid: "Payée",
      cancelled: "Annulée",
      admin_sale: "Vente admin",
    }[status] || "Disponible"
  );
}

function sortNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function conditionRank(product) {
  return { Damaged: 1, MP: 2, LP: 3, NM: 4 }[cardConditionCode(product)] || 0;
}

function statusRank(product) {
  return { available: 3, preorder: 2, reserved: 1, sold: 0 }[getProductStatus(product)] || 0;
}

function productGrade(product) {
  return Number(product.grade || 0) || 0;
}

function originalOrder(a, b) {
  return inventory.indexOf(a) - inventory.indexOf(b);
}

function getProducts() {
  let products = inventory.filter((product) => {
    if (["Preorder"].includes(product.category)) return false;
    if (getProductStatus(product) === "reserved") return false;
    const matchesGame = state.game === "all" || productGame(product) === state.game;
    const matchesCategory =
      state.category === "all" ||
      product.category === state.category ||
      (state.category === "new" && isRecentProduct(product)) ||
      (state.category === "sale" && isSaleProduct(product)) ||
      (state.category === "featured" && isHomepageFeatured(product));
    const matchesType = state.typeFilter === "all" || product.kind === state.typeFilter || product.visual === state.typeFilter;
    const matchesSet = state.setFilter === "all" || product.setId === state.setFilter || product.setName === state.setFilter;
    const conditionCode = cardConditionCode(product);
    const matchesCondition =
      state.conditionFilter === "all" ||
      conditionCode === state.conditionFilter ||
      (state.conditionFilter === "sealed" && String(product.condition || product.category || "").toLowerCase().includes("scell"));
    const matchesAvailability =
      state.availabilityFilter === "all" ||
      (state.availabilityFilter === "available" && getProductStatus(product) === "available") ||
      (state.availabilityFilter === "sale" && isSaleProduct(product)) ||
      (state.availabilityFilter === "new" && isRecentProduct(product));
    const haystack = `${product.name} ${product.category} ${product.condition} ${conditionCode} ${product.kind || ""} ${product.sku || ""} ${product.setName || ""} ${product.cardNumber || ""} ${product.rarity || ""} ${(product.features || []).join(" ")}`.toLowerCase();
    const query = state.search.toLowerCase().trim();
    const searchableTokens = haystack.split(/[^a-z0-9]+/).filter(Boolean);
    const matchesSearch = ["nm", "lp", "mp"].includes(query) ? searchableTokens.includes(query) : haystack.includes(query);
    return matchesGame && matchesCategory && matchesType && matchesSet && matchesCondition && matchesAvailability && matchesSearch;
  });

  products = [...products].sort((a, b) => {
    if (state.sort === "priceAsc") return sortNumber(a.price) - sortNumber(b.price) || originalOrder(a, b);
    if (state.sort === "priceDesc") return sortNumber(b.price) - sortNumber(a.price) || originalOrder(a, b);
    if (state.sort === "marketAsc") return sortNumber(a.market) - sortNumber(b.market) || originalOrder(a, b);
    if (state.sort === "marketDesc") return sortNumber(b.market) - sortNumber(a.market) || originalOrder(a, b);
    if (state.sort === "gradeDesc") return productGrade(b) - productGrade(a) || sortNumber(b.price) - sortNumber(a.price) || originalOrder(a, b);
    if (state.sort === "conditionDesc") return conditionRank(b) - conditionRank(a) || sortNumber(b.price) - sortNumber(a.price) || originalOrder(a, b);
    if (state.sort === "recent") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || originalOrder(a, b);
    if (state.sort === "nameAsc") return a.name.localeCompare(b.name, "fr-CA") || originalOrder(a, b);
    if (state.sort === "nameDesc") return b.name.localeCompare(a.name, "fr-CA") || originalOrder(a, b);
    if (state.sort === "stockDesc") return statusRank(b) - statusRank(a) || sortNumber(b.stock) - sortNumber(a.stock) || originalOrder(a, b);
    return Number(b.featured === true) - Number(a.featured === true) || originalOrder(a, b);
  });

  return products;
}

function visualClass(product) {
  return `${product.visual === "graded" ? "graded" : ""} ${product.visual === "boxed" ? "boxed" : ""}`;
}

function isSlabProduct(product) {
  return product.category === "Graded" || product.kind === "slab" || product.visual === "graded" || Boolean(product.gradingCompany);
}

function productGame(product) {
  const value = String(product.game || product.franchise || "").trim();
  if (/one\s*piece/i.test(value)) return "One Piece";
  return "Pokemon";
}

function slabCompanyClass(product) {
  const company = String(product.gradingCompany || "PSA").toLowerCase();
  if (company.includes("beckett") || company.includes("bgs")) return "slab-beckett";
  if (company.includes("tag")) return "slab-tag";
  if (company.includes("cgc")) return "slab-cgc";
  if (company.includes("sgc")) return "slab-sgc";
  return "slab-psa";
}

function slabLabel(product) {
  const company = product.gradingCompany || "PSA";
  const grade = product.grade ? `${product.grade}` : "";
  const gradeText = Number(grade) >= 10 ? "Gem Mint" : grade ? "Graded" : "Authentic";
  return `
    <span class="slab-brand">${escapeAttribute(company)}</span>
    <small>${escapeAttribute(gradeText)}</small>
    ${grade ? `<strong>${escapeAttribute(grade)}</strong>` : ""}
    <em>CB${String(product.cardNumber || product.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}</em>
  `;
}

const sealedFallbackImages = [
  { match: ["ascended heroes"], image: "/assets/sealed-ascended-heroes-etb.jpg" },
  { match: ["151", "elite trainer"], image: "/assets/sealed-151-etb.webp" },
  { match: ["scarlet", "violet", "151"], image: "/assets/sealed-151-etb.webp" },
  { match: ["lost origin"], image: "/assets/sealed-lost-origin-booster-box.webp" },
  { match: ["twilight masquerade"], image: "/assets/sealed-twilight-masquerade-booster-bundle.png" },
  { match: ["surging sparks"], image: "/assets/sealed-surging-sparks-pack.png" },
];

const sealedFallbackGallery = [
  { match: ["ascended heroes"], images: ["/assets/sealed-ascended-heroes-etb.jpg", "/assets/sealed-ascended-heroes-etb-back.jpg"] },
  { match: ["151", "elite trainer"], images: ["/assets/sealed-151-etb.webp", "/assets/sealed-151-etb-back.webp"] },
  { match: ["scarlet", "violet", "151"], images: ["/assets/sealed-151-etb.webp", "/assets/sealed-151-etb-back.webp"] },
];

function sealedFallbackImage(product) {
  if (!["Sealed", "Preorder"].includes(product.category) && product.visual !== "boxed") return "";
  const haystack = `${product.name || ""} ${product.setName || ""} ${product.condition || ""} ${product.kind || ""}`.toLowerCase();
  return sealedFallbackImages.find((entry) => entry.match.every((term) => haystack.includes(term)))?.image || "";
}

function isSetLogoImage(imageUrl) {
  return /scrydex\.com\/pokemon\/.+\/(logo|symbol)$/i.test(imageUrl) || /\/(logo|symbol)(\?|$)/i.test(imageUrl);
}

function sealedFallbackGalleryImages(product) {
  if (!["Sealed", "Preorder"].includes(product.category) && product.visual !== "boxed") return [];
  const haystack = `${product.name || ""} ${product.setName || ""} ${product.condition || ""} ${product.kind || ""}`.toLowerCase();
  return sealedFallbackGallery.find((entry) => entry.match.every((term) => haystack.includes(term)))?.images || [];
}

function productImageUrl(product) {
  const imageUrl = product.imageUrl || "";
  if (imageUrl && !isSetLogoImage(imageUrl)) return imageUrl;
  return sealedFallbackImage(product);
}

function productGalleryImages(product) {
  const images = [
    productImageUrl(product),
    ...sealedFallbackGalleryImages(product),
    ...(product.galleryImages || []).filter((image) => !isSetLogoImage(image)),
  ].filter(Boolean);
  return [...new Set(images)].slice(0, 5);
}

function productVisual(product) {
  if (isSlabProduct(product)) {
    const imageUrl = productImageUrl(product);
    const visual = imageUrl
      ? `<img class="product-photo" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(product.name)}" />`
      : `<span class="card-visual graded ${visualClass(product)}" aria-hidden="true"></span>`;
    return `
      <span class="slab-frame ${slabCompanyClass(product)}">
        <span class="slab-label">${slabLabel(product)}</span>
        <span class="slab-window">${visual}</span>
      </span>
    `;
  }
  const imageUrl = productImageUrl(product);
  if (imageUrl) {
    const sealedClass = sealedFallbackImage(product) === imageUrl ? " sealed-product-photo" : "";
    return `<img class="product-photo${sealedClass}" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(product.name)}" />`;
  }
  return `<span class="card-visual ${visualClass(product)}" aria-hidden="true"></span>`;
}

function cartVisual(product) {
  if (isSlabProduct(product)) {
    const imageUrl = productImageUrl(product);
    const visual = imageUrl
      ? `<img src="${escapeAttribute(imageUrl)}" alt="" />`
      : `<span class="card-visual graded ${visualClass(product)}" aria-hidden="true"></span>`;
    return `<span class="cart-slab-thumb">${visual}</span>`;
  }
  const imageUrl = productImageUrl(product);
  if (imageUrl) {
    return `<img class="cart-photo-thumb" src="${escapeAttribute(imageUrl)}" alt="" />`;
  }
  return productVisual(product);
}

function compactVisual(product) {
  if (isSlabProduct(product)) {
    const imageUrl = productImageUrl(product);
    const visual = imageUrl
      ? `<img src="${escapeAttribute(imageUrl)}" alt="" />`
      : `<span class="card-visual graded ${visualClass(product)}" aria-hidden="true"></span>`;
    return `<span class="compact-slab-thumb">${visual}</span>`;
  }
  const imageUrl = productImageUrl(product);
  if (imageUrl) {
    const sealedClass = sealedFallbackImage(product) === imageUrl ? " sealed-product-photo" : "";
    return `<img class="compact-photo-thumb${sealedClass}" src="${escapeAttribute(imageUrl)}" alt="" />`;
  }
  return productVisual(product);
}

function productCategoryLabel(product) {
  return (
    {
      Singles: "Singles",
      Graded: "Slabs",
      Sealed: "Sealed",
      Preorder: "Précommande",
      Accessories: "Accessoires",
    }[product.category] || product.category
  );
}

function productDetailPath(product) {
  return `/produit/${product.id}`;
}

function categoryPath(category, game = state.game) {
  if (game === "One Piece") {
    if (category === "Singles") return "/one-piece/singles";
    if (category === "Graded") return "/one-piece/slabs";
    if (category === "Sealed") return "/one-piece/box";
    return "/one-piece";
  }
  if (category === "Graded") return "/slabs";
  return Object.entries(categoryRoutes).find(([, value]) => value === category)?.[0] || "/";
}

function resetShopFiltersForRoute({ keepSearch = false } = {}) {
  state.typeFilter = "all";
  state.setFilter = "all";
  state.conditionFilter = "all";
  state.availabilityFilter = "available";
  if (!keepSearch) state.search = "";
  if (searchInput) searchInput.value = state.search;
  if (searchOverlayInput) searchOverlayInput.value = state.search;
  if (setFilterSelect) setFilterSelect.value = "all";
  if (conditionFilterSelect) conditionFilterSelect.value = "all";
  if (availabilityFilterSelect) availabilityFilterSelect.value = "available";
}

function setShopSearch(value, { scroll = false } = {}) {
  state.search = String(value || "").trim();
  if (searchInput) searchInput.value = state.search;
  if (searchOverlayInput) searchOverlayInput.value = state.search;
  renderProducts();
  if (scroll) scrollToShopItems("smooth");
}

function saveShopView(productId = "") {
  lastShopView = {
    category: state.category,
    game: state.game,
    typeFilter: state.typeFilter,
    setFilter: state.setFilter,
    conditionFilter: state.conditionFilter,
    availabilityFilter: state.availabilityFilter,
    search: state.search,
    sort: state.sort,
    scrollY: window.scrollY,
    productId,
  };
  sessionStorage.setItem("coffeeBreakLastShopView", JSON.stringify(lastShopView));
}

function restoreShopView() {
  const view = lastShopView || JSON.parse(sessionStorage.getItem("coffeeBreakLastShopView") || "null");
  if (!view) {
    goToCategory(state.category || "all");
    return;
  }
  state.category = view.category || "all";
  state.game = view.game || "Pokemon";
  state.typeFilter = view.typeFilter || "all";
  state.setFilter = view.setFilter || "all";
  state.conditionFilter = view.conditionFilter || "all";
  state.availabilityFilter = view.availabilityFilter || "available";
  state.search = view.search || "";
  state.sort = view.sort || "featured";
  if (searchInput) searchInput.value = state.search;
  if (sortSelect) sortSelect.value = state.sort;
  if (setFilterSelect) setFilterSelect.value = state.setFilter;
  if (conditionFilterSelect) conditionFilterSelect.value = state.conditionFilter;
  if (availabilityFilterSelect) availabilityFilterSelect.value = state.availabilityFilter;
  history.pushState({ category: state.category }, "", categoryPath(state.category));
  applyRoute();
  requestAnimationFrame(() => {
    const card = view.productId ? document.querySelector(`[data-product-card="${CSS.escape(view.productId)}"]`) : null;
    if (card) card.scrollIntoView({ block: "center" });
    else window.scrollTo({ top: Number(view.scrollY || 0), behavior: "auto" });
  });
}

function cartProduct(id) {
  return inventory.find((product) => product.id === id);
}

function cartLineLimit(product) {
  const stock = Math.max(0, Number(product?.stock || 0));
  const maxPerCart = Number(product?.maxPerCart || 0);
  return maxPerCart > 0 ? Math.min(stock, maxPerCart) : stock;
}

function saveCart() {
  cart = cart
    .map((item) => {
      const product = cartProduct(item.id);
      if (!product) return null;
      const quantity = Math.min(Math.max(1, Number(item.quantity || 1)), cartLineLimit(product));
      return quantity > 0 ? { id: item.id, quantity } : null;
    })
    .filter(Boolean);
  localStorage.setItem("coffeeBreakCart", JSON.stringify(cart));
  renderCart();
}

function cartQuantity() {
  return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const product = cartProduct(item.id);
    return sum + Number(product?.price || 0) * Number(item.quantity || 0);
  }, 0);
}

function cartCompareAtTotal() {
  return cart.reduce((sum, item) => {
    const product = cartProduct(item.id);
    const oldPrice = Number(product?.compareAtPrice || 0);
    const price = Number(product?.price || 0);
    const referencePrice = oldPrice > price ? oldPrice : price;
    return sum + referencePrice * Number(item.quantity || 0);
  }, 0);
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function priceMarkup(product, className = "price") {
  const price = Number(product.price || 0);
  const oldPrice = Number(product.compareAtPrice || 0);
  const oldPriceMarkup = oldPrice > price ? `<span class="old-price">${money.format(oldPrice)}</span>` : "";
  return `<span class="${className}"><span class="current-price">${money.format(price)}</span>${oldPriceMarkup}</span>`;
}

function cartTaxes() {
  const subtotal = roundMoney(cartTotal());
  const compareAtSubtotal = roundMoney(cartCompareAtTotal());
  const discount = roundMoney(Math.max(0, compareAtSubtotal - subtotal));
  const tps = roundMoney(subtotal * 0.05);
  const tvq = roundMoney(subtotal * 0.09975);
  return {
    subtotal,
    compareAtSubtotal,
    discount,
    shipping: 0,
    taxableSubtotal: subtotal,
    tps,
    tvq,
    total: roundMoney(subtotal + tps + tvq),
  };
}

function totalsBreakdownMarkup(totals, compact = false) {
  const shippingNote = totals.shipping > 0 ? money.format(totals.shipping) : t("deliveryNotCharged");
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  const progressText =
    totals.subtotal >= FREE_SHIPPING_THRESHOLD
      ? t("freeShippingProgress")
      : t("freeShippingRemaining").replace("{amount}", money.format(remainingForFreeShipping));
  return `
    <div><span>${t("subtotal")}</span><strong>${money.format(totals.compareAtSubtotal || totals.subtotal)}</strong></div>
    ${totals.discount > 0 ? `<div class="discount-total"><span>${t("discount")}</span><strong>-${money.format(totals.discount)}</strong></div>` : ""}
    <div><span>${t("delivery")}</span><strong>${shippingNote}</strong></div>
    <div><span>TPS</span><strong>${money.format(totals.tps)}</strong></div>
    <div><span>TVQ</span><strong>${money.format(totals.tvq)}</strong></div>
    <div class="grand-total"><span>${t("total")}</span><strong>${money.format(totals.total)}</strong></div>
    ${compact ? "" : `<p class="cart-progress">${progressText}</p>`}
  `;
}

function renderCartLine(item, compact = false) {
  const product = cartProduct(item.id);
  if (!product) return "";
  const quantity = Number(item.quantity || 1);
  const limit = cartLineLimit(product);
  return `
    <div class="cart-item">
      <div class="cart-product">
        <span class="cart-thumb">${cartVisual(product)}</span>
        <div>
          <strong>${product.name}</strong>
          <span>${[product.setName, product.cardNumber ? `#${product.cardNumber}` : "", product.condition].filter(Boolean).join(" - ")}</span>
          <span>${money.format(product.price)} x ${quantity}</span>
        </div>
      </div>
      ${
        compact
          ? `<strong>${money.format(Number(product.price || 0) * quantity)}</strong>`
          : `<div class="qty-controls">
              <button type="button" data-cart-qty="${product.id}" data-delta="-1">-</button>
              <span>${quantity}</span>
              <button type="button" data-cart-qty="${product.id}" data-delta="1" ${quantity >= limit ? "disabled" : ""}>+</button>
              <button class="text-button" type="button" data-cart-remove="${product.id}">${t("remove")}</button>
            </div>`
      }
    </div>
  `;
}

function renderCart() {
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = cartQuantity();
  });
  const isEmpty = cart.length === 0;
  document.body.classList.toggle("cart-empty", isEmpty);
  const totals = cartTaxes();
  const drawerTotalMarkup = totalsBreakdownMarkup(totals);
  const totalMarkup = totalsBreakdownMarkup(totals);
  const emptyCheckoutMarkup = `
    <div class="checkout-empty-state">
      <p class="eyebrow">${currentLang === "en" ? "Checkout" : "Commande"}</p>
      <h2>${currentLang === "en" ? "Your cart is taking a break." : "Ton panier prend une pause."}</h2>
      <p>${currentLang === "en" ? "Add a few cards before heading to checkout." : "Ajoute quelques cartes avant de passer à la caisse."}</p>
      <div>
        <a class="button primary" href="/#new-arrivals" data-home-section="new-arrivals">${currentLang === "en" ? "View new arrivals" : "Voir les nouveautés"}</a>
        <a class="button secondary" href="/" data-home-link>${currentLang === "en" ? "Back to shop" : "Retour boutique"}</a>
      </div>
    </div>
  `;
  if (cartItems) {
    cartItems.innerHTML = cart.length ? cart.map((item) => renderCartLine(item)).join("") : `<p>${t("cartEmpty")}</p>`;
  }
  if (cartTotals) cartTotals.innerHTML = cart.length ? drawerTotalMarkup : "";
  if (checkoutItems) {
    checkoutItems.innerHTML = cart.length ? cart.map((item) => renderCartLine(item, true)).join("") : emptyCheckoutMarkup;
  }
  if (checkoutTotals) checkoutTotals.innerHTML = cart.length ? totalMarkup : "";
  if (checkoutForm) checkoutForm.hidden = isEmpty;
}

function addToCart(id) {
  const product = cartProduct(id);
  if (!product) return;
  if (getProductStatus(product) === "reserved") return;
  const limit = cartLineLimit(product);
  if (limit <= 0) return;
  const shouldOpenCart = cartQuantity() === 0;
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity = Math.min(limit, Number(existing.quantity || 1) + 1);
  else cart.push({ id, quantity: 1 });
  saveCart();
  trackShopEvent("add_to_cart", {
    product_id: product.id,
    category: product.category,
    game: productGame(product),
    value: Number(product.price || 0),
    cart_quantity: cartQuantity(),
  });
  if (shouldOpenCart) {
    document.body.classList.add("cart-open");
    document.querySelector(".cart-drawer")?.setAttribute("aria-hidden", "false");
  }
}

function updateCartQuantity(id, delta) {
  const item = cart.find((line) => line.id === id);
  const product = cartProduct(id);
  if (!item || !product) return;
  item.quantity = Math.min(cartLineLimit(product), Math.max(0, Number(item.quantity || 1) + delta));
  if (item.quantity <= 0) cart = cart.filter((line) => line.id !== id);
  saveCart();
  trackShopEvent(item.quantity <= 0 ? "remove_from_cart" : "change_cart_quantity", {
    product_id: id,
    delta,
    cart_quantity: cartQuantity(),
  });
}

async function loadProducts() {
  try {
    const payload = await api("/api/products");
    inventory = payload.products;
    populateSetFilter();
  } catch {
    // Keep local starter inventory if the API is unavailable.
  }
}

async function loadCurrentUser() {
  try {
    const payload = await api("/api/me");
    currentUser = payload.user || null;
  } catch {
    currentUser = null;
  }
  updateAccountButtons();
  fillCheckoutFromProfile();
  renderCart();
  return currentUser;
}

async function loadCustomerOrders() {
  if (!currentUser) {
    customerOrders = [];
    return customerOrders;
  }
  try {
    const payload = await api("/api/my-orders");
    customerOrders = payload.orders || [];
  } catch {
    customerOrders = [];
  }
  return customerOrders;
}

function updateAccountButtons() {
  document.querySelectorAll("[data-account-link]").forEach((link) => {
    link.setAttribute("aria-label", currentUser ? `${t("account")} - ${currentUser.name}` : t("account"));
    link.classList.toggle("is-active", Boolean(currentUser));
  });
}

function showWelcomeToast(user) {
  if (!welcomeToast || !user) return;
  const name = user.name || user.email || "";
  const label = welcomeToast.querySelector("strong");
  if (label) label.textContent = `${currentLang === "en" ? "Welcome" : "Bienvenue"} ${name}`;
  welcomeToast.setAttribute("aria-hidden", "false");
  window.clearTimeout(showWelcomeToast.timeoutId);
  showWelcomeToast.timeoutId = window.setTimeout(() => {
    welcomeToast.setAttribute("aria-hidden", "true");
  }, 2600);
}

function fillCheckoutFromProfile() {
  if (!checkoutForm || !currentUser?.address) return;
  const address = currentUser.address;
  const values = {
    name: address.name || currentUser.name || "",
    email: address.email || currentUser.email || "",
    phone: address.phone || "",
    address: address.address || "",
    city: address.city || "",
    province: address.province || "QC",
    postal: address.postal || "",
    notes: address.notes || "",
  };
  Object.entries(values).forEach(([name, value]) => {
    const input = checkoutForm.elements[name];
    if (input && !input.value) input.value = value;
  });
}

function openAccountModal() {
  if (!accountModal) return;
  closeDrawers();
  accountModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("account-modal-open");
  requestAnimationFrame(() => accountModal.querySelector('input[name="email"]')?.focus());
}

function closeAccountModal() {
  accountModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("account-modal-open");
}

function populateSetFilter() {
  if (!setFilterSelect) return;
  const current = setFilterSelect.value || state.setFilter || "all";
  const sets = [...new Map(inventory.filter((product) => product.setName || product.setId).map((product) => [product.setId || product.setName, product.setName || product.setId])).entries()]
    .sort((a, b) => String(a[1]).localeCompare(String(b[1]), "fr-CA"));
  setFilterSelect.innerHTML = [`<option value="all">Toutes les extensions</option>`, ...sets.map(([value, label]) => `<option value="${escapeAttribute(value)}">${escapeAttribute(label)}</option>`)].join("");
  setFilterSelect.value = sets.some(([value]) => value === current) ? current : "all";
}

async function loadCardShows() {
  try {
    const payload = await api("/api/card-shows");
    cardShows = payload.cardShows || [];
  } catch {
    cardShows = [];
  }
}

async function loadReviews() {
  try {
    const payload = await api("/api/reviews");
    reviews = payload.reviews || [];
  } catch {
    reviews = [];
  }
}

async function loadNewArrivalSlides() {
  try {
    const payload = await api("/api/new-arrival-slides");
    newArrivalSlides = payload.slides || [];
  } catch {
    newArrivalSlides = [];
  }
}

function reviewStars(rating) {
  const count = Math.max(1, Math.min(5, Number(rating || 5)));
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function formatReviewDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(currentLang === "en" ? "en-CA" : "fr-CA", { month: "short", year: "numeric" });
}

function renderReviews() {
  if (reviewSection) reviewSection.innerHTML = "";
  renderTrustStrip();
}

function trustMarqueeItems() {
  const trustSignals =
    currentLang === "en"
      ? [
          "By collectors",
          "Real photos",
          "Clear deals",
          "Carefully packed",
          "Tracked shipping",
          "Stock we actually like",
          "We buy too",
          "Coffee shop vision",
        ]
      : [
          "Par des collectionneurs",
          "Photos réelles",
          "Deals clairs",
          "Emballage soigné",
          "Expédition suivie",
          "Stock qu’on aime pour vrai",
          "On achète aussi",
          "Vision coffee shop",
        ];
  const signals = trustSignals.map((text) => ({
    text,
    isSignal: true,
  }));
  const items = signals;
  return [...items, ...items, ...items];
}

function renderTrustStrip() {
  if (!trustStrip) return;
  const items = trustMarqueeItems();
  trustStrip.innerHTML = `
    <div class="trust-track" aria-label="${currentLang === "en" ? "Coffee Break promises" : "Promesses Coffee Break"}">
      ${items
        .map((item) => {
          return `
            <span class="trust-review-chip is-signal">
              <span class="trust-review-text">${escapeAttribute(item.text)}</span>
            </span>
          `;
        })
        .join("")}
    </div>
  `;
}

function formatShowDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-CA", { dateStyle: "long" });
}

function formatShowDateRange(show) {
  const start = formatShowDate(show.date);
  const end = formatShowDate(show.dateEnd);
  return end && end !== start ? `${start} au ${end}` : start;
}

function formatShowDateBadge(show) {
  if (!show?.date) return { day: "--", month: currentLang === "en" ? "TBC" : "À CONF." };
  const date = new Date(`${show.date}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { day: show.date, month: "" };
  return {
    day: date.toLocaleDateString("fr-CA", { day: "2-digit" }),
    month: date.toLocaleDateString(currentLang === "en" ? "en-CA" : "fr-CA", { month: "short" }).replace(".", ""),
  };
}

function showAddress(show) {
  return [show.location, show.city].filter(Boolean).join(", ");
}

function showMapUrl(show) {
  const query = showAddress(show) || show.name || "CoffeeBreakTCG";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function showMapsLink(show) {
  const query = showAddress(show) || show.name || "CoffeeBreakTCG";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function showDateLine(show) {
  return [formatShowDateRange(show), show.time].filter(Boolean).join(" · ") || (currentLang === "en" ? "To be confirmed" : "À confirmer");
}

function renderShowListItem(show, index) {
  const badge = formatShowDateBadge(show);
  const address = showAddress(show);
  const open = index === 0 ? " open" : "";
  return `
    <details class="show-accordion-item"${open}>
      <summary>
        <span class="show-mini-date">
          <strong>${escapeAttribute(badge.day)}</strong>
          <small>${escapeAttribute(badge.month)}</small>
        </span>
        <span class="show-mini-main">
          <strong>${escapeAttribute(show.name)}</strong>
          <small>${escapeAttribute(address || (currentLang === "en" ? "Location to confirm" : "Lieu à confirmer"))}</small>
        </span>
        <span class="show-mini-time">${escapeAttribute(show.time || (currentLang === "en" ? "TBC" : "À confirmer"))}</span>
      </summary>
      <div class="show-accordion-panel">
        ${show.tables ? `<p>${escapeAttribute(show.tables)}</p>` : ""}
        ${show.collaborator ? `<p>${currentLang === "en" ? "With" : "Avec"} ${escapeAttribute(show.collaborator)}</p>` : ""}
        <div class="show-accordion-actions">
          <a href="${escapeAttribute(showMapsLink(show))}" target="_blank" rel="noopener">${currentLang === "en" ? "Open in Maps" : "Ouvrir dans Maps"}</a>
          ${show.announcementUrl ? `<a href="${escapeAttribute(show.announcementUrl)}" target="_blank" rel="noopener">${currentLang === "en" ? "View announcement" : "Voir l’annonce"}</a>` : ""}
        </div>
      </div>
    </details>
  `;
}

function renderCardShows() {
  if (!cardShowsGrid) return;
  const section = cardShowsGrid.closest(".shows-section");
  section?.classList.toggle("hidden", cardShows.length === 0);
  if (!cardShows.length) {
    cardShowsGrid.innerHTML = "";
    return;
  }
  const sortedShows = [...cardShows].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
  const nextShow = sortedShows[0];
  const badge = formatShowDateBadge(nextShow);
  const address = showAddress(nextShow);
  const showMedia = nextShow.imageUrl
    ? `<img src="${escapeAttribute(nextShow.imageUrl)}" alt="${escapeAttribute(nextShow.name)}" loading="lazy" />`
    : `<div class="next-show-fallback" aria-hidden="true">
        <strong>CBTCG</strong>
        <span>${currentLang === "en" ? "Card show" : "Card show"}</span>
      </div>
      <iframe title="${escapeAttribute(nextShow.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${escapeAttribute(showMapUrl(nextShow))}"></iframe>`;
  cardShowsGrid.innerHTML = `
    <div class="show-experience">
      <article class="next-show-card">
        <div class="next-show-copy">
          <span class="next-stop-pill">${currentLang === "en" ? "Next stop" : "Prochain arrêt"}</span>
          <div class="next-show-main">
            <div class="next-show-date">
              <strong>${escapeAttribute(badge.day)}</strong>
              <small>${escapeAttribute(badge.month)}</small>
            </div>
            <div>
              <p class="next-show-day">${escapeAttribute(showDateLine(nextShow))}</p>
              <h3>${escapeAttribute(nextShow.name)}</h3>
            </div>
          </div>
          <div class="next-show-details">
            <p><span aria-hidden="true">•</span> ${escapeAttribute(address || (currentLang === "en" ? "Location to confirm" : "Lieu à confirmer"))}</p>
            ${nextShow.tables ? `<p><span aria-hidden="true">•</span> ${escapeAttribute(nextShow.tables)}</p>` : ""}
            ${nextShow.collaborator ? `<p><span aria-hidden="true">•</span> ${currentLang === "en" ? "With" : "Avec"} ${escapeAttribute(nextShow.collaborator)}</p>` : ""}
          </div>
          <div class="next-show-actions">
            <a class="next-show-button" href="${escapeAttribute(nextShow.announcementUrl || showMapsLink(nextShow))}" target="_blank" rel="noopener">${currentLang === "en" ? "Reserve for booth pickup" : "Réserver pour pickup au booth"}</a>
            <a class="next-show-map-link" href="${escapeAttribute(showMapsLink(nextShow))}" target="_blank" rel="noopener">${currentLang === "en" ? "Open in Maps" : "Ouvrir dans Maps"}</a>
          </div>
        </div>
        <div class="next-show-map ${nextShow.imageUrl ? "has-photo" : "has-map"}">
          ${showMedia}
        </div>
      </article>
      <div class="show-accordion-list">
        ${sortedShows.map(renderShowListItem).join("")}
      </div>
    </div>
  `;
  observeDynamicElements();
}

async function loadPokemonSets() {
  if (!pokemonSetSelect) return;
  const game = productGameSelect?.value || "Pokemon";
  try {
    const payload = await api(`/api/admin/sets?game=${encodeURIComponent(game)}`);
    pokemonSetSelect.innerHTML = [
      `<option value="">Choisir une extension</option>`,
      ...(payload.sets || []).map(
        (set) =>
          `<option value="${set.id}" data-name="${set.name}">${set.name}${set.releaseDate ? ` - ${set.releaseDate}` : ""}</option>`
      ),
    ].join("");
  } catch {
    pokemonSetSelect.innerHTML = `<option value="">Extension a confirmer</option>`;
  }
}

function updateCategoryHeading() {
  const routeCopy = categoryCopyForPath();
  if (routeCopy) {
    if (categoryTitle) categoryTitle.textContent = routeCopy.title;
    if (categoryEyebrow) categoryEyebrow.textContent = routeCopy.eyebrow;
    if (categoryIntro) categoryIntro.textContent = routeCopy.intro;
    renderCategorySeoPanel(routeCopy);
    return;
  }
  const label = categoryLabels[state.category];
  if (categoryTitle) categoryTitle.textContent = typeof label === "function" ? label() : label || t("availableCards");
  if (categoryEyebrow) {
    categoryEyebrow.textContent = state.category === "all" ? t("inventory") : typeof label === "function" ? label() : productCategoryLabel({ category: state.category });
  }
  if (categoryIntro) categoryIntro.textContent = currentLang === "en" ? "Browse the full category with search, sorting and set filters." : "Parcours la catégorie complète avec recherche, tri et filtre par extension.";
  renderCategorySeoPanel(null);
}

function categoryFeaturedProducts() {
  const route = gameRoutes[window.location.pathname];
  const category = route?.category || categoryRoutes[window.location.pathname] || state.category;
  const game = route?.game || state.game || "Pokemon";
  if (!category || category === "all") return [];
  return inventory
    .filter((product) => product.category === category)
    .filter((product) => productGame(product) === game)
    .filter((product) => getProductStatus(product) === "available" && Number(product.stock || 0) > 0 && hasValidProductImage(product))
    .sort((a, b) => {
      const featuredScore = Number(isHomepageFeatured(b) || isNewArrivalFavorite(b)) - Number(isHomepageFeatured(a) || isNewArrivalFavorite(a));
      if (featuredScore) return featuredScore;
      return merchDateValue(b.updatedAt || b.createdAt) - merchDateValue(a.updatedAt || a.createdAt);
    })
    .slice(0, 3);
}

function renderCategorySeoPanel(copy) {
  if (!categorySeoPanel) return;
  if (!copy) {
    categorySeoPanel.innerHTML = "";
    categorySeoPanel.classList.add("hidden");
    return;
  }
  const featured = categoryFeaturedProducts();
  categorySeoPanel.classList.remove("hidden");
  categorySeoPanel.innerHTML = `
    <div class="category-proof-row">
      ${(copy.proof || []).map((item) => `<span>${escapeAttribute(item)}</span>`).join("")}
    </div>
    <div class="category-seo-copy">
      <p>${escapeAttribute(copy.seoText || copy.intro || "")}</p>
      <a href="/livraison" data-content-route="livraison">${currentLang === "en" ? "Shipping and protection details" : "Voir la livraison et la protection"}</a>
    </div>
    ${
      featured.length
        ? `<div class="category-featured-products" aria-label="${currentLang === "en" ? "Featured products" : "Produits vedettes"}">
            ${featured.map((product) => homeProductCard(product)).join("")}
          </div>`
        : ""
    }
  `;
}

function isMobileShop() {
  return mobileShopQuery.matches;
}

function isHomeShopPreview() {
  return window.location.pathname === "/";
}

function hasValidProductImage(product) {
  return Boolean(productImageUrl(product));
}

function availableHomeProducts() {
  return inventory.filter(
    (product) =>
      !["Preorder", "Accessories"].includes(product.category) &&
      getProductStatus(product) === "available" &&
      Number(product.stock || 0) > 0 &&
      hasValidProductImage(product)
  );
}

const merchandisingSectionsConfig = {
  vitrine: {
    title: "Vitrine CoffeeBreak",
    max: 6,
    min: 1,
    collection: "vitrine",
    description: "La sélection éditoriale qui donne le ton premium de la page d’accueil.",
  },
  new: {
    title: "Nouveautés",
    max: 6,
    min: 1,
    collection: "new",
    description: "Produits récents, en stock, publiés et avec photo réelle.",
  },
  "one-piece": {
    title: "One Piece",
    max: 6,
    min: 1,
    collection: "one-piece",
    description: "Produits One Piece prêts pour une deuxième vitrine distincte de Pokémon.",
  },
  accessible: {
    title: "Cartes accessibles",
    max: 8,
    min: 4,
    collection: "accessible",
    description: "Achats faciles entre 15 $ et 75 $, avec diversité de Pokémon et d’extensions.",
  },
  dormant: {
    title: "Inventaire dormant",
    max: 8,
    min: 1,
    collection: "dormant",
    description: "Liste interne: produits à revoir, promouvoir, bundler ou photographier de nouveau.",
  },
  content: {
    title: "Suggestions de contenu",
    max: 6,
    min: 1,
    collection: "content",
    description: "Produits qui peuvent devenir un Reel, une Story ou un post de confiance.",
  },
};

const iconicPokemon = new Set([
  "charizard",
  "pikachu",
  "mew",
  "mewtwo",
  "lugia",
  "umbreon",
  "gengar",
  "rayquaza",
  "eevee",
  "snorlax",
  "dragonite",
  "blastoise",
  "venusaur",
  "gyarados",
  "greninja",
  "lucario",
  "sylveon",
]);

const premiumRarities = ["sir", "ir", "alt", "alternate", "gold", "secret", "promo", "low pop", "swirl", "miscut"];

function merchDecision(section, productId) {
  return merchandisingState?.decisions?.[section]?.[productId] || null;
}

function isMerchExcluded(section, product) {
  return merchDecision(section, product.id)?.status === "excluded";
}

function isMerchValidated(section, product) {
  const decision = merchDecision(section, product.id);
  const collection = String(product.homepageCollection || "").toLowerCase();
  return ["accepted", "locked"].includes(decision?.status) || collection === section || (section === "vitrine" && isHomepageFeatured(product));
}

function merchDateValue(value) {
  const date = value ? new Date(value) : null;
  const time = date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  return time;
}

function daysSince(value) {
  const time = merchDateValue(value);
  if (!time) return 999;
  return Math.max(0, Math.floor((Date.now() - time) / 86400000));
}

function merchProductText(product) {
  return [product.name, product.setName, product.rarity, product.features?.join(" "), product.badge]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function productPokemonKey(product) {
  return String(product.name || "")
    .toLowerCase()
    .replace(/\b(vmax|vstar|ex|gx|v|ar|ir|sir|holo|reverse|promo|psa|bgs|cgc|sgc|tag|gold star)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")[0] || product.id;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function addMerchPoints(bucket, amount, reason) {
  bucket.points += amount;
  if (reason) bucket.reasons.push(`+${amount} ${reason}`);
}

function calculateMerchandisingScore(product, context = {}) {
  const hasContext = Object.keys(context || {}).length > 0;
  const cacheKey = [
    product.id,
    product.updatedAt,
    product.createdAt,
    product.status,
    product.stock,
    product.price,
    product.market,
    product.cost,
    product.imageUrl,
    product.galleryImages?.length || 0,
    product.homepageCollection,
    product.featured,
    product.heroFeatured,
  ].join("|");
  if (!hasContext && merchandisingScoreCache.has(cacheKey)) return merchandisingScoreCache.get(cacheKey);
  const reasons = [];
  const penalties = [];
  const buckets = {
    visual: { points: 0, reasons },
    value: { points: 0, reasons },
    margin: { points: 0, reasons },
    demand: { points: 0, reasons },
    freshness: { points: 0, reasons },
    accessible: { points: 0, reasons },
    balance: { points: 0, reasons },
  };
  const price = Number(product.price || 0);
  const market = Number(product.market || product.lastMarketPrice || 0);
  const cost = Number(product.cost || 0);
  const profit = price - cost;
  const margin = price > 0 ? profit / price : 0;
  const text = merchProductText(product);
  const isIconic = [...iconicPokemon].some((name) => text.includes(name));
  const hasPremiumSignal = premiumRarities.some((signal) => text.includes(signal));
  const imageCount = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean).length;
  const status = getProductStatus(product);

  if (hasValidProductImage(product)) addMerchPoints(buckets.visual, 8, "photo principale valide");
  if (imageCount >= 2) addMerchPoints(buckets.visual, 3, "plusieurs photos disponibles");
  if (isSlabProduct(product)) addMerchPoints(buckets.visual, 4, "slab visuellement premium");
  if (isIconic) addMerchPoints(buckets.visual, 3, "Pokémon reconnu");
  if (hasPremiumSignal) addMerchPoints(buckets.visual, 2, "rareté ou particularité forte");
  buckets.visual.points = Math.min(20, buckets.visual.points);

  if (market >= 100 || price >= 100) addMerchPoints(buckets.value, 5, "valeur perçue élevée");
  if (isSlabProduct(product) && Number(product.grade || 0) >= 9) addMerchPoints(buckets.value, 5, "grade élevé");
  if (hasPremiumSignal) addMerchPoints(buckets.value, 3, "signal collectionnable");
  if (product.category === "Sealed") addMerchPoints(buckets.value, 2, "produit scellé collectionnable");
  buckets.value.points = Math.min(15, buckets.value.points);

  if (cost > 0 && profit > 0) addMerchPoints(buckets.margin, 5, "profit potentiel positif");
  if (margin >= 0.2) addMerchPoints(buckets.margin, 5, "marge saine");
  if (market > 0 && price <= market * 1.05) addMerchPoints(buckets.margin, 3, "prix affiché cohérent avec le marché");
  if (market > 0 && price < market) addMerchPoints(buckets.margin, 2, "prix attractif sous le marché");
  buckets.margin.points = Math.min(15, buckets.margin.points);

  if (isIconic) addMerchPoints(buckets.demand, 6, "demande naturelle plus forte");
  if (product.featured || product.heroFeatured) addMerchPoints(buckets.demand, 3, "déjà marqué comme intéressant");
  if (Number(product.views || 0) > 0) addMerchPoints(buckets.demand, 3, "vues internes disponibles");
  if (Number(product.addToCart || 0) > 0) addMerchPoints(buckets.demand, 3, "ajouts panier internes disponibles");
  buckets.demand.points = Math.min(15, buckets.demand.points);

  const age = daysSince(product.createdAt || product.updatedAt);
  if (age <= 7) addMerchPoints(buckets.freshness, 6, "ajout récent");
  else if (age <= 21) addMerchPoints(buckets.freshness, 4, "encore frais");
  else if (age <= 45) addMerchPoints(buckets.freshness, 2, "pas trop ancien");
  if (!product.lastFeaturedAt && !product.homepageCollection) addMerchPoints(buckets.freshness, 2, "jamais mis en avant");
  buckets.freshness.points = Math.min(10, buckets.freshness.points);

  if (price >= 15 && price <= 75) addMerchPoints(buckets.accessible, 7, "prix accessible 15 $ à 75 $");
  else if (price > 0 && price < 15) addMerchPoints(buckets.accessible, 3, "petit prix d’entrée");
  else if (price > 75 && price <= 100) addMerchPoints(buckets.accessible, 2, "encore sous 100 $");
  buckets.accessible.points = Math.min(10, buckets.accessible.points);

  if (context.categoryCount && context.categoryCount[product.category] < 2) addMerchPoints(buckets.balance, 4, "aide la diversité de catégorie");
  if (context.pokemonCount && !context.pokemonCount[productPokemonKey(product)]) addMerchPoints(buckets.balance, 3, "évite un doublon Pokémon");
  if (context.setCount && (context.setCount[product.setName || product.setId || ""] || 0) < 2) addMerchPoints(buckets.balance, 3, "garde une diversité d’extensions");
  if (!context.categoryCount) addMerchPoints(buckets.balance, 5, "profil utile pour une vitrine variée");
  buckets.balance.points = Math.min(10, buckets.balance.points);

  let score =
    buckets.visual.points +
    buckets.value.points +
    buckets.margin.points +
    buckets.demand.points +
    buckets.freshness.points +
    buckets.accessible.points +
    buckets.balance.points;

  if (!hasValidProductImage(product)) {
    score -= 25;
    penalties.push("-25 image manquante ou générique");
  }
  if (Number(product.stock || 0) <= 0) {
    score -= 40;
    penalties.push("-40 stock à zéro");
  }
  if (status !== "available") {
    score -= 35;
    penalties.push("-35 produit non publié");
  }
  if (market > 0 && price > market * 1.25) {
    score -= 8;
    penalties.push("-8 prix affiché au-dessus du marché");
  }
  if (cost > 0 && profit < 0) {
    score -= 10;
    penalties.push("-10 marge négative");
  }
  if (daysSince(product.createdAt || product.updatedAt) > 90 && !Number(product.views || 0)) {
    score -= 6;
    penalties.push("-6 inventaire ancien sans traction visible");
  }

  const finalScore = clampScore(score);
  const confidence = [product.price, product.market, product.cost, product.createdAt, product.imageUrl].filter(Boolean).length >= 4 ? "élevé" : finalScore >= 70 ? "moyen" : "faible";
  const placement =
    finalScore >= 78 && (isSlabProduct(product) || price >= 75 || product.heroFeatured)
      ? "Carte héro / Vitrine"
      : productGame(product) === "One Piece"
      ? "One Piece"
      : price >= 15 && price <= 75
      ? "Cartes accessibles"
      : age <= 21
      ? "Nouveautés"
      : "Suggestion interne";

  const result = {
    score: finalScore,
    reasons: reasons.slice(0, 6),
    penalties,
    placement,
    confidence,
    profit,
    margin,
  };
  if (!hasContext) {
    if (merchandisingScoreCache.size > 500) merchandisingScoreCache.clear();
    merchandisingScoreCache.set(cacheKey, result);
  }
  return result;
}

function merchandisingPool(products = inventory) {
  return products.filter(
    (product) =>
      !["Preorder", "Accessories"].includes(product.category) &&
      getProductStatus(product) === "available" &&
      Number(product.stock || 0) > 0 &&
      hasValidProductImage(product)
  );
}

function passesDiversity(product, selected, limits = {}) {
  const pokemonLimit = limits.pokemon || 1;
  const setLimit = limits.set || 2;
  const categoryLimit = limits.category || {};
  const pokemon = productPokemonKey(product);
  const set = product.setName || product.setId || "";
  if (selected.filter((item) => productPokemonKey(item) === pokemon).length >= pokemonLimit) return false;
  if (set && selected.filter((item) => (item.setName || item.setId || "") === set).length >= setLimit) return false;
  if (categoryLimit[product.category] && selected.filter((item) => item.category === product.category).length >= categoryLimit[product.category]) return false;
  return true;
}

function rankedMerchProducts(products, section, options = {}) {
  const selected = [];
  const candidates = products
    .filter((product) => !isMerchExcluded(section, product))
    .filter((product) => (options.filter ? options.filter(product) : true))
    .map((product) => ({ product, score: calculateMerchandisingScore(product) }))
    .filter((entry) => entry.score.score >= (options.minScore || 0))
    .sort((a, b) => {
      const decisionA = merchDecision(section, a.product.id);
      const decisionB = merchDecision(section, b.product.id);
      return (
        Number(decisionB?.status === "locked") - Number(decisionA?.status === "locked") ||
        Number(isMerchValidated(section, b.product)) - Number(isMerchValidated(section, a.product)) ||
        b.score.score - a.score.score ||
        merchDateValue(b.product.createdAt || b.product.updatedAt) - merchDateValue(a.product.createdAt || a.product.updatedAt)
      );
    });

  for (const entry of candidates) {
    if (!passesDiversity(entry.product, selected, options.limits)) continue;
    selected.push(entry.product);
    if (selected.length >= (options.max || 6)) break;
  }
  return selected;
}

function automaticNewArrivals(products) {
  return products
    .filter((product) => !["sold", "removed", "draft", "admin_draft"].includes(String(product.status || "")))
    .sort((a, b) => merchDateValue(b.createdAt || b.updatedAt) - merchDateValue(a.createdAt || a.updatedAt))
    .slice(0, 12);
}

function isNewArrivalFavorite(product) {
  return String(product?.homepageCollection || "").toLowerCase() === "new";
}

function manualNewArrivals(products) {
  return products
    .filter((product) => isNewArrivalFavorite(product))
    .sort((a, b) => {
      const rankA = Number(a.featuredRank || 999);
      const rankB = Number(b.featuredRank || 999);
      if (rankA !== rankB) return rankA - rankB;
      return merchDateValue(b.updatedAt || b.createdAt) - merchDateValue(a.updatedAt || a.createdAt);
    })
    .slice(0, 12);
}

function validatedMerchSection(products, section, options = {}) {
  const validated = products.filter((product) => isMerchValidated(section, product) && !isMerchExcluded(section, product));
  const ranked = rankedMerchProducts(validated, section, { ...options, minScore: options.minScore || 0 });
  return ranked.slice(0, options.max || merchandisingSectionsConfig[section]?.max || 6);
}

function buildMerchandisingSelections(products = inventory, { includeSuggestions = false } = {}) {
  const pool = merchandisingPool(products);
  const starredNewArrivals = manualNewArrivals(pool);
  const selections = {
    new: (starredNewArrivals.length ? starredNewArrivals : automaticNewArrivals(pool)).slice(0, 12),
    vitrine: validatedMerchSection(pool, "vitrine", {
      max: 6,
      minScore: 0,
      limits: { pokemon: 1, set: 2, category: { Singles: 2, Graded: 2, Sealed: 1 } },
    }),
    "one-piece": validatedMerchSection(pool, "one-piece", {
      max: 6,
      minScore: 35,
      limits: { pokemon: 1, set: 2 },
      filter: (product) => productGame(product) === "One Piece",
    }),
    accessible: validatedMerchSection(pool, "accessible", {
      max: 8,
      minScore: 40,
      limits: { pokemon: 1, set: 2 },
      filter: (product) => Number(product.price || 0) >= 15 && Number(product.price || 0) <= 75,
    }),
  };

  if (includeSuggestions) {
    selections.suggestions = {
      vitrine: rankedMerchProducts(pool, "vitrine", {
        max: 6,
        minScore: 55,
        limits: { pokemon: 1, set: 2, category: { Singles: 2, Graded: 2, Sealed: 1 } },
      }),
      new: selections.new,
      "one-piece": rankedMerchProducts(pool, "one-piece", {
        max: 6,
        minScore: 35,
        limits: { pokemon: 1, set: 2 },
        filter: (product) => productGame(product) === "One Piece",
      }),
      accessible: rankedMerchProducts(pool, "accessible", {
        max: 8,
        minScore: 40,
        limits: { pokemon: 1, set: 2 },
        filter: (product) => Number(product.price || 0) >= 15 && Number(product.price || 0) <= 75,
      }),
      dormant: pool
        .filter((product) => daysSince(product.createdAt || product.updatedAt) > 45 || (Number(product.market || 0) > 0 && Number(product.price || 0) > Number(product.market || 0) * 1.1))
        .sort((a, b) => daysSince(b.createdAt || b.updatedAt) - daysSince(a.createdAt || a.updatedAt))
        .slice(0, 8),
      content: rankedMerchProducts(pool, "content", { max: 6, minScore: 60, limits: { pokemon: 1, set: 2 } }),
    };
  }

  return selections;
}

function featuredRank(product) {
  const rank = Number(product.featuredRank || 999);
  return Number.isFinite(rank) ? rank : 999;
}

function isHomepageFeatured(product) {
  const collection = String(product.homepageCollection || "").toLowerCase();
  return Boolean(product.heroFeatured || product.featured || collection === "vitrine" || collection === "showcase");
}

function productMetaLine(product) {
  return [
    product.setName,
    product.cardNumber ? `#${product.cardNumber}` : "",
    product.category === "Sealed" ? product.condition : cardConditionCode(product) || product.condition,
  ]
    .filter(Boolean)
    .join(" · ");
}

function homeProductCard(product, options = {}) {
  const status = getProductStatus(product);
  const isReserved = status === "reserved";
  const badge = isRecentProduct(product) ? `<span class="home-product-badge">Nouveau</span>` : "";
  return `
    <article class="home-product-card ${options.hero ? "is-hero" : ""}" data-product-card="${escapeAttribute(product.id)}" data-view-product="${escapeAttribute(product.id)}">
      <div class="home-product-art ${isSlabProduct(product) ? "slab-product-art" : ""}" style="--accent:${product.accent || "#d5742d"}">
        ${badge}
        ${productVisual(product)}
      </div>
      <div class="home-product-copy">
        <span>${escapeAttribute(productCategoryLabel(product))}</span>
        <h3>${escapeAttribute(product.name)}</h3>
        <p>${escapeAttribute(productMetaLine(product) || "Détails à confirmer")}</p>
        <div class="home-product-bottom">
          ${priceMarkup(product)}
          <a href="${productDetailPath(product)}" data-view-product="${escapeAttribute(product.id)}">${isReserved ? t("reserved") : t("viewCard")}</a>
        </div>
      </div>
    </article>
  `;
}

function vitrineBadge(product, role) {
  if (role === "hero") return "Choix CoffeeBreak";
  if (isSlabProduct(product) && product.gradingCompany && product.grade) return `${product.gradingCompany} ${product.grade}`;
  if (String(product.rarity || "").trim()) return product.rarity;
  if (isRecentProduct(product)) return "Nouveau";
  return product.category || "";
}

function vitrineProductCard(product, role = "mini") {
  const meta = productMetaLine(product) || "Détails à confirmer";
  const badge = vitrineBadge(product, role);
  return `
    <a class="vitrine-card vitrine-card-${escapeAttribute(role)} ${isSlabProduct(product) ? "is-slab" : ""}" href="${productDetailPath(product)}" data-view-product="${escapeAttribute(product.id)}" style="--accent:${product.accent || "#d5742d"}">
      <div class="vitrine-art">
        ${productVisual(product)}
      </div>
      <div class="vitrine-copy">
        ${badge ? `<span>${escapeAttribute(badge)}</span>` : ""}
        <h3>${escapeAttribute(product.name)}</h3>
        ${role !== "mini" ? `<p>${escapeAttribute(meta)}</p>` : ""}
        <div class="vitrine-bottom">
          ${priceMarkup(product)}
          ${role !== "mini" ? `<em>${t("viewCard")}</em>` : ""}
        </div>
      </div>
    </a>
  `;
}

function vitrineDisplayProducts(selections) {
  const selected = selections.vitrine || [];
  const fallback = selections.suggestions?.vitrine || [];
  const products = [];
  for (const product of [...selected, ...fallback]) {
    if (products.some((item) => item.id === product.id)) continue;
    if (isMerchExcluded("vitrine", product)) continue;
    if (getProductStatus(product) !== "available" || Number(product.stock || 0) <= 0 || !hasValidProductImage(product)) continue;
    products.push(product);
    if (products.length >= 6) break;
  }
  return products;
}

function setSectionVisibility(element, visible) {
  element?.closest("section")?.classList.toggle("hidden", !visible);
}

function emptyHomeDropCard(title, text, href = "/admin") {
  return `
    <a class="home-empty-drop" href="${href}">
      <span>${currentLang === "en" ? "Preorder / Mystery Box" : "Pré-commande / Mystery Box"}</span>
      <strong>${title}</strong>
      <p>${text}</p>
    </a>
  `;
}

function renderNewArrivalsCarousel() {
  if (!newArrivalsCarousel) return;
  const slides = (newArrivalSlides || []).filter((slide) => slide.active !== false && slide.imageUrl);
  const newestProducts = (buildMerchandisingSelections(inventory, { includeSuggestions: true }).new || []).filter(hasValidProductImage).slice(0, 12);
  const productFallbackSlides =
    currentLang === "en"
      ? [
          { title: "Fresh slabs incoming", imageUrl: "/assets/category-slabs-upload-v2-20260812.png", href: "/slabs" },
          { title: "Modern singles watchlist", imageUrl: "/assets/category-singles-cafe-real-cards-20260812.jpg", href: "/singles" },
          { title: "Chase cards on deck", imageUrl: "/assets/pokemon-single-pikachu-surging-sparks-sir.png", href: "/singles" },
          { title: "One Piece grails", imageUrl: "/assets/one-piece-chase-card-op05-119-p2.png", href: "/one-piece" },
        ]
      : [
          { title: "Slabs fraîchement arrivés", imageUrl: "/assets/category-slabs-upload-v2-20260812.png", href: "/slabs" },
          { title: "Singles modernes à surveiller", imageUrl: "/assets/category-singles-cafe-real-cards-20260812.jpg", href: "/singles" },
          { title: "Cartes chase sur le radar", imageUrl: "/assets/pokemon-single-pikachu-surging-sparks-sir.png", href: "/singles" },
          { title: "Grails One Piece", imageUrl: "/assets/one-piece-chase-card-op05-119-p2.png", href: "/one-piece" },
        ];
  let carouselItems = [];
  if (newestProducts.length) {
    carouselItems = newestProducts.map((product) => ({
      type: "product",
      product,
      title: product.name,
      imageUrl: product.imageUrl,
      href: productDetailPath(product),
    }));
  } else if (slides.length) {
    carouselItems = slides.map((slide) => ({
      type: "slide",
      title: slide.title || "Nouveauté",
      imageUrl: slide.imageUrl,
      href: slide.href || "/#new-arrivals",
    }));
  } else {
    carouselItems = productFallbackSlides.map((slide) => ({ type: "product-fallback", ...slide }));
  }
  newArrivalsCarousel.classList.toggle("hidden", carouselItems.length === 0);
  if (!carouselItems.length) {
    newArrivalsCarousel.innerHTML = "";
    return;
  }
  const loopItems = carouselItems.length === 1 ? [...carouselItems, ...carouselItems, ...carouselItems, ...carouselItems] : [...carouselItems, ...carouselItems];
  const duration = Math.max(26, Math.min(82, loopItems.length * 7));
  newArrivalsCarousel.style.setProperty("--marquee-duration", `${duration}s`);
  newArrivalsCarousel.innerHTML = `
    <div class="new-arrivals-track">
      ${loopItems
        .map((item) => {
          const title = item.title || "Nouveauté";
          const image = item.imageUrl || "";
          const href = item.href || "/#new-arrivals";
          return `
            <a class="new-arrival-slide ${item.type === "product" ? "is-product" : ""} ${item.type === "product-fallback" ? "product-fallback" : ""}" href="${escapeAttribute(href)}" ${item.product ? `data-view-product="${escapeAttribute(item.product.id)}"` : ""}>
              <img src="${escapeAttribute(image)}" alt="${escapeAttribute(title)}" loading="lazy" />
              <span>${escapeAttribute(title)}</span>
              ${
                item.product
                  ? `<small>${escapeAttribute([productCategoryLabel(item.product), item.product.condition, money.format(item.product.price)].filter(Boolean).join(" · "))}</small>`
                  : ""
              }
            </a>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderHomeSections() {
  const selections = buildMerchandisingSelections(inventory, { includeSuggestions: true });
  const newest = selections.new || [];
  renderNewArrivalsCarousel();
  if (newArrivalsGrid) {
    newArrivalsGrid.innerHTML = newest.length
      ? ""
      : emptyHomeDropCard(
          currentLang === "en" ? "Preorder / Mystery Box is being prepared." : "Pré-commande / Mystery Box se prépare.",
          currentLang === "en" ? "We’re preparing the next sealed drops, mystery boxes and special releases." : "On prépare les prochains sealed, mystery boxes et drops spéciaux."
        );
    newArrivalsGrid.classList.toggle("hidden", newest.length > 0);
    setSectionVisibility(newArrivalsGrid, true);
  }
}

function renderProducts() {
  updateCategoryHeading();
  const products = getProducts();
  const homePreview = isHomeShopPreview();
  const shopShell = document.querySelector("#shop");
  const visibleProducts = homePreview ? [] : products;
  shopShell?.classList.toggle("home-grid-hidden", homePreview);
  productGrid.classList.toggle("mobile-preview-grid", homePreview && products.length > 16 && isMobileShop());
  productGrid.innerHTML = visibleProducts
    .map((product, index) => {
      const features = getDeal(product);
      const pills = productPills(product, features);
      const stockLabel =
        product.category === "Preorder"
          ? `${Number(product.stock || 0)} ${t("stockPreorder")}`
          : product.category === "Sealed" || product.category === "Accessories"
            ? `${Math.max(0, Number(product.stock || 0))} ${t("inStock")}`
            : "";
      const limitNote =
        Number(product.maxPerCart || 0) > 0
          ? `<span class="limit-line">${t("limit")} ${product.maxPerCart} ${t("perRequest")}</span>`
          : "";
      const status = getProductStatus(product);
      const isReserved = status === "reserved";
      return `
        <article class="product-card" data-product-card="${product.id}" data-view-product="${product.id}" style="--stagger:${Math.min(index, 12) * 42}ms">
          <a class="product-art ${isSlabProduct(product) ? "slab-product-art" : ""}" href="${productDetailPath(product)}" data-view-product="${product.id}" style="--accent: ${product.accent}">
            ${productVisual(product)}
          </a>
          <div class="product-meta">
            <span class="product-category">${productCategoryLabel(product)}</span>
            <h3>${product.name}</h3>
            <p class="condition">${[product.setName, product.cardNumber ? `#${product.cardNumber}` : "", product.rarity, product.condition].filter(Boolean).join(" - ")}</p>
            ${stockLabel ? `<span class="stock-line">${stockLabel}</span>` : ""}
            ${limitNote}
            <div class="price-line">
              ${priceMarkup(product)}
              ${pills ? `<span class="feature-pills">${pills}</span>` : ""}
            </div>
          </div>
          <div class="card-actions">
            <a class="detail-link" href="${productDetailPath(product)}" data-view-product="${product.id}">${isReserved ? t("reserved") : t("viewCard")}</a>
          </div>
        </article>
      `;
    })
    .join("");

  if (!products.length) {
    productGrid.innerHTML = `
      <div class="shop-empty-state">
        <p>${t("shopEmpty")}</p>
        <button class="button secondary" type="button" data-reset-filters>
          ${currentLang === "en" ? "Reset filters" : "Réinitialiser les filtres"}
        </button>
      </div>
    `;
  }
  renderMobileMore(products.length > 0 && !homePreview && isMobileShop());
  renderHomeSections();
  renderCuratedSections();
  observeDynamicElements();
}

function categoryMoreLinks() {
  if (state.category === "Singles") {
    return `<a class="button primary" href="${categoryPath("Singles", state.game)}" data-route-category="Singles" data-route-game="${escapeAttribute(state.game)}">${t("viewAllSingles")}</a>`;
  }
  if (state.category === "Graded") {
    return `<a class="button primary" href="${categoryPath("Graded", state.game)}" data-route-category="Graded" data-route-game="${escapeAttribute(state.game)}">${t("viewAllGraded")}</a>`;
  }
  if (state.category === "Sealed") {
    return `<a class="button primary" href="${categoryPath("Sealed", state.game)}" data-route-category="Sealed" data-route-game="${escapeAttribute(state.game)}">${t("viewAllSealed")}</a>`;
  }
  if (state.game === "One Piece") {
    return `
      <a class="button primary" href="/one-piece/singles" data-route-category="Singles" data-route-game="One Piece">${t("viewAllSingles")}</a>
      <a class="button secondary" href="/one-piece/slabs" data-route-category="Graded" data-route-game="One Piece">${t("viewAllGraded")}</a>
      <a class="button secondary" href="/one-piece/box" data-route-category="Sealed" data-route-game="One Piece">${t("viewAllSealed")}</a>
    `;
  }
  return `
    <a class="button primary" href="/singles" data-route-category="Singles">${t("viewAllSingles")}</a>
    <a class="button secondary" href="/slabs" data-route-category="Graded">${t("viewAllGraded")}</a>
    <a class="button secondary" href="/sealed" data-route-category="Sealed">${t("viewAllSealed")}</a>
  `;
}

function renderMobileMore(visible) {
  let block = document.querySelector("#mobileMoreBlock");
  if (!visible) {
    block?.remove();
    return;
  }
  if (!block) {
    block = document.createElement("article");
    block.id = "mobileMoreBlock";
    block.className = "mobile-more-block reveal-section";
    productGrid.insertAdjacentElement("beforeend", block);
  }
  block.innerHTML = `
    <div class="mobile-more-title">
      <strong>${t("mobileMoreTitle")}</strong>
      <p>${t("mobileMoreText")}</p>
    </div>
    <div class="mobile-more-actions">
      ${categoryMoreLinks()}
    </div>
  `;
}

function curatedCard(product) {
  return `
    <article class="curated-card">
      <a href="${productDetailPath(product)}" data-view-product="${product.id}" style="--accent:${product.accent || "#d5742d"}">
        <span class="curated-art">
          ${compactVisual(product)}
        </span>
        <span>
          <strong>${escapeAttribute(product.name)}</strong>
          <small>${escapeAttribute([product.setName, product.cardNumber ? `#${product.cardNumber}` : "", product.condition].filter(Boolean).join(" - "))}</small>
          <em>${priceMarkup(product, "curated-price")}</em>
        </span>
      </a>
    </article>
  `;
}

function renderCuratedSections() {
  if (!curatedSections || !featuredSections) return;
  if (state.category !== "all" || state.search.trim() || state.typeFilter !== "all") {
    featuredSections.innerHTML = "";
    curatedSections.innerHTML = "";
    return;
  }
  const available = inventory.filter((product) => !["Preorder", "Accessories"].includes(product.category) && getProductStatus(product) === "available");
  const featuredItems = available.filter((product) => product.featured);
  const featuredSection = [t("featuredTitle"), t("featuredText"), (featuredItems.length ? featuredItems : available).slice(0, 6)];
  const selectionSections = [
    [t("newTitle"), t("newText"), available.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6)],
    [t("onePieceTitle"), t("onePieceText"), available.filter((product) => productGame(product) === "One Piece").slice(0, 6)],
  ].filter(([, , items]) => items.length);

  featuredSections.innerHTML = featuredSection[2].length
    ? `
        <section class="curated-block featured-block reveal-section">
          <div class="curated-heading">
            <div>
              <p class="eyebrow">${t("curatedEyebrow")}</p>
              <h2>${featuredSection[0]}</h2>
            </div>
            <p>${featuredSection[1]}</p>
          </div>
          <div class="curated-row">${featuredSection[2].map(curatedCard).join("")}</div>
        </section>
      `
    : "";

  curatedSections.innerHTML = selectionSections
    .map(
      ([title, text, items]) => `
        <section class="curated-block reveal-section">
          <div class="curated-heading">
            <div>
              <p class="eyebrow">${t("curatedEyebrow")}</p>
              <h2>${title}</h2>
            </div>
            <p>${text}</p>
          </div>
          <div class="curated-row">${items.map(curatedCard).join("")}</div>
        </section>
      `
    )
    .join("");
}

function detailSpec(label, value) {
  return value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : "";
}

function similarProducts(product) {
  if (!product) return [];
  return inventory
    .filter((item) => item.id !== product.id)
    .filter((item) => getProductStatus(item) === "available" && Number(item.stock || 0) > 0)
    .filter((item) => productGame(item) === productGame(product))
    .filter(hasValidProductImage)
    .map((item) => {
      let score = 0;
      if (item.category === product.category) score += 40;
      if (item.setName && product.setName && item.setName === product.setName) score += 28;
      if (isHomepageFeatured(item)) score += 18;
      if (isRecentProduct(item)) score += 12;
      if (isSaleProduct(item)) score += 8;
      score += Math.min(10, Number(item.price || 0) / 100);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, 4);
}

function renderProductDetail(id) {
  const product = inventory.find((item) => item.id === id);
  if (!product || !productDetailContent) {
    history.replaceState({}, "", "/");
    applyRoute();
    return;
  }
  const status = getProductStatus(product);
  const features = getDeal(product);
  const cardCondition = cardConditionCode(product);
  const conditionDetail = conditionDetailLabel(product);
  const limit = cartLineLimit(product);
  const galleryImages = productGalleryImages(product);
  const relatedProducts = similarProducts(product);
  const titleLength = String(product.name || "").length;
  const titleClass = titleLength > 48 ? "is-long-title" : titleLength > 30 ? "is-medium-title" : "";
  updateProductMeta(product);
  trackShopEvent("view_product", {
    product_id: product.id,
    category: product.category,
    game: productGame(product),
    value: Number(product.price || 0),
  });
  const publicStock =
    product.category === "Preorder"
      ? `${Number(product.stock || 0)} disponible${Number(product.stock || 0) > 1 ? "s" : ""} en précommande`
      : product.category === "Sealed" || product.category === "Accessories"
        ? `${Number(product.stock || 0)} disponible${Number(product.stock || 0) > 1 ? "s" : ""}`
        : ["Singles", "Graded"].includes(product.category) && Number(product.stock || 0) === 1 && getProductStatus(product) === "available"
          ? "1 en stock"
        : "";
  productDetailContent.innerHTML = `
    <a class="back-link" href="${categoryPath(lastShopView?.category || product.category || "all")}" data-back-shop>${t("backShop")}</a>
    <div class="detail-layout">
      <div>
        <div class="detail-art" style="--accent:${product.accent || "#d5742d"}">${productVisual(product)}</div>
        ${
          galleryImages.length > 1
            ? `<div class="detail-gallery" aria-label="Photos additionnelles">
                ${galleryImages
                  .map(
                    (image, index) => `
                      <button type="button" data-gallery-image="${escapeAttribute(image)}" aria-label="Voir la photo ${index + 1}">
                        <img src="${escapeAttribute(image)}" alt="" />
                      </button>
                    `
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>
      <div class="detail-copy ${titleClass}">
        <p class="eyebrow">${productCategoryLabel(product)}</p>
        <h1>${product.name}</h1>
        <div class="detail-price">${priceMarkup(product, "detail-price-stack")}</div>
        <p class="condition">${[
          product.gradingCompany && product.grade ? `${product.gradingCompany} ${product.grade}` : "",
          product.setName,
          product.cardNumber ? `#${product.cardNumber}` : "",
          product.rarity,
          product.condition,
        ]
          .filter(Boolean)
          .join(" - ") || "Détails à confirmer"}</p>
        <div class="detail-pills">
          ${product.gradingCompany && product.grade ? `<span>${product.gradingCompany} ${product.grade}</span>` : ""}
          ${cardCondition ? `<span>${cardCondition}</span>` : ""}
          ${product.maxPerCart ? `<span>Limite ${product.maxPerCart} / demande</span>` : ""}
          ${features.map((feature) => `<span>${feature}</span>`).join("")}
        </div>
        <button class="button primary product-main-cta" type="button" data-add-cart="${product.id}" ${status === "reserved" || limit <= 0 ? "disabled" : ""}>${status === "reserved" ? t("reserved") : t("addToCartFull")}</button>
        <dl class="detail-specs">
          ${detailSpec("Condition", conditionDetail)}
          ${detailSpec("Numéro", product.cardNumber)}
          ${detailSpec("Extension", product.setName)}
          ${detailSpec("Rareté", product.rarity)}
          ${detailSpec("Slab", product.gradingCompany && product.grade ? `${product.gradingCompany} ${product.grade}` : "")}
          ${detailSpec("Disponibilité", publicStock)}
          ${features.length ? detailSpec("Spécifications", features.join(" - ")) : ""}
          <div><dt>Prix</dt><dd>${money.format(product.price)}</dd></div>
          <div><dt>Protection</dt><dd>Sleeve, team bag et emballage rigide inclus.</dd></div>
          <div><dt>Expédition</dt><dd>Livraison depuis Laval, suivi inclus.</dd></div>
        </dl>
        <div class="detail-trust" aria-label="Garanties Coffee Break TCG">
          <article>
            <strong>Paiement sécurisé</strong>
            <span>Transaction Square chiffrée avant la confirmation.</span>
          </article>
          <article>
            <strong>Expédition suivie</strong>
            <span>Colis préparé au Québec avec suivi au Canada.</span>
          </article>
          <article>
            <strong>Protection cartes</strong>
            <span>Chaque item est emballé selon sa valeur et son format.</span>
          </article>
        </div>
        <div class="detail-cta-row">
          <a class="button secondary" href="/livraison" data-content-route="livraison">Livraison & protection</a>
          <a class="button secondary" href="/faq" data-content-route="faq">FAQ</a>
        </div>
      </div>
    </div>
    ${
      relatedProducts.length
        ? `<section class="similar-products" aria-label="Produits similaires">
            <div class="section-heading compact">
              <div>
                <p class="eyebrow">À voir aussi</p>
                <h2>Produits similaires</h2>
              </div>
            </div>
            <div class="similar-products-grid">${relatedProducts.map((item) => homeProductCard(item)).join("")}</div>
          </section>`
        : ""
    }
  `;
}

function selectGalleryImage(button) {
  const image = button?.dataset.galleryImage;
  const detailArt = productDetailContent?.querySelector(".detail-art");
  const productId = window.location.pathname.match(/^\/produit\/([^/]+)$/)?.[1];
  const product = inventory.find((item) => item.id === productId);
  if (!image || !detailArt || !product) return;
  const previewProduct = { ...product, imageUrl: image };
  detailArt.innerHTML = productVisual(previewProduct);
  productDetailContent.querySelectorAll("[data-gallery-image]").forEach((entry) => {
    entry.classList.toggle("active", entry === button);
  });
}

function fillProvinceSelects(scope = document) {
  scope.querySelectorAll('select[name="province"]').forEach((select) => {
    const current = select.value || "QC";
    select.innerHTML = provinceOptions(current);
  });
}

function setFormField(form, name, value) {
  const field = form?.elements?.[name];
  if (field && value !== undefined && value !== null) field.value = value;
}

function syncCoffeeUpload(input) {
  const wrapper = input?.closest("[data-coffee-upload]");
  if (!wrapper) return;
  const meta = wrapper.querySelector("[data-upload-meta]");
  const preview = wrapper.querySelector("[data-upload-preview]");
  const files = [...(input.files || [])];
  const validFiles = [];
  const errors = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      errors.push(`${file.name}: ${currentLang === "en" ? "image only" : "image seulement"}`);
      continue;
    }
    if (file.size > 8 * 1024 * 1024) {
      errors.push(`${file.name}: ${currentLang === "en" ? "max 8 MB" : "maximum 8 Mo"}`);
      continue;
    }
    validFiles.push(file);
  }
  if (validFiles.length !== files.length) {
    const transfer = new DataTransfer();
    validFiles.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
  }
  if (meta) {
    const countText =
      validFiles.length === 0
        ? currentLang === "en"
          ? "No photo selected."
          : "Aucune photo sélectionnée."
        : currentLang === "en"
          ? `${validFiles.length} photo${validFiles.length > 1 ? "s" : ""} selected.`
          : `${validFiles.length} photo${validFiles.length > 1 ? "s" : ""} sélectionnée${validFiles.length > 1 ? "s" : ""}.`;
    meta.textContent = errors.length ? `${countText} ${errors.join(" · ")}` : countText;
  }
  if (preview) {
    preview.innerHTML = validFiles
      .map((file, index) => {
        const url = URL.createObjectURL(file);
        return `
          <figure>
            <img src="${url}" alt="${escapeAttribute(file.name)}" />
            <figcaption>${escapeAttribute(file.name)}</figcaption>
            <button type="button" data-remove-upload="${index}" aria-label="${currentLang === "en" ? "Remove photo" : "Retirer la photo"}">×</button>
          </figure>
        `;
      })
      .join("");
  }
}

function removeCoffeeUploadFile(input, index) {
  const files = [...(input.files || [])];
  const transfer = new DataTransfer();
  files.forEach((file, fileIndex) => {
    if (fileIndex !== index) transfer.items.add(file);
  });
  input.files = transfer.files;
  syncCoffeeUpload(input);
}

function wireCoffeeUploads(scope = document) {
  scope.querySelectorAll("[data-coffee-upload]").forEach((wrapper) => {
    if (wrapper.dataset.uploadReady === "true") return;
    wrapper.dataset.uploadReady = "true";
    const input = wrapper.querySelector('input[type="file"]');
    const zone = wrapper.querySelector("[data-upload-zone]");
    if (!input || !zone) return;
    input.addEventListener("change", () => syncCoffeeUpload(input));
    ["dragenter", "dragover"].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        wrapper.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        wrapper.classList.remove("is-dragging");
      });
    });
    zone.addEventListener("drop", (event) => {
      const transfer = new DataTransfer();
      [...(input.files || []), ...(event.dataTransfer?.files || [])].forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
      syncCoffeeUpload(input);
    });
    wrapper.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-upload]");
      if (!button) return;
      event.preventDefault();
      removeCoffeeUploadFile(input, Number(button.dataset.removeUpload));
    });
  });
}

function wireAddressAutocomplete(scope = document) {
  scope.querySelectorAll('input[name="address"]').forEach((input) => {
    if (input.dataset.addressAutocomplete === "ready") return;
    input.dataset.addressAutocomplete = "ready";
    const label = input.closest("label");
    if (label) label.classList.add("address-field");
    const suggestions = document.createElement("div");
    suggestions.className = "address-suggestions";
    input.insertAdjacentElement("afterend", suggestions);
    let requestId = 0;
    input.addEventListener("input", async () => {
      const query = input.value.trim();
      const currentRequest = ++requestId;
      if (query.length < 3) {
        suggestions.classList.remove("is-open");
        suggestions.innerHTML = "";
        return;
      }
      try {
        const payload = await api(`/api/address/find?q=${encodeURIComponent(query)}`);
        if (currentRequest !== requestId) return;
        const results = (payload.suggestions || payload.results || []).slice(0, 6);
        suggestions.innerHTML = results
          .map(
            (item) =>
              `<button type="button" data-address-id="${escapeAttribute(item.id)}" data-address-provider="${escapeAttribute(item.provider || "")}">${escapeAttribute([item.text, item.description || item.label].filter(Boolean).join(", "))}</button>`
          )
          .join("");
        suggestions.classList.toggle("is-open", results.length > 0);
      } catch {
        suggestions.classList.remove("is-open");
      }
    });
    suggestions.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-address-id]");
      if (!button) return;
      try {
        const payload = await api(`/api/address/retrieve?id=${encodeURIComponent(button.dataset.addressId)}&provider=${encodeURIComponent(button.dataset.addressProvider || "")}`);
        const address = payload.address || {};
        const form = input.closest("form");
        setFormField(form, "address", address.address);
        setFormField(form, "city", address.city);
        setFormField(form, "province", address.province);
        setFormField(form, "postal", address.postal);
        suggestions.classList.remove("is-open");
      } catch {
        suggestions.classList.remove("is-open");
      }
    });
  });
}

const contentPages = {
  vendre: {
    eyebrow: "Achat de collections",
    title: "Fais-nous voir ta collection.",
    text:
      "T’as une collection de 1 000 $ et plus qui cherche une nouvelle maison? Envoie-nous un résumé, quelques photos et les cartes qui comptent. On va te répondre clairement.",
    cards: [
      ["Montre-nous ce que t’as", "Photos, liste ou vidéo rapide. Pas besoin que ce soit parfait."],
      ["On te revient avec un deal clair", "Cash, trade ou combinaison des deux, selon ce qui fait le plus de sens."],
      ["On règle ça simplement", "En personne, par expédition ou en card show."],
    ],
    sellForm: true,
  },
  livraison: {
    eyebrow: "Livraison",
    title: "Livraison suivie depuis Laval.",
    text:
      "Chaque commande est emballée comme si elle allait dans notre propre collection. Le suivi est inclus et la protection est adaptée à l’item.",
    cards: [
      ["Singles", "Sleeve, top loader ou card saver, team bag et enveloppe rigide."],
      ["Slabs", "Protection à bulles, boîte solide et suivi."],
      ["Sealed", "Boîte ajustée, rembourrage et suivi partout au Canada."],
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes.",
    text:
      "On est encore au début de l’aventure, mais on prend chaque commande, chaque trade et chaque collection au sérieux. Le but est simple: bâtir quelque chose de solide avec les collectionneurs.",
    cards: [
      ["Livraison", "Nous expédions depuis Laval avec suivi. La livraison est gratuite à partir de 100 $, sinon elle est de 6,99 $."],
      ["Protection des cartes", "Les singles sont envoyés en sleeve, top loader ou card saver, puis protégés dans un emballage rigide."],
      ["Slabs et sealed", "Les slabs et produits sealed sont emballés avec rembourrage et boîte solide pour limiter les mouvements pendant le transport."],
      ["Paiement", "Le paiement Square est en intégration. Les commandes peuvent être confirmées avant le paiement lorsque nécessaire."],
      ["Réservation", "Lorsqu’un paiement Square est lancé, les items sont réservés pendant 10 minutes. Si le paiement n’est pas complété, ils reviennent automatiquement en vitrine."],
      ["État des cartes", "Nous faisons de notre mieux pour décrire chaque carte clairement. Tu peux demander des photos additionnelles avant de payer."],
      ["On achète vos cartes", "On évalue les collections de 1 000 $ et plus avec photos, résumé et prix demandé."],
      ["Card shows", "Les prochains arrêts CoffeeBreak sont affichés sur la page d’accueil lorsqu’ils sont confirmés. Apporte ton binder."],
    ],
  },
  apropos: {
    eyebrow: "À propos",
    title: "Coffee Break TCG, basé à Laval.",
    text:
      "Deux amis, beaucoup de café, trop de binders et l’envie de bâtir un vrai spot TCG au Québec. Cartes aujourd’hui. Coffee shop demain.",
    cards: [
      ["Notre approche", "Chaque item est choisi, photographié, décrit et emballé avec attention. On veut que le collectionneur sache exactement ce qu’il regarde et reçoive quelque chose préparé avec soin."],
      ["Pour l’instant en ligne", "Nous faisons seulement de l’expédition pour le moment, avec une boutique physique visée à Laval en 2027, on l’espère 🤞."],
      ["Ce qu’on aime", "Les belles collections, les trouvailles qui racontent une histoire, les échanges entre passionnés et l’idée de faire prospérer une communauté locale autour du hobby."],
      ["Notre promesse", "Porter attention aux détails, protéger les cartes sans rien laisser au hasard et répondre avec sérieux quand tu as une question."],
    ],
  },
};

const contentPagesEn = {
  vendre: {
    eyebrow: "Buying cards",
    title: "Show us your collection.",
    text:
      "Have a $1,000+ collection looking for a new home? Send a summary, a few photos and the cards that matter. We’ll come back clearly.",
    cards: [
      ["Show us what you have", "Photos, a list or a quick video. It does not need to be perfect."],
      ["We come back with a clear deal", "Cash, trade or a mix of both, depending on what makes sense."],
      ["We make it simple", "In person, by shipping or at a card show."],
    ],
    sellForm: true,
  },
  livraison: {
    eyebrow: "Shipping",
    title: "Tracked shipping from Laval.",
    text: "Every order is packed like it was going into our own collection. Tracking is included and protection is adapted to the item.",
    cards: [
      ["Singles", "Sleeve, top loader or card saver, team bag and rigid mailer."],
      ["Slabs", "Bubble protection, solid box and tracking."],
      ["Sealed", "Fitted box, padding and tracked shipping across Canada."],
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions.",
    text:
      "We are still early in the journey, but we take every order, trade and collection seriously. The goal is simple: build something solid with collectors.",
    cards: [
      ["Shipping", "We ship from Laval with tracking. Free shipping starts at $100, otherwise shipping is $6.99."],
      ["Card protection", "Singles are shipped in a sleeve, top loader or card saver, then protected in rigid packaging."],
      ["Slabs and sealed", "Slabs and sealed products are packed with padding and a solid box."],
      ["Payment", "Square payment is being integrated. Orders can be confirmed before payment when needed."],
      ["Reservation", "When a Square payment is started, items are held for 10 minutes. If payment is not completed, they automatically return to the showcase."],
      ["Condition", "We do our best to describe each card clearly. You can ask for additional photos before paying."],
      ["Sell your cards", "We review collections of $1,000 and up with photos, a summary and an asking price."],
      ["Card shows", "Upcoming CoffeeBreak stops appear on the home page once confirmed. Bring your binder."],
    ],
  },
  apropos: {
    eyebrow: "About",
    title: "Coffee Break TCG, based in Laval.",
    text:
      "Two friends, a lot of coffee, too many binders and the ambition to build a real TCG spot in Quebec. Cards today. Coffee shop tomorrow.",
    cards: [
      ["Our approach", "Every item is chosen, photographed, described and packed with attention. We want collectors to know exactly what they are looking at and receive something prepared with care."],
      ["Online for now", "We only ship for now, with a physical Laval shop targeted for 2027, fingers crossed 🤞."],
      ["What we love", "Beautiful collections, finds with a story, conversations between collectors and the idea of helping a local hobby community grow."],
      ["Our promise", "Pay attention to the details, protect cards carefully and answer seriously when you have a question."],
    ],
  },
};

function renderContentPage(slug) {
  const pages = currentLang === "en" ? contentPagesEn : contentPages;
  const page = pages[slug] || pages.faq;
  if (!contentPageContent) return;
  contentPageContent.innerHTML = `
    <a class="back-link" href="/">${t("backShop")}</a>
    <p class="eyebrow">${page.eyebrow}</p>
    <h1>${page.title}</h1>
    <p class="content-lead">${page.text}</p>
    <div class="content-grid">
      ${page.cards.map(([title, text]) => `<article><h2>${title}</h2><p>${text}</p></article>`).join("")}
    </div>
    ${
      page.sellForm
        ? `<form class="request-form sell-form">
            <label>${currentLang === "en" ? "Name" : "Nom"} <input name="name" placeholder="${currentLang === "en" ? "Your name" : "Votre nom"}" /></label>
            <label>${t("email")} <input name="email" type="email" placeholder="vous@email.com" /></label>
            <label>${currentLang === "en" ? "Asking price for the full collection" : "Prix demandé pour la collection complète"} <input name="askingPrice" type="number" min="0" step="0.01" placeholder="Ex. 1200" /></label>
            <label>${currentLang === "en" ? "Collection summary" : "Résumé de la collection"} <textarea name="summary" rows="5" placeholder="${currentLang === "en" ? "Quantity, general condition, important notes..." : "Quantité, état général, notes importantes..."}"></textarea></label>
            <label>${currentLang === "en" ? "Key card names" : "Noms des cartes importantes"} <textarea name="cardNames" rows="4" placeholder="${currentLang === "en" ? "Example: Umbreon VMAX, Charizard ex SIR, PSA 10..." : "Ex. Umbreon VMAX, Charizard ex SIR, PSA 10..."}"></textarea></label>
            <div class="coffee-upload" data-coffee-upload>
              <input class="sr-only" id="collectionPhotosInput" name="collectionPhotos" type="file" accept="image/*" multiple />
              <label class="coffee-upload-zone" for="collectionPhotosInput" data-upload-zone>
                <span>${currentLang === "en" ? "Choose my photos" : "Choisir mes photos"}</span>
                <strong>${currentLang === "en" ? "Drag photos here or tap to select." : "Glisse tes photos ici ou clique pour choisir."}</strong>
                <small>${currentLang === "en" ? "JPG, PNG or WebP. Max 8 MB each." : "JPG, PNG ou WebP. Maximum 8 Mo par photo."}</small>
              </label>
              <div class="coffee-upload-meta" data-upload-meta>${currentLang === "en" ? "No photo selected." : "Aucune photo sélectionnée."}</div>
              <div class="coffee-upload-preview" data-upload-preview></div>
            </div>
            <button class="button primary" type="submit">${currentLang === "en" ? "Send request" : "Envoyer la demande"}</button>
            <p class="form-status" role="status"></p>
          </form>`
        : ""
    }
  `;
  wireCoffeeUploads(contentPageContent);
}

function orderStatusLabel(status) {
  return (
    {
      pending_payment: currentLang === "en" ? "Pending payment" : "Paiement en attente",
      expired: currentLang === "en" ? "Expired" : "Expirée",
      paid: currentLang === "en" ? "Paid" : "Payée",
      admin_sale: currentLang === "en" ? "Manual sale" : "Vente manuelle",
      cancelled: currentLang === "en" ? "Cancelled" : "Annulée",
    }[status] || status || "-"
  );
}

function renderAccount() {
  if (!accountContent) return;
  if (!currentUser) {
    accountContent.innerHTML = "";
    openAccountModal();
    return;
  }

  const address = currentUser.address || {};
  const hasProfile = Boolean(address.address || address.city || address.postal || address.phone);
  const profileSummary = `
    <section class="account-card profile-summary-card">
      <div class="account-card-title">
        <h2>${currentLang === "en" ? "Shipping profile" : "Profil de livraison"}</h2>
        <button class="icon-action" type="button" data-edit-profile aria-label="${t("editProfile")}">✎</button>
      </div>
      ${
        hasProfile
          ? `<div class="profile-summary">
              <strong>${escapeAttribute(address.name || currentUser.name || "")}</strong>
              <span>${escapeAttribute(currentUser.email)}</span>
              ${address.phone ? `<span>${escapeAttribute(address.phone)}</span>` : ""}
              <span>${escapeAttribute(address.address || "")}</span>
              <span>${[address.city, address.province, address.postal].filter(Boolean).map(escapeAttribute).join(" ")}</span>
              ${address.notes ? `<small>${escapeAttribute(address.notes)}</small>` : ""}
            </div>`
          : `<p class="account-empty">${currentLang === "en" ? "Add your shipping details to speed up checkout." : "Ajoute tes informations de livraison pour accélérer la commande."}</p>`
      }
    </section>
  `;
  const profileForm = `
    <form class="account-card account-form" data-account-profile>
      <div class="account-card-title">
        <h2>${currentLang === "en" ? "Shipping profile" : "Profil de livraison"}</h2>
      </div>
      <div class="form-row two">
        <label>${t("fullName")} <input name="name" autocomplete="name" value="${escapeAttribute(address.name || currentUser.name || "")}" required /></label>
        <label>${t("email")} <input name="email" type="email" value="${escapeAttribute(currentUser.email)}" disabled /></label>
      </div>
      <div class="form-row contact-row">
        <label>${t("phone")} <input name="phone" autocomplete="tel" value="${escapeAttribute(address.phone || "")}" /></label>
        <label>${t("address")} <input name="address" autocomplete="street-address" value="${escapeAttribute(address.address || "")}" /></label>
      </div>
      <div class="form-row location-row">
        <label>${t("city")} <input name="city" autocomplete="address-level2" value="${escapeAttribute(address.city || "")}" /></label>
        <label>${t("province")} <select name="province" autocomplete="address-level1">${provinceOptions(address.province || "QC")}</select></label>
        <label>${t("postal")} <input name="postal" autocomplete="postal-code" value="${escapeAttribute(address.postal || "")}" /></label>
      </div>
      <label>${t("deliveryNotes")} <input name="notes" value="${escapeAttribute(address.notes || "")}" /></label>
      <button class="button primary" type="submit">${t("updateProfile")}</button>
      <p class="form-status" role="status"></p>
    </form>
  `;
  accountContent.innerHTML = `
    <a class="back-link" href="/">${t("backShop")}</a>
    <div class="account-heading">
      <div>
        <p class="eyebrow">${t("account")}</p>
        <h1>${currentLang === "en" ? "Welcome" : "Bienvenue"}, ${escapeAttribute(currentUser.name)}</h1>
      </div>
      <button class="button secondary" type="button" data-account-logout>${t("logout")}</button>
    </div>
    <div class="account-layout">
      ${profileEditMode || !hasProfile ? profileForm : profileSummary}
      <section class="account-card">
        <h2>${t("orderHistory")}</h2>
        <div class="account-orders">
          ${
            customerOrders.length
              ? customerOrders
                  .map(
                    (order) => `
                      <article class="account-order">
                        <div>
                          <strong>${escapeAttribute(order.id)}</strong>
                          <span>${new Date(order.createdAt).toLocaleDateString(currentLang === "en" ? "en-CA" : "fr-CA")}</span>
                        </div>
                        <div>
                          <span>${orderStatusLabel(order.status)}</span>
                          <strong>${money.format(Number(order.totalAmount || 0))}</strong>
                        </div>
                        <p>${(order.items || []).map((item) => `${escapeAttribute(item.name)} x ${Number(item.quantity || 1)}`).join(" · ")}</p>
                      </article>
                    `
                  )
                  .join("")
              : `<p class="account-empty">${t("noOrders")}</p>`
          }
        </div>
      </section>
    </div>
  `;
  wireAddressAutocomplete(accountContent);
}

function renderCreateAccountPage() {
  if (!accountContent) return;
  accountContent.innerHTML = `
    <a class="back-link" href="/" data-home-link>${t("backShop")}</a>
    <p class="eyebrow">${t("account")}</p>
    <h1>${t("createAccount")}</h1>
    <p class="content-lead">${t("accountText")}</p>
    <form class="account-card account-form account-create-form" data-account-signup>
      <div class="form-row two">
        <label>${t("fullName")} <input name="name" autocomplete="name" required /></label>
        <label>${t("email")} <input name="email" type="email" autocomplete="email" required /></label>
      </div>
      <div class="form-row two">
        ${passwordInput("password", t("password"))}
        ${passwordInput("passwordConfirm", t("confirmPassword"))}
      </div>
      <div class="form-row two">
        <label>${t("phone")} <input name="phone" autocomplete="tel" /></label>
        <span></span>
      </div>
      <div class="form-row contact-row">
        <label>${t("address")} <input name="address" autocomplete="street-address" /></label>
        <label>${t("city")} <input name="city" autocomplete="address-level2" /></label>
      </div>
      <div class="form-row location-row">
        <label>${t("province")} <select name="province" autocomplete="address-level1">${provinceOptions("QC")}</select></label>
        <label>${t("postal")} <input name="postal" autocomplete="postal-code" /></label>
        <label>${t("deliveryNotes")} <input name="notes" /></label>
      </div>
      <label class="save-profile-option">
        <input name="marketingOptIn" type="checkbox" />
        <span>${t("marketingOptIn")}</span>
      </label>
      <button class="button primary" type="submit">${t("createAccount")}</button>
      <p class="form-status" role="status"></p>
    </form>
  `;
  wireAddressAutocomplete(accountContent);
}

function selectCategory(category, shouldScroll = false) {
  const previousScrollY = window.scrollY;
  resetShopFiltersForRoute();
  state.category = category;
  document.querySelectorAll("[data-category]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  renderProducts();
  if (shouldScroll) scrollToShopItems("smooth");
  else requestAnimationFrame(() => window.scrollTo({ top: previousScrollY, behavior: "auto" }));
}

function scrollToShopItems(behavior = "smooth") {
  const target = productGrid || document.querySelector("#productGrid") || document.querySelector("#shop");
  if (!target) return;
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 18);
  window.scrollTo({ top, behavior });
}

function scrollToProductDetailTop(behavior = "auto") {
  const target = document.querySelector("#productDetailPage");
  if (!target) return;
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight);
  window.scrollTo({ top, behavior });
}

function goToCategory(category, push = true, game = "Pokemon") {
  const path = categoryPath(category, game);
  resetShopFiltersForRoute();
  state.category = category;
  state.game = game || "Pokemon";
  if (push) history.pushState({ category }, "", path);
  applyRoute();
  if (path === "/") {
    requestAnimationFrame(() => document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" }));
    return;
  }
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
}

function applyRoute() {
  updatePageMeta();
  const isAdmin = window.location.pathname === "/admin";
  const isCheckout = window.location.pathname === "/checkout";
  const isAccount = window.location.pathname === "/compte";
  const isCreateAccount = window.location.pathname === "/creer-compte";
  const productMatch = window.location.pathname.match(/^\/produit\/([^/]+)$/);
  const contentMatch = window.location.pathname.match(/^\/(vendre|livraison|faq|apropos)$/);
  const isCategoryPage = Boolean(categoryRoutes[window.location.pathname] || gameRoutes[window.location.pathname]) && window.location.pathname !== "/";
  document.body.classList.toggle("admin-mode", isAdmin);
  document.body.classList.toggle("checkout-mode", isCheckout);
  document.body.classList.toggle("account-mode", isAccount || isCreateAccount);
  document.body.classList.toggle("product-mode", Boolean(productMatch));
  document.body.classList.toggle("content-mode", Boolean(contentMatch));
  document.body.classList.toggle("category-page", isCategoryPage);
  if (isCheckout) {
    renderCart();
    return;
  }
  if (isAdmin) {
    renderAdmin();
    return;
  }
  if (isCreateAccount) {
    closeAccountModal();
    renderCreateAccountPage();
    return;
  }
  if (isAccount) {
    renderAccount();
    loadCustomerOrders().then(renderAccount);
    return;
  }
  if (productMatch) {
    renderProductDetail(productMatch[1]);
    requestAnimationFrame(() => scrollToProductDetailTop("auto"));
    return;
  }
  if (contentMatch) {
    renderContentPage(contentMatch[1]);
    return;
  }
  const route = gameRoutes[window.location.pathname];
  const category = route?.category || categoryRoutes[window.location.pathname] || "all";
  state.category = category;
  state.game = route?.game || "Pokemon";
  if (conditionFilterSelect) conditionFilterSelect.value = state.conditionFilter;
  if (availabilityFilterSelect) availabilityFilterSelect.value = state.availabilityFilter;
  document.querySelectorAll("[data-category]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  document.querySelectorAll("[data-game-category]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.gameCategory === state.game);
  });
  renderProducts();
  renderCardShows();
  if (window.location.pathname !== "/" && (category !== "all" || state.game !== "Pokemon")) {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 160);
  }
}

function adminMoney(value) {
  return money.format(Number(value || 0));
}

function lineProfit(item) {
  return (Number(item.price || 0) - Number(item.cost || 0)) * Number(item.stock || 0);
}

function orderItemsMarkup(order) {
  return order.items
    .map(
      (item) => `
        <div class="sold-item">
          ${item.imageUrl ? `<img class="admin-photo" src="${item.imageUrl}" alt="" />` : ""}
          <div>
            <strong>${item.name}</strong><br />
            <span>${[
              item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : "",
              item.setName,
              item.cardNumber ? `#${item.cardNumber}` : "",
              item.rarity,
              item.condition,
            ]
              .filter(Boolean)
              .join(" - ")}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function orderRevenue(order) {
  return order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
}

function orderCost(order) {
  return order.items.reduce((sum, item) => sum + Number(item.cost || 0) * Number(item.quantity || 0), 0);
}

function percentText(value) {
  return new Intl.NumberFormat(currentLang === "en" ? "en-CA" : "fr-CA", { style: "percent", maximumFractionDigits: 1 }).format(Number(value || 0));
}

function renderAccounting(accounting) {
  if (accountingDashboard && accounting) {
    const rows = accounting.rows || [];
    const activeRows = rows.filter((row) => row.revenue || row.cost || row.netProfit);
    const bestCategory = activeRows.reduce(
      (best, row) => {
        const entries = [
          ["Singles", row.singles],
          ["Slabs", row.slabs],
          ["Scellé", row.sealed],
        ];
        const current = entries.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0];
        return Number(current?.[1] || 0) > Number(best.value || 0) ? { label: current[0], value: current[1] } : best;
      },
      { label: "-", value: 0 }
    );
    const totals = accounting.totals || {};
    accountingDashboard.innerHTML = `
      <div class="accounting-kpis">
        <div><span>Revenu brut</span><strong>${adminMoney(totals.revenue)}</strong></div>
        <div><span>Coût des items</span><strong>${adminMoney(totals.cost)}</strong></div>
        <div><span>Revenu net</span><strong>${adminMoney(totals.netProfit)}</strong></div>
        <div><span>TPS collectée</span><strong>${adminMoney(totals.tpsCollected)}</strong></div>
        <div><span>TVQ collectée</span><strong>${adminMoney(totals.tvqCollected)}</strong></div>
        <div><span>Meilleure catégorie</span><strong>${escapeAttribute(bestCategory.label)}</strong></div>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table accounting-table dashboard-like">
          <thead>
            <tr>
              <th>Mois</th>
              <th>Revenu brut</th>
              <th>Coût items</th>
              <th>Revenu net</th>
              <th>Singles</th>
              <th>Slabs</th>
              <th>Scellé</th>
              <th>Marge %</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    <td>${escapeAttribute(row.month)}</td>
                    <td>${adminMoney(row.revenue)}</td>
                    <td>${adminMoney(row.cost)}</td>
                    <td>${adminMoney(row.netProfit)}</td>
                    <td>${adminMoney(row.singles)}</td>
                    <td>${adminMoney(row.slabs)}</td>
                    <td>${adminMoney(row.sealed)}</td>
                    <td>${row.margin ? percentText(row.margin) : "-"}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

function syncDate(value) {
  return value ? new Date(value).toLocaleString("fr-CA", { dateStyle: "short", timeStyle: "short" }) : "-";
}

function adminVisibleInventory(items) {
  const search = adminInventoryView.search.trim().toLowerCase();
  return (items || [])
    .filter((item) => {
      if (adminInventoryView.category !== "all" && item.category !== adminInventoryView.category) return false;
      if (adminInventoryView.game !== "all" && productGame(item) !== adminInventoryView.game) return false;
      const status = getProductStatus(item);
      if (adminInventoryView.status === "available" && status !== "available" && status !== "preorder") return false;
      if (adminInventoryView.status === "draft" && item.status !== "draft") return false;
      if (adminInventoryView.status === "admin_draft" && item.status !== "admin_draft") return false;
      if (adminInventoryView.status === "sold" && status !== "sold") return false;
      if (adminInventoryView.status === "removed" && status !== "removed") return false;
      if (adminInventoryView.status === "review" && (Number(item.market || 0) > 0 || Number(item.price || 0) > 0)) return false;
      if (adminInventoryView.status === "dormant" && !isDormantAdminItem(item)) return false;
      if (!search) return true;
      const haystack = [
        item.name,
        productGame(item),
        item.category,
        item.kind,
        item.setName,
        item.cardNumber,
        item.rarity,
        item.condition,
        item.gradingCompany,
        item.grade,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    })
    .sort((a, b) => {
      if (adminInventoryView.sort === "name") return String(a.name || "").localeCompare(String(b.name || ""));
      if (adminInventoryView.sort === "priceDesc") return Number(b.price || 0) - Number(a.price || 0);
      if (adminInventoryView.sort === "priceAsc") return Number(a.price || 0) - Number(b.price || 0);
      if (adminInventoryView.sort === "profitDesc") return lineProfit(b) - lineProfit(a);
      if (adminInventoryView.sort === "marketDesc") return Number(b.market || 0) - Number(a.market || 0);
      if (adminInventoryView.sort === "stockDesc") return Number(b.stock || 0) - Number(a.stock || 0);
      if (adminInventoryView.sort === "dormant") return adminItemAgeDays(b) - adminItemAgeDays(a);
      return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
    });
}

function adminItemAgeDays(item) {
  const stamp = item.createdAt || item.updatedAt;
  const time = stamp ? new Date(stamp).getTime() : Date.now();
  return Math.max(0, Math.floor((Date.now() - time) / 86400000));
}

function isDormantAdminItem(item) {
  return adminItemAgeDays(item) >= 45 && Number(item.stock || 0) > 0 && !["draft", "admin_draft"].includes(item.status);
}

function adminItemMeta(item) {
  return [
    productGame(item),
    item.setName,
    item.cardNumber ? `#${item.cardNumber}` : "",
    item.rarity,
    item.condition,
    item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function adminProductThumb(item) {
  if (isSlabProduct(item)) return `<span class="admin-slab-thumb">${productVisual(item)}</span>`;
  if (item.imageUrl) return `<img class="admin-photo" src="${escapeAttribute(item.imageUrl)}" alt="" />`;
  return `<span class="cart-thumb admin-photo-fallback" style="--accent:${item.accent || "#d5742d"}">${productVisual(item)}</span>`;
}

function adminStatusPill(item) {
  const status = ["draft", "admin_draft"].includes(item.status) ? item.status : getProductStatus(item);
  const extra = isDormantAdminItem(item) ? "Dormant" : "";
  return `<span class="admin-status-pill status-${escapeAttribute(status)}">${escapeAttribute(statusLabel(status))}</span>${extra ? `<span class="admin-status-pill status-dormant">${extra}</span>` : ""}`;
}

function syncAdminFilterButtons() {
  document.querySelectorAll("[data-admin-status-filter]").forEach((button) => {
    button.classList.toggle("active", (button.dataset.adminStatusFilter || "all") === adminInventoryView.status);
  });
  document.querySelectorAll("[data-admin-category-filter]").forEach((button) => {
    button.classList.toggle("active", (button.dataset.adminCategoryFilter || "all") === adminInventoryView.category);
  });
  document.querySelectorAll("[data-admin-game-filter]").forEach((button) => {
    button.classList.toggle("active", (button.dataset.adminGameFilter || "all") === adminInventoryView.game);
  });
}

const adminSectionTitles = {
  inventory: "Inventaire",
  modifiers: "Modificateurs",
  sales: "Ventes",
  shows: "Card Shows",
};

function setAdminSection(section = "inventory") {
  activeAdminSection = adminSectionTitles[section] ? section : "inventory";
  adminContent?.setAttribute("data-admin-section", activeAdminSection);
  document.querySelectorAll("[data-admin-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminView === activeAdminSection);
  });
  document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.adminPanel === activeAdminSection);
  });
  if (adminPageTitle) adminPageTitle.textContent = adminSectionTitles[activeAdminSection] || "Inventaire";
  adminOpenAddButton?.classList.toggle("hidden", activeAdminSection !== "inventory");
  adminOpenCardShowButton?.classList.toggle("hidden", activeAdminSection !== "shows");
  adminOpenSessionButton?.classList.toggle("hidden", activeAdminSection !== "inventory");
  adminInventorySearch?.closest(".admin-command-search")?.classList.toggle("is-secondary", activeAdminSection !== "inventory");
}

function openAdminSection(section) {
  setAdminSection(section);
  closeAdminPanels();
  if (section === "inventory") adminInventorySearch?.focus({ preventScroll: true });
}

function focusCardShowForm() {
  setAdminSection("shows");
  const cardShowDetails = adminCardShowForm?.closest("details");
  if (cardShowDetails) cardShowDetails.open = true;
  adminCardShowForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.requestAnimationFrame(() => adminCardShowForm?.querySelector('input[name="name"]')?.focus({ preventScroll: true }));
}

function renderAdminSession(draftItems = []) {
  if (draftInventoryCount) draftInventoryCount.textContent = `${draftItems.length}`;
  if (publishDraftProductsButton) publishDraftProductsButton.disabled = draftItems.length === 0;
  if (adminSessionValue) {
    const total = draftItems.reduce((sum, item) => sum + Number(item.price || 0) * Math.max(1, Number(item.stock || 1)), 0);
    adminSessionValue.textContent = `Valeur approximative: ${adminMoney(total)}`;
  }
  if (!adminSessionList) return;
  adminSessionList.innerHTML = draftItems.length
    ? draftItems
        .map(
          (item) => `
            <article class="admin-session-item">
              ${adminProductThumb(item)}
              <div>
                <strong>${escapeAttribute(item.name)}</strong>
                <span>${escapeAttribute(adminItemMeta(item) || item.category || "")}</span>
              </div>
              <input type="number" min="0" step="0.01" value="${Number(item.price || item.market || 0)}" data-sale-price="${escapeAttribute(item.id)}" aria-label="Prix session ${escapeAttribute(item.name)}" />
              <button type="button" data-admin-edit="${escapeAttribute(item.id)}">Modifier</button>
              <button type="button" data-admin-remove="${escapeAttribute(item.id)}">Retirer</button>
            </article>
          `
        )
        .join("")
    : `<div class="admin-empty-state"><strong>Aucune carte en session.</strong><p>Ajoute des cartes avec le drawer d’ajout rapide, puis publie le lot quand tout est prêt.</p></div>`;
}

function quickBatchMoneyValues(line) {
  return [...line.matchAll(/(?:^|\s)\$?(\d+(?:[.,]\d{1,2})?)(?=\s*$|\s)/g)]
    .map((match) => ({ raw: match[0], value: Number(match[1].replace(",", ".")), index: match.index }))
    .filter((entry) => Number.isFinite(entry.value));
}

function quickBatchPriceSuggestion(market) {
  const value = Number(market || 0);
  if (!value) return 0;
  return Math.max(1, Math.round(value - 1));
}

function parseQuickBatchLine(line, game = "Pokemon") {
  const original = String(line || "").trim();
  if (!original) return null;
  let working = original;
  const moneyValues = quickBatchMoneyValues(original);
  const market = moneyValues.length ? moneyValues[moneyValues.length - 1].value : 0;
  const cost = moneyValues.length > 1 ? moneyValues[moneyValues.length - 2].value : 0;
  moneyValues
    .slice(-2)
    .reverse()
    .forEach((entry) => {
      working = `${working.slice(0, entry.index)} ${working.slice(entry.index + entry.raw.length)}`;
    });

  const gradeMatch = working.match(/\b(PSA|BGS|BECKETT|CGC|SGC|TAG)\s*(10|9|8|7|6|5|4|3|2|1)\b/i);
  const gradingCompany = gradeMatch ? gradeMatch[1].toUpperCase().replace("BGS", "Beckett") : "";
  const grade = gradeMatch ? gradeMatch[2] : "";
  if (gradeMatch) working = working.replace(gradeMatch[0], " ");

  const conditionMatch = working.match(/\b(NM|LP|MP|HP|DMG|DAMAGED|SCELL[ÉE]?\s+PARFAIT|SCELL[ÉE]?\s+ENDOMMAG[ÉE]?)\b/i);
  let condition = conditionMatch ? conditionMatch[0].toUpperCase() : "";
  if (condition === "HP") condition = "Damaged";
  if (condition === "DMG") condition = "Damaged";
  if (/DAMAGED/i.test(condition)) condition = "Damaged";
  if (/SCELL/i.test(condition)) condition = /ENDOMMAG/i.test(condition) ? "Scellé endommagé" : "Scellé parfait";
  if (conditionMatch) working = working.replace(conditionMatch[0], " ");

  const cardNumberMatch = working.match(/\b(?:#\s*)?([A-Z]{0,4}\d{1,4}[a-z]?\/?\d{0,4}[a-z]?)\b/i);
  const cardNumber = cardNumberMatch ? cardNumberMatch[1] : "";
  if (cardNumberMatch && /\/|^[A-Z]{1,4}\d|\d{2,4}[a-z]?$/i.test(cardNumber)) {
    working = working.replace(cardNumberMatch[0], " ");
  }

  const sealedMatch = working.match(/\b(ETB|UTB|BOOSTER\s*BOX|BOOSTER\s*BUNDLE|BUNDLE|PACK|SEALED|TIN|BOX|BO[ÎI]TE)\b/i);
  const slabCategory = Boolean(gradingCompany);
  const sealedCategory = Boolean(sealedMatch);
  const category = slabCategory ? "Graded" : sealedCategory ? "Sealed" : "Singles";
  const kind = slabCategory
    ? "slab"
    : sealedCategory
    ? /ETB/i.test(sealedMatch[0])
      ? "etb"
      : /UTB/i.test(sealedMatch[0])
      ? "utb"
      : /BOOSTER\s*BOX/i.test(sealedMatch[0])
      ? "booster-box"
      : /BUNDLE/i.test(sealedMatch[0])
      ? "booster-bundle"
      : /PACK/i.test(sealedMatch[0])
      ? "pack"
      : "box"
    : "single";

  const name = working
    .replace(/\b(ETB|UTB|BOOSTER\s*BOX|BOOSTER\s*BUNDLE|BUNDLE|PACK|SEALED|TIN|BOX|BO[ÎI]TE)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const displayName = name || original.replace(/\s+/g, " ").trim();

  return {
    name: displayName,
    game,
    category,
    kind,
    status: "draft",
    cardNumber,
    condition: condition || (sealedCategory ? "Scellé parfait" : slabCategory ? "" : "NM"),
    gradingCompany,
    grade,
    stock: 1,
    cost,
    market,
    price: market ? quickBatchPriceSuggestion(market) : 0,
    priceAuto: false,
    featured: false,
    heroFeatured: false,
    homepageCollection: "",
    badge: "",
    features: [],
  };
}

function quickBatchItems() {
  const game = quickBatchGame?.value || "Pokemon";
  return String(quickBatchInput?.value || "")
    .split(/\r?\n/)
    .map((line) => parseQuickBatchLine(line, game))
    .filter(Boolean);
}

function renderQuickBatchPreview() {
  if (!quickBatchPreview) return [];
  const items = quickBatchItems();
  quickBatchPreview.classList.toggle("hidden", items.length === 0);
  quickBatchPreview.innerHTML = items.length
    ? `
      <div class="quick-batch-preview-head">
        <strong>${items.length} item${items.length > 1 ? "s" : ""} détecté${items.length > 1 ? "s" : ""}</strong>
        <span>Ils seront créés en brouillons de session.</span>
      </div>
      ${items
        .map(
          (item) => `
            <article class="quick-batch-row">
              <div>
                <strong>${escapeAttribute(item.name)}</strong>
                <span>${escapeAttribute([item.category === "Graded" ? "Slab" : item.category, item.cardNumber ? `#${item.cardNumber}` : "", item.condition, item.gradingCompany && item.grade ? `${item.gradingCompany} ${item.grade}` : ""].filter(Boolean).join(" · "))}</span>
              </div>
              <small>Payé ${adminMoney(item.cost)} · Marché ${adminMoney(item.market)} · Affiché ${adminMoney(item.price)}</small>
            </article>
          `
        )
        .join("")}
    `
    : "";
  if (quickBatchStatus) quickBatchStatus.textContent = items.length ? "Prévisualisation prête. Corrige les lignes si nécessaire, puis crée les brouillons." : "Ajoute au moins une ligne.";
  return items;
}

async function createQuickBatchDrafts() {
  const items = renderQuickBatchPreview();
  if (!items.length || !quickBatchCreateButton) return;
  quickBatchCreateButton.disabled = true;
  quickBatchCreateButton.textContent = "Création...";
  if (quickBatchStatus) quickBatchStatus.textContent = "Création des brouillons de session...";
  let created = 0;
  try {
    for (const [index, item] of items.entries()) {
      const slug = String(item.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 42);
      await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({ ...item, id: `batch-${Date.now()}-${index + 1}-${slug || "item"}` }),
      });
      created += 1;
    }
    quickBatchInput.value = "";
    await loadProducts();
    renderProducts();
    await renderAdmin();
    openAdminSessionDrawer();
    if (quickBatchStatus) quickBatchStatus.textContent = `${created} brouillon${created > 1 ? "s" : ""} créé${created > 1 ? "s" : ""}. Tu peux maintenant valider et publier la session.`;
  } catch (error) {
    if (quickBatchStatus) quickBatchStatus.textContent = `Création partielle: ${created} item${created > 1 ? "s" : ""}. ${error.message}`;
  } finally {
    quickBatchCreateButton.textContent = "Créer les brouillons";
    quickBatchCreateButton.disabled = false;
  }
}

function renderAdminInventoryRow(item) {
  const profit = lineProfit(item);
  const newArrivalActive = isNewArrivalFavorite(item);
  return `
    <tr class="admin-inventory-row" data-admin-open-item="${escapeAttribute(item.id)}">
      <td data-label="Item">
        <div class="admin-item">
          <button
            class="admin-favorite-button ${newArrivalActive ? "active" : ""}"
            type="button"
            data-admin-toggle-new="${escapeAttribute(item.id)}"
            aria-label="${newArrivalActive ? "Retirer des nouveautés" : "Afficher dans les nouveautés"}"
            title="${newArrivalActive ? "Retirer de Ce qui vient d’arriver" : "Mettre dans Ce qui vient d’arriver"}"
          >★</button>
          ${adminProductThumb(item)}
          <div>
            <strong>${escapeAttribute(item.name)}</strong><br />
            <span>${escapeAttribute(adminItemMeta(item) || "Détails à compléter")}</span>
          </div>
        </div>
      </td>
      <td data-label="Catégorie">${escapeAttribute(item.category || "-")}</td>
      <td data-label="Stock">${Number(item.stock || 0)}${Number(item.reservedQuantity || 0) > 0 ? ` <small>(${item.reservedQuantity} réservé)</small>` : ""}</td>
      <td data-label="Payé">${adminMoney(item.cost)}</td>
      <td data-label="Marché">${adminMoney(item.market)}</td>
      <td data-label="Affiché">${Number(item.compareAtPrice || 0) > Number(item.price || 0) ? `<span class="admin-old-price">${adminMoney(item.compareAtPrice)}</span><br />` : ""}${adminMoney(item.price)}</td>
      <td data-label="Profit" class="${profit >= 0 ? "admin-profit-positive" : "admin-profit-negative"}">${adminMoney(profit)}</td>
      <td data-label="Statut">${adminStatusPill(item)}</td>
      <td data-label="Actions" class="admin-row-actions">
        <details class="admin-action-menu">
          <summary aria-label="Actions pour ${escapeAttribute(item.name)}">⋯</summary>
          <div>
            <button type="button" data-admin-edit="${escapeAttribute(item.id)}">Modifier</button>
            <button type="button" data-admin-price-adjust="${escapeAttribute(item.id)}">Ajuster le prix</button>
            <button type="button" data-admin-sale="${escapeAttribute(item.id)}" ${Number(item.stock || 0) <= 0 ? "disabled" : ""}>Marquer vendue</button>
            <button type="button" data-admin-remove="${escapeAttribute(item.id)}">Retirer de la boutique</button>
            <button type="button" data-admin-duplicate="${escapeAttribute(item.id)}">Dupliquer</button>
            <button type="button" data-admin-add-session="${escapeAttribute(item.id)}">Ajouter à la session</button>
            <button type="button" data-admin-view-product="${escapeAttribute(item.id)}">Voir dans la boutique</button>
            <button type="button" data-admin-delete="${escapeAttribute(item.id)}">Supprimer</button>
          </div>
        </details>
      </td>
    </tr>
  `;
}

function merchStatusLabel(section, product) {
  const decision = merchDecision(section, product.id);
  if (decision?.status === "locked") return "Verrouillé";
  if (decision?.status === "accepted") return "Accepté";
  if (decision?.status === "excluded") return "Exclu";
  if (isMerchValidated(section, product)) return "Manuel";
  return "Suggestion";
}

function merchandisingReasonList(score) {
  const reasons = score.reasons?.length ? score.reasons : ["Signaux insuffisants, recommandation prudente."];
  const penalties = score.penalties?.length ? score.penalties : [];
  return `
    <ul>
      ${reasons.slice(0, 4).map((reason) => `<li>${escapeAttribute(reason)}</li>`).join("")}
      ${penalties.slice(0, 2).map((penalty) => `<li class="penalty">${escapeAttribute(penalty)}</li>`).join("")}
    </ul>
  `;
}

function merchandisingSuggestionCard(product, section, index, options = {}) {
  const score = calculateMerchandisingScore(product);
  const decision = merchDecision(section, product.id);
  const isLocked = decision?.status === "locked";
  const alternatives = options.showAlternatives
    ? rankedMerchProducts(adminInventoryCache, section, {
        max: 3,
        minScore: section === "one-piece" ? 35 : section === "accessible" ? 40 : 35,
        filter:
          section === "one-piece"
            ? (candidate) => productGame(candidate) === "One Piece"
            : section === "accessible"
            ? (candidate) => Number(candidate.price || 0) >= 15 && Number(candidate.price || 0) <= 75
            : undefined,
      }).filter((candidate) => candidate.id !== product.id)
    : [];

  return `
    <article class="merchandising-card ${isLocked ? "is-locked" : ""}">
      <div class="merchandising-product">
        ${adminProductThumb(product)}
        <div>
          <div class="merchandising-title-line">
            <strong>${escapeAttribute(product.name)}</strong>
            <span>${escapeAttribute(merchStatusLabel(section, product))}</span>
          </div>
          <p>${escapeAttribute(adminItemMeta(product) || product.category || "")}</p>
          <div class="merchandising-meta">
            <span>${adminMoney(product.price)}</span>
            <span>Score ${score.score}/100</span>
            <span>Confiance ${score.confidence}</span>
          </div>
        </div>
      </div>
      <div class="merchandising-score">
        <div>
          <span>Placement recommandé</span>
          <strong>${escapeAttribute(score.placement)}</strong>
        </div>
        <div>
          <span>Dernière mise en avant</span>
          <strong>${escapeAttribute(product.lastFeaturedAt ? new Date(product.lastFeaturedAt).toLocaleDateString("fr-CA") : "Jamais")}</strong>
        </div>
      </div>
      ${merchandisingReasonList(score)}
      <div class="merchandising-card-actions">
        <button type="button" data-merch-action="accept" data-merch-section="${escapeAttribute(section)}" data-merch-product="${escapeAttribute(product.id)}">Accepter</button>
        <button type="button" data-merch-action="replace" data-merch-section="${escapeAttribute(section)}" data-merch-product="${escapeAttribute(product.id)}">Remplacer</button>
        <button type="button" data-merch-action="lock" data-merch-section="${escapeAttribute(section)}" data-merch-product="${escapeAttribute(product.id)}">${isLocked ? "Déjà verrouillé" : "Verrouiller"}</button>
        <button type="button" data-merch-action="exclude" data-merch-section="${escapeAttribute(section)}" data-merch-product="${escapeAttribute(product.id)}">Exclure</button>
      </div>
      ${
        alternatives.length
          ? `<div class="merchandising-alternatives">
              <span>Alternatives</span>
              ${alternatives
                .map((candidate) => {
                  const candidateScore = calculateMerchandisingScore(candidate);
                  return `<button type="button" data-merch-action="accept" data-merch-section="${escapeAttribute(section)}" data-merch-product="${escapeAttribute(candidate.id)}">${escapeAttribute(candidate.name)} · ${candidateScore.score}/100</button>`;
                })
                .join("")}
            </div>`
          : ""
      }
    </article>
  `;
}

function renderMerchandisingAdmin(products = adminInventoryCache) {
  if (!merchandisingSections) return;
  const selections = buildMerchandisingSelections(products, { includeSuggestions: true });
  const sectionOrder = ["vitrine", "new", "one-piece", "accessible", "dormant", "content"];
  merchandisingSections.innerHTML = sectionOrder
    .map((section) => {
      const config = merchandisingSectionsConfig[section];
      const suggestions = selections.suggestions?.[section] || [];
      const publicSelection = selections[section] || [];
      const countText =
        section === "dormant" || section === "content"
          ? `${suggestions.length} suggestion${suggestions.length > 1 ? "s" : ""} interne${suggestions.length > 1 ? "s" : ""}`
          : `${publicSelection.length}/${config.max} validé${publicSelection.length > 1 ? "s" : ""}`;
      return `
        <details class="merchandising-panel" ${section === "vitrine" ? "open" : ""}>
          <summary>
            <span>${escapeAttribute(config.title)}</span>
            <small>${escapeAttribute(countText)}</small>
          </summary>
          <p>${escapeAttribute(config.description)}</p>
          <div class="merchandising-grid">
            ${
              suggestions.length
                ? suggestions
                    .slice(0, config.max)
                    .map((product, index) =>
                      merchandisingSuggestionCard(product, section, index, {
                        showAlternatives: merchandisingAlternativeSection === `${section}:${product.id}`,
                      })
                    )
                    .join("")
                : `<div class="admin-empty-state"><strong>Aucun produit admissible.</strong><p>Il faut des produits réels, en ligne, en stock et avec image valide.</p></div>`
            }
          </div>
        </details>
      `;
    })
    .join("");
}

async function renderAdmin() {
  if (!adminPage) return;
  syncAdminFilterButtons();
  let payload;
  try {
    payload = await api("/api/admin/summary");
  } catch (error) {
    showAdminLogin(error.message);
    return;
  }
  showAdminContent();
  setAdminSection(activeAdminSection);
  const {
    summary,
    inventory: adminInventory,
    orders,
    accounting,
    priceSync,
    cardShows: adminCardShows = [],
    reviews: adminReviews = [],
    newArrivalSlides: adminNewArrivalSlides = [],
    merchandising,
  } = payload;
  adminInventoryCache = adminInventory || [];
  merchandisingState = merchandising || { decisions: {}, history: [], updatedAt: "" };
  cardShows = adminCardShows || [];
  reviews = adminReviews || [];
  newArrivalSlides = adminNewArrivalSlides || [];
  const watchCount = adminInventoryCache.filter((item) => isDormantAdminItem(item) || item.status === "review").length;
  adminMetrics.innerHTML = [
    ["Produits actifs", summary.activeItems || 0],
    ["Valeur payée", adminMoney(summary.inventoryValue)],
    ["Valeur affichée", adminMoney(summary.listedValue || summary.marketValue)],
    ["Profit potentiel", adminMoney(summary.potentialProfit)],
    ["À surveiller", watchCount],
  ]
    .map(([label, value]) => `<div class="metric-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  if (adminPriceSync) adminPriceSync.textContent = "";
  renderAccounting(accounting);
  const draftItems = adminInventoryCache.filter((item) => item.status === "draft");
  renderAdminSession(draftItems);
  renderMerchandisingAdmin(adminInventoryCache);

  if (adminCardShowRows) {
    adminCardShowRows.innerHTML = cardShows.length
      ? cardShows
          .slice()
          .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
          .map(
            (show) => `
              <tr>
                <td>
                  <div class="admin-item">
                    ${show.imageUrl ? `<img class="admin-photo" src="${escapeAttribute(show.imageUrl)}" alt="" />` : ""}
                    <div>
                      <strong>${escapeAttribute(show.name)}</strong><br />
                      <span>${escapeAttribute(show.location || "")}</span>
                    </div>
                  </div>
                </td>
                <td>${escapeAttribute(show.city || "-")}</td>
                <td>${escapeAttribute([formatShowDateRange(show), show.time].filter(Boolean).join(" - ") || "-")}</td>
                <td>${escapeAttribute(show.tables || "-")}</td>
                <td>${escapeAttribute(show.collaborator || "-")}</td>
                <td>
                  <div class="sale-inline">
                    <button class="sale-button edit-button" type="button" data-edit-show="${escapeAttribute(show.id)}">Modifier</button>
                    <button class="sale-button" type="button" data-delete-show="${escapeAttribute(show.id)}">Enlever</button>
                  </div>
                </td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="6">Aucun card show pour le moment.</td></tr>`;
  }

  if (adminReviewRows) {
    adminReviewRows.innerHTML = reviews.length
      ? reviews
          .slice()
          .sort((a, b) => String(b.date || b.createdAt || "").localeCompare(String(a.date || a.createdAt || "")))
          .map(
            (review) => `
              <tr>
                <td>
                  <div class="admin-review-client">
                    ${
                      review.photoUrl
                        ? `<img class="admin-review-photo" src="${escapeAttribute(review.photoUrl)}" alt="" />`
                        : `<span class="admin-review-photo admin-review-initial">${escapeAttribute(String(review.name || "C").slice(0, 1))}</span>`
                    }
                    <div>
                      <strong>${escapeAttribute(review.name)}</strong><br />
                      <span>${escapeAttribute(review.city || "-")}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>${escapeAttribute(review.product || "Avis général")}</strong><br />
                  <span>${escapeAttribute(review.text)}</span>
                </td>
                <td>${reviewStars(review.rating)}</td>
                <td>${review.published === false ? "Masqué" : "Publié"}</td>
                <td>
                  <div class="sale-inline">
                    <button class="sale-button edit-button" type="button" data-edit-review="${escapeAttribute(review.id)}">Modifier</button>
                    <button class="sale-button" type="button" data-delete-review="${escapeAttribute(review.id)}">Enlever</button>
                  </div>
                </td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="5">Aucun avis pour le moment.</td></tr>`;
  }

  if (adminNewArrivalSlideRows) {
    adminNewArrivalSlideRows.innerHTML = newArrivalSlides.length
      ? newArrivalSlides
          .slice()
          .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")))
          .map(
            (slide) => `
              <tr>
                <td>
                  <div class="admin-item">
                    ${slide.imageUrl ? `<img class="admin-photo" src="${escapeAttribute(slide.imageUrl)}" alt="" />` : ""}
                    <div>
                      <strong>${escapeAttribute(slide.title || "Slide nouveautés")}</strong><br />
                      <span>${escapeAttribute(slide.updatedAt ? new Date(slide.updatedAt).toLocaleDateString("fr-CA") : "-")}</span>
                    </div>
                  </div>
                </td>
                <td>${escapeAttribute(slide.href || "-")}</td>
                <td>${slide.active === false ? "Masqué" : "Publié"}</td>
                <td>
                  <div class="sale-inline">
                    <button class="sale-button edit-button" type="button" data-edit-new-slide="${escapeAttribute(slide.id)}">Modifier</button>
                    <button class="sale-button" type="button" data-delete-new-slide="${escapeAttribute(slide.id)}">Enlever</button>
                  </div>
                </td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="4">Aucun slide pour le moment.</td></tr>`;
  }

  const visibleAdminInventory = adminVisibleInventory(adminInventory);
  adminInventoryRows.innerHTML = visibleAdminInventory.length
    ? visibleAdminInventory
        .map(renderAdminInventoryRow)
        .join("")
    : `<tr><td colspan="9">Aucun item ne correspond à la recherche.</td></tr>`;

  const soldOrders = orders.filter((order) => ["paid", "admin_sale"].includes(order.status));
  adminOrderRows.innerHTML = soldOrders.length
    ? soldOrders
        .slice()
        .reverse()
        .map((order) => {
          const revenue = orderRevenue(order);
          const cost = orderCost(order);
          return `
            <tr>
              <td><strong>${order.id}</strong></td>
              <td>${new Date(order.createdAt).toLocaleDateString("fr-CA")}</td>
              <td>${orderItemsMarkup(order)}</td>
              <td>${adminMoney(revenue)}</td>
              <td>${adminMoney(cost)}</td>
              <td>
                <div class="sale-inline">
                  <span>${adminMoney(revenue - cost)}</span>
                  <span>${statusLabel(order.status)}</span>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="6">Aucune vente pour le moment.</td></tr>`;
}

function toggleAdminLinks(visible) {
  document.querySelectorAll("[data-admin-link]").forEach((link) => {
    link.hidden = !visible;
  });
}

function showAdminLogin(message = "") {
  document.body.classList.add("admin-locked");
  adminLogin?.classList.remove("hidden");
  adminContent?.classList.add("hidden");
  if (adminLoginStatus) {
    adminLoginStatus.textContent = message && !message.includes("requise") ? message : "";
  }
}

function showAdminContent() {
  document.body.classList.remove("admin-locked");
  adminLogin?.classList.add("hidden");
  adminContent?.classList.remove("hidden");
  toggleAdminLinks(true);
}

async function downloadAdminReport(link) {
  if (!link) return;
  const filename = link.dataset.reportDownload || "coffee-break-rapport.csv";
  if (reportStatus) reportStatus.textContent = "Préparation du rapport...";
  try {
    const response = await fetch(link.href, { credentials: "include" });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "Export impossible pour le moment.");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 1500);
    if (reportStatus) reportStatus.textContent = `Rapport prêt: ${filename}`;
  } catch (error) {
    if (reportStatus) reportStatus.textContent = error.message;
  }
}

async function refreshAdminState() {
  try {
    await api("/api/admin/me");
    toggleAdminLinks(true);
  } catch {
    toggleAdminLinks(false);
  }
}

async function registerAdminSale(id, button, soldPriceOverride = null) {
  if (!id || !button) return;
  const priceInput = document.querySelector(`[data-sale-price="${CSS.escape(id)}"]`);
  const soldPrice = Number(String(soldPriceOverride ?? priceInput?.value ?? 0).replace(",", "."));
  if (!soldPrice || soldPrice < 0) {
    if (adminPriceSync) adminPriceSync.textContent = "Entre le prix vendu avant d'enregistrer la vente.";
    return;
  }
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Vendu...";
  try {
    const payload = await api("/api/admin/sales", {
      method: "POST",
      body: JSON.stringify({ id, soldPrice }),
    });
    if (adminPriceSync) {
      adminPriceSync.textContent = `Vente rapide enregistrée: ${payload.order.items[0].name}. Stock mis à jour.`;
    }
    await loadProducts();
    renderProducts();
    renderAdmin();
    closeAdminPanels();
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = originalText || "Vente";
  }
}

async function applyAdminDiscount(id, button, priceOverride = null) {
  if (!id || !button) return;
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;
  const currentPrice = Number(item.price || 0);
  const priceInput = document.querySelector(`[data-sale-price="${CSS.escape(id)}"]`);
  const newPrice = Number(String(priceOverride ?? priceInput?.value ?? "").replace(",", "."));
  if (!Number.isFinite(newPrice) || newPrice <= 0) {
    if (adminPriceSync) adminPriceSync.textContent = "Entre le nouveau prix avant d'enregistrer l'ajustement.";
    return;
  }
  if (currentPrice > 0 && newPrice >= currentPrice) {
    if (adminPriceSync) adminPriceSync.textContent = "Le nouveau prix doit être plus bas que le prix actuel.";
    return;
  }
  button.disabled = true;
  button.textContent = "Ajustement...";
  try {
    const payload = await api("/api/admin/products/discount", {
      method: "POST",
      body: JSON.stringify({ id, price: newPrice }),
    });
    inventory = payload.inventory || inventory;
    adminInventoryCache = payload.inventory || adminInventoryCache;
    renderProducts();
    await renderAdmin();
    closeAdminPanels();
    if (adminPriceSync) adminPriceSync.textContent = `Prix ajusté: ${item.name} est passé de ${adminMoney(currentPrice)} à ${adminMoney(newPrice)}.`;
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = "Enregistrer le prix";
  }
}

async function removeAdminItem(id, button) {
  if (!id || !button) return;
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;
  const confirmed = window.confirm(`Retirer "${item.name}" de l’inventaire?\n\nCette action l’enlève de la vitrine sans l’ajouter aux ventes.`);
  if (!confirmed) return;
  button.disabled = true;
  button.textContent = "Retrait...";
  try {
    const payload = await api("/api/admin/products/remove", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    inventory = payload.inventory || inventory;
    adminInventoryCache = payload.inventory || adminInventoryCache;
    cart = cart.filter((line) => line.id !== id);
    saveCart();
    renderProducts();
    await renderAdmin();
    if (adminPriceSync) adminPriceSync.textContent = `${item.name} a été retiré de l’inventaire.`;
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = "Retirer";
  }
}

function productPayloadFromAdminItem(item, overrides = {}) {
  return {
    id: item.id,
    name: item.name,
    setId: item.setId,
    setName: item.setName,
    category: item.category,
    kind: item.kind,
    status: item.status,
    rarity: item.rarity,
    cardNumber: item.cardNumber,
    condition: item.condition,
    gradingCompany: item.gradingCompany,
    grade: item.grade,
    stock: item.stock,
    cost: item.cost,
    market: item.market,
    price: item.price,
    featured: Boolean(item.featured),
    heroFeatured: Boolean(item.heroFeatured),
    featuredRank: item.featuredRank,
    homepageCollection: item.homepageCollection,
    badge: item.badge,
    features: item.features || [],
    imageUrl: item.imageUrl,
    galleryImageUrls: item.galleryImages || [],
    ...overrides,
  };
}

async function addAdminItemToSession(id, button) {
  if (!id || !button) return;
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Ajout...";
  try {
    const payload = await api("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(productPayloadFromAdminItem(item, { status: "draft" })),
    });
    const updated = payload.product || { ...item, status: "draft" };
    adminInventoryCache = adminInventoryCache.map((candidate) => (candidate.id === id ? updated : candidate));
    inventory = inventory.map((candidate) => (candidate.id === id ? updated : candidate));
    await loadProducts();
    renderProducts();
    await renderAdmin();
    if (adminPriceSync) adminPriceSync.textContent = `${item.name} a été ajouté à la session.`;
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = originalText || "Ajouter à la session";
  }
}

async function toggleAdminNewArrival(id, button) {
  if (!id || !button) return;
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;
  const nextIsActive = !isNewArrivalFavorite(item);
  button.disabled = true;
  try {
    const payload = await api("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(
        productPayloadFromAdminItem(item, {
          homepageCollection: nextIsActive ? "new" : "",
          featured: Boolean(item.featured),
          heroFeatured: Boolean(item.heroFeatured),
        })
      ),
    });
    const updated = payload.product || { ...item, homepageCollection: nextIsActive ? "new" : "" };
    adminInventoryCache = adminInventoryCache.map((candidate) => (candidate.id === id ? updated : candidate));
    inventory = inventory.map((candidate) => (candidate.id === id ? updated : candidate));
    await loadProducts();
    renderProducts();
    await renderAdmin();
    renderNewArrivalsCarousel();
    if (adminPriceSync) {
      adminPriceSync.textContent = nextIsActive
        ? `${item.name} apparaît maintenant dans Ce qui vient d’arriver.`
        : `${item.name} a été retiré de Ce qui vient d’arriver.`;
      adminPriceSync.classList.remove("hidden");
    }
  } catch (error) {
    if (adminPriceSync) {
      adminPriceSync.textContent = error.message;
      adminPriceSync.classList.remove("hidden");
    }
    button.disabled = false;
  }
}

async function deleteAdminItem(id, button) {
  if (!id || !button) return;
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;
  const confirmed = window.confirm(`Supprimer définitivement "${item.name}"?\n\nUtilise plutôt "Retirer de la boutique" si tu veux garder une trace.`);
  if (!confirmed) return;
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Suppression...";
  try {
    const payload = await api("/api/admin/products/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    inventory = payload.inventory || inventory.filter((candidate) => candidate.id !== id);
    adminInventoryCache = payload.inventory || adminInventoryCache.filter((candidate) => candidate.id !== id);
    cart = cart.filter((line) => line.id !== id);
    saveCart();
    renderProducts();
    await renderAdmin();
    closeAdminPanels();
    if (adminPriceSync) adminPriceSync.textContent = `${item.name} a été supprimé.`;
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = originalText || "Supprimer";
  }
}

async function publishDraftProducts() {
  if (!publishDraftProductsButton) return;
  publishDraftProductsButton.disabled = true;
  publishDraftProductsButton.textContent = "Publication...";
  if (publishDraftStatus) publishDraftStatus.textContent = "";
  try {
    const payload = await api("/api/admin/products/publish-drafts", { method: "POST", body: "{}" });
    inventory = payload.inventory || inventory;
    adminInventoryCache = payload.inventory || adminInventoryCache;
    await loadProducts();
    renderProducts();
    await renderAdmin();
    if (publishDraftStatus) {
      publishDraftStatus.textContent = `${payload.published || 0} item${payload.published > 1 ? "s" : ""} publié${payload.published > 1 ? "s" : ""} sur le site.`;
    }
  } catch (error) {
    if (publishDraftStatus) publishDraftStatus.textContent = error.message;
  } finally {
    publishDraftProductsButton.textContent = "Mettre sur le site";
    publishDraftProductsButton.disabled = adminInventoryCache.filter((item) => item.status === "draft").length === 0;
  }
}

async function applyMerchandisingAction({ section, productId, action, button }) {
  if (!section || !productId || !action) return;
  if (action === "replace") {
    merchandisingAlternativeSection = merchandisingAlternativeSection === `${section}:${productId}` ? "" : `${section}:${productId}`;
    renderMerchandisingAdmin(adminInventoryCache);
    return;
  }
  const product = adminInventoryCache.find((item) => item.id === productId);
  button.disabled = true;
  const previousText = button.textContent;
  button.textContent = "Sauvegarde...";
  try {
    const score = product ? calculateMerchandisingScore(product) : null;
    const payload = await api("/api/admin/merchandising", {
      method: "POST",
      body: JSON.stringify({
        action,
        section,
        productId,
        score: score?.score,
        reasons: score?.reasons || [],
        penalties: score?.penalties || [],
        placement: score?.placement || "",
        confidence: score?.confidence || "",
      }),
    });
    merchandisingState = payload.merchandising || merchandisingState;
    adminInventoryCache = payload.inventory || adminInventoryCache;
    inventory = payload.publicInventory || inventory;
    renderMerchandisingAdmin(adminInventoryCache);
    renderProducts();
    if (merchandisingStatus) {
      const labels = { accept: "accepté", lock: "verrouillé", exclude: "exclu" };
      merchandisingStatus.textContent = `${product?.name || "Produit"} ${labels[action] || "mis à jour"}.`;
    }
  } catch (error) {
    if (merchandisingStatus) merchandisingStatus.textContent = error.message;
    button.disabled = false;
    button.textContent = previousText;
  }
}

async function resetMerchandisingSuggestions(button) {
  if (!button) return;
  button.disabled = true;
  const previousText = button.textContent;
  button.textContent = "Réinitialisation...";
  try {
    const payload = await api("/api/admin/merchandising", {
      method: "POST",
      body: JSON.stringify({ action: "reset-unlocked" }),
    });
    merchandisingState = payload.merchandising || merchandisingState;
    adminInventoryCache = payload.inventory || adminInventoryCache;
    inventory = payload.publicInventory || inventory;
    renderMerchandisingAdmin(adminInventoryCache);
    renderProducts();
    if (merchandisingStatus) merchandisingStatus.textContent = "Suggestions non verrouillées réinitialisées.";
  } catch (error) {
    if (merchandisingStatus) merchandisingStatus.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = previousText;
  }
}

async function cancelPendingOrder(id, button) {
  if (!id || !button) return;
  button.disabled = true;
  button.textContent = "Retour...";
  try {
    const payload = await api("/api/admin/orders/cancel", {
      method: "POST",
      body: JSON.stringify({ id, reason: "Paiement non reçu" }),
    });
    if (adminPriceSync) {
      adminPriceSync.textContent = `Commande ${payload.order.id} annulée. Les items réservés sont revenus en stock.`;
    }
    await loadProducts();
    renderProducts();
    renderAdmin();
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = "Remettre en vitrine";
  }
}

async function markPendingOrderPaid(id, button) {
  if (!id || !button) return;
  button.disabled = true;
  button.textContent = "Vente...";
  try {
    const payload = await api("/api/admin/orders/paid", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    if (adminPriceSync) {
      adminPriceSync.textContent = `Commande ${payload.order.id} marquée payée. Les montants sont ajoutés au tableau de bord.`;
    }
    await loadProducts();
    renderProducts();
    renderAdmin();
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
    button.disabled = false;
    button.textContent = "Paiement reçu";
  }
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fileToDataUrl(file) {
  if (!file || !file.size) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject(reader.error || new Error("Image illisible"));
    reader.readAsDataURL(file);
  });
}

async function filesToDataUrls(fileList, limit = 4) {
  const files = [...(fileList || [])].filter((file) => file && file.size).slice(0, limit);
  return Promise.all(files.map((file) => fileToDataUrl(file)));
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function editCardShow(id) {
  const show = cardShows.find((item) => item.id === id);
  if (!show || !adminCardShowForm) return;
  ["id", "name", "location", "city", "date", "dateEnd", "time", "tables", "collaborator", "announcementUrl", "imageUrl"].forEach((field) => {
    const input = adminCardShowForm.querySelector(`[name="${field}"]`);
    if (input) input.value = show[field] || "";
  });
  if (cardShowImagePreview) {
    cardShowImagePreview.classList.toggle("hidden", !show.imageUrl);
    cardShowImagePreview.innerHTML = show.imageUrl
      ? `<img src="${escapeAttribute(show.imageUrl)}" alt="" /><span>Image actuelle</span>`
      : "";
  }
  if (cardShowStatus) cardShowStatus.textContent = `Modification de ${show.name}.`;
  adminCardShowForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function editReview(id) {
  const review = reviews.find((item) => item.id === id);
  if (!review || !adminReviewForm) return;
  ["id", "name", "city", "rating", "product", "date", "text"].forEach((field) => {
    const input = adminReviewForm.querySelector(`[name="${field}"]`);
    if (input) input.value = review[field] || "";
  });
  const published = adminReviewForm.querySelector('[name="published"]');
  if (published) published.checked = review.published !== false;
  if (reviewStatus) reviewStatus.textContent = `Modification de l’avis de ${review.name}.`;
  adminReviewForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function editNewArrivalSlide(id) {
  const slide = newArrivalSlides.find((item) => item.id === id);
  if (!slide || !adminNewArrivalSlideForm) return;
  ["id", "title", "href", "imageUrl"].forEach((field) => {
    const input = adminNewArrivalSlideForm.querySelector(`[name="${field}"]`);
    if (input) input.value = slide[field] || "";
  });
  const active = adminNewArrivalSlideForm.querySelector('[name="active"]');
  if (active) active.checked = slide.active !== false;
  if (newArrivalSlideStatus) newArrivalSlideStatus.textContent = `Modification du slide ${slide.title || ""}.`;
  adminNewArrivalSlideForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function deleteCardShow(id) {
  if (!id) return;
  try {
    await api("/api/admin/card-shows/delete", { method: "POST", body: JSON.stringify({ id }) });
    if (cardShowStatus) cardShowStatus.textContent = "Card show enlevé.";
    await loadCardShows();
    renderCardShows();
    renderAdmin();
  } catch (error) {
    if (cardShowStatus) cardShowStatus.textContent = error.message;
  }
}

async function deleteReview(id) {
  if (!id) return;
  try {
    await api("/api/admin/reviews/delete", { method: "POST", body: JSON.stringify({ id }) });
    if (reviewStatus) reviewStatus.textContent = "Avis enlevé.";
    await loadReviews();
    renderReviews();
    renderAdmin();
  } catch (error) {
    if (reviewStatus) reviewStatus.textContent = error.message;
  }
}

async function deleteNewArrivalSlide(id) {
  if (!id) return;
  try {
    await api("/api/admin/new-arrival-slides/delete", { method: "POST", body: JSON.stringify({ id }) });
    if (newArrivalSlideStatus) newArrivalSlideStatus.textContent = "Slide enlevé.";
    await loadNewArrivalSlides();
    renderNewArrivalsCarousel();
    renderAdmin();
  } catch (error) {
    if (newArrivalSlideStatus) newArrivalSlideStatus.textContent = error.message;
  }
}

function setAdminField(name, value) {
  const field = adminProductForm?.querySelector(`[name="${name}"]`);
  if (field) field.value = value ?? "";
}

function updateFeatureLimitState() {
  const checked = [...document.querySelectorAll("[data-feature-checkbox]:checked")];
  document.querySelectorAll("[data-feature-checkbox]:not(:checked)").forEach((box) => {
    box.disabled = checked.length >= 2;
  });
}

function setEditingPreview(item) {
  if (!imageSearchPreview) return;
  if (!item.imageUrl) {
    resetImageSearch();
    return;
  }
  imageSearchPreview.classList.remove("hidden");
  imageSearchPreview.dataset.imageUrl = item.imageUrl;
  imageSearchPreview.dataset.name = item.name || "";
  imageSearchPreview.dataset.setId = item.setId || "";
  imageSearchPreview.dataset.setName = item.setName || "";
  imageSearchPreview.dataset.number = item.cardNumber || "";
  imageSearchPreview.dataset.rarity = item.rarity || "";
  imageSearchPreview.innerHTML = `
    <article
      class="image-choice is-selected"
      data-image-choice
      data-image-url="${escapeAttribute(item.imageUrl)}"
      data-name="${escapeAttribute(item.name)}"
      data-set-id="${escapeAttribute(item.setId)}"
      data-set-name="${escapeAttribute(item.setName)}"
      data-number="${escapeAttribute(item.cardNumber)}"
      data-rarity="${escapeAttribute(item.rarity)}"
    >
      <img src="${escapeAttribute(item.imageUrl)}" alt="${escapeAttribute(item.name)}" />
      <span>
        <strong>${escapeAttribute(item.name || "Item")}</strong>
        <small>${escapeAttribute([item.setName, item.cardNumber ? `#${item.cardNumber}` : ""].filter(Boolean).join(" - ") || "Image actuelle")}</small>
        <small>${escapeAttribute(item.rarity || "Rareté à confirmer")}</small>
      </span>
      <div class="image-choice-actions">
        <button class="is-active" type="button" data-image-role="front">Avant</button>
        <button type="button" data-image-role="back">Arrière</button>
      </div>
    </article>
  `;
  if (selectedCardImageUrl) selectedCardImageUrl.value = item.imageUrl;
  if (selectedGalleryImageUrls) selectedGalleryImageUrls.value = JSON.stringify((item.galleryImages || []).slice(0, 4));
}

function closeAdminPanels() {
  [adminProductDrawer, adminSessionDrawer, adminSaleModal, adminPriceModal, adminCommandPalette, adminDiscardModal].forEach((panel) => {
    panel?.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("admin-panel-open");
  pendingAdminDiscardAction = null;
}

function openAdminPanel(panel) {
  if (!panel) return;
  closeAdminPanels();
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("admin-panel-open");
}

function setAdminDrawerSummary(item = null) {
  if (!adminDrawerProductSummary) return;
  if (!item) {
    adminDrawerProductSummary.classList.add("hidden");
    adminDrawerProductSummary.innerHTML = "";
    return;
  }
  const profit = lineProfit(item);
  adminDrawerProductSummary.classList.remove("hidden");
  adminDrawerProductSummary.innerHTML = `
    <div class="admin-drawer-summary-media">${adminProductThumb(item)}</div>
    <div class="admin-drawer-summary-copy">
      <strong>${escapeAttribute(item.name || "Item")}</strong>
      <span>${escapeAttribute(adminItemMeta(item) || "Détails à compléter")}</span>
      <div>${adminStatusPill(item)}</div>
    </div>
    <div class="admin-drawer-summary-prices">
      <span>Profit estimé</span>
      <strong class="${profit >= 0 ? "admin-profit-positive" : "admin-profit-negative"}">${adminMoney(profit)}</strong>
    </div>
  `;
}

function adminProductFormSnapshot() {
  if (!adminProductForm) return "";
  const values = [];
  const form = new FormData(adminProductForm);
  form.forEach((value, key) => {
    if (value instanceof File) return;
    values.push([key, String(value)]);
  });
  adminProductForm.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach((input) => {
    values.push([`checked:${input.name || input.id || input.value}`, input.checked ? "1" : "0"]);
  });
  return JSON.stringify(values.sort(([a], [b]) => a.localeCompare(b)));
}

function markAdminProductFormPristine() {
  adminProductFormPristine = adminProductFormSnapshot();
}

function hasUnsavedAdminProductChanges() {
  return (
    adminProductDrawer?.getAttribute("aria-hidden") === "false" &&
    Boolean(adminProductFormPristine) &&
    adminProductFormSnapshot() !== adminProductFormPristine
  );
}

function openAdminDiscardModal(action) {
  if (!hasUnsavedAdminProductChanges()) {
    action?.();
    return;
  }
  pendingAdminDiscardAction = action;
  adminDiscardModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("admin-panel-open");
  window.requestAnimationFrame(() => adminDiscardCancelButton?.focus());
}

function closeAdminDiscardModal() {
  adminDiscardModal?.setAttribute("aria-hidden", "true");
  pendingAdminDiscardAction = null;
  if (
    adminProductDrawer?.getAttribute("aria-hidden") !== "false" &&
    adminSessionDrawer?.getAttribute("aria-hidden") !== "false" &&
    adminSaleModal?.getAttribute("aria-hidden") !== "false" &&
    adminPriceModal?.getAttribute("aria-hidden") !== "false" &&
    adminCommandPalette?.getAttribute("aria-hidden") !== "false"
  ) {
    document.body.classList.remove("admin-panel-open");
  }
}

function requestCloseAdminPanels() {
  openAdminDiscardModal(() => {
    markAdminProductFormPristine();
    closeAdminPanels();
  });
}

function syncAdminOnlineToggle() {
  if (!adminOnlineToggle || !editingProductStatus) return;
  const status = editingProductStatus.value || "";
  adminOnlineToggle.checked = !["draft", "admin_draft", "sold", "removed"].includes(status);
}

function syncAdminStatusFromOnlineToggle() {
  if (!adminOnlineToggle || !editingProductStatus) return;
  const currentStatus = editingProductStatus.value || "";
  if (["sold", "removed"].includes(currentStatus) && !adminOnlineToggle.checked) return;
  editingProductStatus.value = adminOnlineToggle.checked ? "available" : "admin_draft";
}

function syncAdminProductEditorFields() {
  if (!adminProductForm) return;
  const category = adminProductForm.querySelector('[name="category"]')?.value || "Singles";
  const kind = adminProductForm.querySelector('[name="kind"]')?.value || "single";
  const isSlab = category === "Graded" || kind === "slab";
  const isSealed = category === "Sealed" || ["etb", "utb", "pack", "booster-bundle", "booster-box", "box", "japanese"].includes(kind);
  adminProductForm.querySelectorAll("[data-slab-field]").forEach((field) => {
    field.hidden = !isSlab;
  });
  const conditionGroup = adminProductForm.querySelector("[data-condition-group]");
  if (conditionGroup) conditionGroup.hidden = isSlab;
  adminProductForm.querySelectorAll("[data-condition-kind]").forEach((label) => {
    const kindType = label.dataset.conditionKind;
    label.hidden = isSealed ? kindType !== "sealed" : kindType !== "card";
  });
  const selectedCondition = adminProductForm.querySelector('[name="condition"]:checked');
  if (!isSlab && selectedCondition?.closest("[hidden]")) {
    const fallback = adminProductForm.querySelector(`[name="condition"][value="${isSealed ? "Scellé parfait" : "NM"}"]`);
    if (fallback) fallback.checked = true;
  }
  syncAdminOnlineToggle();
}

function syncAdminDrawerNavigation(id) {
  const visibleItems = adminVisibleInventory(adminInventoryCache);
  const index = visibleItems.findIndex((item) => item.id === id);
  const hasNavigation = index >= 0 && visibleItems.length > 1;
  if (adminPrevItemButton) {
    adminPrevItemButton.hidden = !hasNavigation;
    adminPrevItemButton.dataset.adminAdjacent = hasNavigation ? visibleItems[Math.max(0, index - 1)]?.id || "" : "";
    adminPrevItemButton.disabled = !hasNavigation || index <= 0;
  }
  if (adminNextItemButton) {
    adminNextItemButton.hidden = !hasNavigation;
    adminNextItemButton.dataset.adminAdjacent = hasNavigation ? visibleItems[Math.min(visibleItems.length - 1, index + 1)]?.id || "" : "";
    adminNextItemButton.disabled = !hasNavigation || index >= visibleItems.length - 1;
  }
}

function resetAdminProductForm() {
  if (!adminProductForm) return;
  adminProductForm.reset();
  if (editingProductId) editingProductId.value = "";
  if (editingProductStatus) editingProductStatus.value = "";
  resetImageSearch();
  document.querySelectorAll("[data-feature-checkbox]").forEach((box) => {
    box.checked = false;
    box.disabled = false;
  });
  const status = adminProductForm.querySelector(".admin-status");
  if (status) status.textContent = "";
  if (imageSearchStatus) imageSearchStatus.textContent = "";
  if (marketSuggestStatus) marketSuggestStatus.textContent = "";
  if (productGameSelect) productGameSelect.value = "Pokemon";
  loadPokemonSets();
  setAdminDrawerSummary(null);
  if (adminPrevItemButton) adminPrevItemButton.hidden = true;
  if (adminNextItemButton) adminNextItemButton.hidden = true;
  adminEditActions?.classList.remove("hidden");
  [adminDrawerPriceButton, adminDrawerSaleButton, adminDrawerRemoveButton].forEach((button) => {
    if (button) button.dataset.adminDrawerItem = "";
  });
  [adminDrawerSaleButton, adminDrawerRemoveButton].forEach((button) => {
    if (button) button.hidden = true;
  });
  if (editingProductStatus) editingProductStatus.value = "draft";
  syncAdminProductEditorFields();
  markAdminProductFormPristine();
}

function openAdminAddDrawer() {
  adminSubmitMode = "session";
  resetAdminProductForm();
  if (adminProductDrawerMode) adminProductDrawerMode.textContent = "Ajout rapide";
  if (adminProductDrawerTitle) adminProductDrawerTitle.textContent = "Ajouter un item";
  if (adminSaveProductButton) adminSaveProductButton.textContent = "Enregistrer";
  openAdminPanel(adminProductDrawer);
  markAdminProductFormPristine();
  window.requestAnimationFrame(() => adminProductForm?.querySelector('input[name="name"]')?.focus());
}

function openAdminSessionDrawer() {
  renderAdminSession(adminInventoryCache.filter((item) => item.status === "draft"));
  openAdminPanel(adminSessionDrawer);
}

function openAdminSaleModal(id) {
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item || !adminSaleForm) return;
  adminSaleForm.reset();
  adminSaleForm.querySelector('[name="id"]').value = id;
  adminSaleForm.querySelector('[name="soldPrice"]').value = Number(item.price || item.market || 0);
  const dateInput = adminSaleForm.querySelector('[name="date"]');
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
  const title = document.querySelector("#adminSaleTitle");
  if (title) title.textContent = item.name || "Marquer vendue";
  const status = adminSaleForm.querySelector(".admin-status");
  if (status) status.textContent = "";
  openAdminPanel(adminSaleModal);
  window.requestAnimationFrame(() => adminSaleForm.querySelector('[name="soldPrice"]')?.focus());
}

function adminPriceSuggestion(item) {
  const current = Number(item?.price || 0);
  const market = Number(item?.market || 0);
  const base = current > 0 ? current : market;
  if (!base) return 0;
  const step = base >= 100 ? 10 : 5;
  const competitive = Math.max(1, Math.floor(base / step) * step - 1);
  return Math.max(1, Math.min(base, competitive));
}

function openAdminPriceModal(id) {
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item || !adminPriceForm) return;
  const suggestion = adminPriceSuggestion(item);
  adminPriceForm.reset();
  adminPriceForm.querySelector('[name="id"]').value = id;
  adminPriceForm.querySelector('[name="price"]').value = suggestion || Number(item.price || item.market || 0);
  adminPriceForm.dataset.suggestion = `${suggestion || ""}`;
  const title = document.querySelector("#adminPriceTitle");
  const market = document.querySelector("#adminPriceMarket");
  const current = document.querySelector("#adminPriceCurrent");
  const suggested = document.querySelector("#adminPriceSuggestion");
  const help = document.querySelector("#adminPriceHelp");
  const status = adminPriceForm.querySelector(".admin-status");
  if (title) title.textContent = item.name || "Prix de la carte";
  if (market) market.textContent = adminMoney(item.market);
  if (current) current.textContent = adminMoney(item.price);
  if (suggested) suggested.textContent = suggestion ? adminMoney(suggestion) : "-";
  if (help) help.textContent = suggestion ? `Suggestion calculée pour être plus compétitif sans changer le prix automatiquement.` : "Ajoute un prix manuel, puis confirme.";
  if (status) status.textContent = "";
  openAdminPanel(adminPriceModal);
  window.requestAnimationFrame(() => adminPriceForm.querySelector('[name="price"]')?.focus());
}

function openAdminCommandPalette() {
  openAdminPanel(adminCommandPalette);
}

function duplicateAdminItem(id) {
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;
  editAdminItem(id);
  adminSubmitMode = "session";
  if (editingProductId) editingProductId.value = "";
  if (editingProductStatus) editingProductStatus.value = "draft";
  setAdminField("name", `${item.name || "Item"} copie`);
  if (adminProductDrawerMode) adminProductDrawerMode.textContent = "Duplication";
  if (adminProductDrawerTitle) adminProductDrawerTitle.textContent = "Dupliquer l’item";
  const status = adminProductForm?.querySelector(".admin-status");
  if (status) status.textContent = "Copie prête. Ajuste le prix ou la condition, puis ajoute à la session.";
  syncAdminProductEditorFields();
  markAdminProductFormPristine();
}

function viewAdminProduct(id) {
  if (!id) return;
  closeAdminPanels();
  history.pushState({}, "", productDetailPath({ id }));
  applyRoute();
}

function editAdminItem(id) {
  if (!adminProductForm || !id) return;
  const item = adminInventoryCache.find((candidate) => candidate.id === id);
  if (!item) return;

  adminProductForm.reset();
  resetImageSearch();
  if (editingProductId) editingProductId.value = item.id;
  setAdminField("name", item.name);
  setAdminField("cardNumber", item.cardNumber);
  setAdminField("gradingCompany", item.gradingCompany);
  setAdminField("grade", item.grade);
  setAdminField("status", item.status);
  setAdminField("cost", item.cost);
  setAdminField("market", item.market);
  setAdminField("price", item.price);
  setAdminField("stock", item.stock);
  setAdminField("category", item.category || "Singles");
  setAdminField("game", productGame(item));
  setAdminField("language", item.language || "en");
  setAdminField("kind", item.kind || "single");
  setAdminField("rarity", item.rarity);
  setAdminField("badge", item.badge || "");
  setAdminField("featuredRank", item.featuredRank || "");
  setAdminField("homepageCollection", item.homepageCollection || "");
  const newArrivalFavorite = adminProductForm.querySelector('[name="newArrivalFavorite"]');
  if (newArrivalFavorite) newArrivalFavorite.checked = isNewArrivalFavorite(item);
  const featured = adminProductForm.querySelector('[name="featured"]');
  if (featured) featured.checked = Boolean(item.featured);
  const heroFeatured = adminProductForm.querySelector('[name="heroFeatured"]');
  if (heroFeatured) heroFeatured.checked = Boolean(item.heroFeatured);
  if (pokemonSetSelect && item.setId) {
    const option = [...pokemonSetSelect.options].find((entry) => entry.value === item.setId);
    if (!option && item.setName) {
      pokemonSetSelect.insertAdjacentHTML("afterbegin", `<option value="${escapeAttribute(item.setId)}" data-name="${escapeAttribute(item.setName)}">${item.setName}</option>`);
    }
    pokemonSetSelect.value = item.setId;
  }
  const condition = adminProductForm.querySelector(`[name="condition"][value="${CSS.escape(item.condition || "NM")}"]`);
  if (condition) condition.checked = true;
  document.querySelectorAll("[data-feature-checkbox]").forEach((box) => {
    box.checked = (item.features || []).includes(box.value);
    box.disabled = false;
  });
  updateFeatureLimitState();
  setEditingPreview(item);
  renderAdminSearchIntent();
  setAdminDrawerSummary(item);
  syncAdminDrawerNavigation(item.id);
  adminEditActions?.classList.remove("hidden");
  if (adminDrawerPriceButton) adminDrawerPriceButton.dataset.adminDrawerItem = item.id;
  if (adminDrawerSaleButton) adminDrawerSaleButton.dataset.adminDrawerItem = item.id;
  if (adminDrawerRemoveButton) adminDrawerRemoveButton.dataset.adminDrawerItem = item.id;
  [adminDrawerSaleButton, adminDrawerRemoveButton].forEach((button) => {
    if (button) button.hidden = false;
  });
  const status = adminProductForm.querySelector(".admin-status");
  if (status) status.textContent = `Modification de ${item.name}. Sauvegarde pour mettre l'item a jour.`;
  adminSubmitMode = "keep";
  if (adminProductDrawerMode) adminProductDrawerMode.textContent = "Modification";
  if (adminProductDrawerTitle) adminProductDrawerTitle.textContent = "Modifier le produit";
  if (adminSaveProductButton) adminSaveProductButton.textContent = "Enregistrer";
  syncAdminProductEditorFields();
  openAdminPanel(adminProductDrawer);
  markAdminProductFormPristine();
}

function resetImageSearch() {
  if (selectedCardImageUrl) selectedCardImageUrl.value = "";
  if (selectedGalleryImageUrls) selectedGalleryImageUrls.value = "";
  if (imageSearchPreview) {
    imageSearchPreview.classList.add("hidden");
    imageSearchPreview.innerHTML = "";
    delete imageSearchPreview.dataset.imageUrl;
    delete imageSearchPreview.dataset.backImageUrl;
  }
}

function resetCardLookupDetails() {
  if (!adminProductForm) return;
  resetImageSearch();
  if (editingProductId) editingProductId.value = "";
  if (editingProductStatus) editingProductStatus.value = "";
  setAdminField("cardNumber", "");
  setAdminField("rarity", "");
  setAdminField("setId", "");
  setAdminField("market", "");
  setAdminField("price", "");
  const status = adminProductForm.querySelector(".admin-status");
  if (status) status.textContent = "";
  if (imageSearchStatus) imageSearchStatus.textContent = "";
  if (marketSuggestStatus) marketSuggestStatus.textContent = "";
}

function updateSelectedGalleryUrls() {
  if (!selectedGalleryImageUrls || !imageSearchPreview) return;
  const gallery = [imageSearchPreview.dataset.backImageUrl].filter(Boolean).slice(0, 4);
  selectedGalleryImageUrls.value = JSON.stringify(gallery);
}

function selectImageCandidate(button, role = "front") {
  if (!imageSearchPreview || !button) return;
  const imageUrl = button.dataset.imageUrl || "";
  if (role === "back") {
    imageSearchPreview.dataset.backImageUrl = imageUrl;
    if (!imageSearchPreview.dataset.imageUrl) imageSearchPreview.dataset.imageUrl = imageUrl;
  } else {
    imageSearchPreview.dataset.imageUrl = imageUrl;
  }
  imageSearchPreview.dataset.name = button.dataset.name || "";
  imageSearchPreview.dataset.setId = button.dataset.setId || "";
  imageSearchPreview.dataset.setName = button.dataset.setName || "";
  imageSearchPreview.dataset.number = button.dataset.number || "";
  imageSearchPreview.dataset.rarity = button.dataset.rarity || "";
  imageSearchPreview.querySelectorAll("[data-image-choice]").forEach((choice) => {
    const isFront = choice.dataset.imageUrl === imageSearchPreview.dataset.imageUrl;
    const isBack = choice.dataset.imageUrl === imageSearchPreview.dataset.backImageUrl;
    choice.classList.toggle("is-selected", isFront);
    choice.classList.toggle("is-back-selected", isBack);
    choice.querySelectorAll("[data-image-role]").forEach((roleButton) => {
      roleButton.classList.toggle("is-active", (isFront && roleButton.dataset.imageRole === "front") || (isBack && roleButton.dataset.imageRole === "back"));
    });
  });
  if (selectedCardImageUrl) selectedCardImageUrl.value = imageSearchPreview.dataset.imageUrl;
  updateSelectedGalleryUrls();
  autofillCardFieldsFromPreview(true);
  if (imageSearchStatus) {
    imageSearchStatus.textContent =
      role === "back"
        ? "Image arrière ajoutée. Elle sera sauvegardée comme deuxième photo de l'item."
        : "Image avant sélectionnée. Le nom officiel sera sauvegardé avec l'item.";
  }
}

function renderImageCandidates(candidates) {
  if (!imageSearchPreview) return;
  imageSearchPreview.classList.remove("hidden");
  imageSearchPreview.innerHTML = candidates
    .map(
      (candidate) => {
        const previewUrl = candidate.smallImageUrl || candidate.imageUrl;
        const metadata = [
          candidate.year ? `${candidate.year}` : "",
          candidate.languageLabel || candidate.language ? `Langue: ${candidate.languageLabel || candidate.language}` : "",
        ].filter(Boolean).join(" · ");
        return `
        <article
          class="image-choice"
          data-image-choice
          data-image-url="${escapeAttribute(candidate.imageUrl)}"
          data-preview-url="${escapeAttribute(previewUrl)}"
          data-name="${escapeAttribute(candidate.name || "")}"
          data-set-id="${escapeAttribute(candidate.setId || "")}"
          data-set-name="${escapeAttribute(candidate.set || "")}"
          data-number="${escapeAttribute(candidate.number || "")}"
          data-rarity="${escapeAttribute(candidate.rarity || "")}"
          data-language="${escapeAttribute(candidate.language || "")}"
          data-year="${escapeAttribute(candidate.year || "")}"
          data-image-type="${escapeAttribute(candidate.imageType || "card")}"
        >
          <img class="${candidate.imageType === "sealed" ? "sealed-choice-img" : ""}" src="${escapeAttribute(previewUrl)}" alt="${escapeAttribute(candidate.name)}" loading="lazy" decoding="async" />
          <span>
            <strong>${escapeAttribute(candidate.name)}</strong>
            <small>${escapeAttribute(candidate.set || "Set à confirmer")}${candidate.number ? ` - #${escapeAttribute(candidate.number)}` : ""}</small>
            <small>${escapeAttribute(candidate.rarity || "Rareté à confirmer")}</small>
            ${metadata ? `<small>${escapeAttribute(metadata)}</small>` : ""}
            ${candidate.providerNote ? `<small>${escapeAttribute(candidate.providerNote)}</small>` : ""}
          </span>
          <div class="image-choice-actions">
            <button type="button" data-image-role="front">Avant</button>
            <button type="button" data-image-role="back">Arrière</button>
          </div>
        </article>
      `;
      }
    )
    .join("");
  selectImageCandidate(imageSearchPreview.querySelector("[data-image-choice]"));
}

function parseAdminSearchIntent(query = "") {
  const raw = String(query || "").trim();
  const normalized = raw.toLowerCase();
  const numberMatch = raw.match(/\b(?:[a-z]{1,4}\s*)?\d{1,3}[a-z]?\/?\d{0,3}\b/i);
  const mechanics = ["VMAX", "VSTAR", "GX", "LV.X", "LV X", "EX", "ex", "Mega", "M "].filter((token) => raw.includes(token));
  const cleanName = raw
    .replace(/\b(?:promo|black\s*star|mcdonalds?|mcd|japanese|japonais|jp|jpn|chinese|chinois|cn|korean|cor[eé]en|kr|alt art|alternate art|sir|ir)\b/gi, " ")
    .replace(/\b(?:mep|svp|swsh|sm|xy|bw|dp|pop|hgss)\b/gi, " ")
    .replace(/\b(?:VMAX|VSTAR|GX|LV\.X|LV X|EX|ex|Mega)\b/g, " ")
    .replace(numberMatch?.[0] || "", " ")
    .replace(/\s+/g, " ")
    .trim();
  const chips = [];
  if (cleanName) chips.push(`Nom: ${cleanName}`);
  if (/\bpromo|black\s*star|mcdonald|mcdonalds|mcd\b/i.test(raw)) chips.push("Promo");
  if (/\b(japanese|japonais|jp|jpn)\b/i.test(raw)) chips.push("Japonais");
  if (/\b(chinese|chinois|cn)\b/i.test(raw)) chips.push("Chinois");
  if (/\b(korean|cor[eé]en|kr)\b/i.test(raw)) chips.push("Coréen");
  if (/\b(mep|svp|swsh|sm|xy|bw|dp|pop|hgss)\b/i.test(raw)) chips.push("Code promo/set détecté");
  mechanics.forEach((token) => chips.push(token.trim()));
  if (numberMatch) chips.push(`#${numberMatch[0].replace(/\s+/g, "")}`);
  if (normalized.includes("alt art") || normalized.includes("alternate art")) chips.push("Alternate Art");
  if (normalized.includes("sir")) chips.push("SIR");
  if (normalized.includes("ir")) chips.push("IR");
  return {
    raw,
    cleanName,
    number: numberMatch?.[0]?.replace(/\s+/g, "") || "",
    promo: chips.includes("Promo"),
    language:
      chips.includes("Japonais") ? "jp" :
      chips.includes("Chinois") ? "cn" :
      chips.includes("Coréen") ? "kr" :
      cardLanguageSelect?.value || "en",
    mechanics: mechanics.map((token) => token.trim()).filter(Boolean),
    chips: chips.length ? chips : ["Recherche large"],
  };
}

function renderAdminSearchIntent() {
  if (!adminSearchIntentChips || !adminProductForm) return;
  const name = adminProductForm.querySelector('input[name="name"]')?.value || "";
  const intent = parseAdminSearchIntent(name);
  adminSearchIntentChips.innerHTML = intent.chips.map((chip) => `<em>${escapeAttribute(chip)}</em>`).join("");
}

function rarityOptionFromApi(value) {
  const rarity = String(value || "").toLowerCase();
  if (rarity.includes("illustration") && rarity.includes("special")) return "SIR";
  if (rarity.includes("illustration")) return "IR";
  if (rarity.includes("hyper") || rarity.includes("gold")) return "Gold";
  if (rarity.includes("common")) return "Commune";
  return "";
}

function autofillCardFieldsFromPreview(finalize) {
  if (!adminProductForm || !imageSearchPreview) return;
  const nameInput = adminProductForm.querySelector('input[name="name"]');
  const numberInput = adminProductForm.querySelector('input[name="cardNumber"]');
  const raritySelect = adminProductForm.querySelector('select[name="rarity"]');
  const categorySelect = adminProductForm.querySelector('select[name="category"]');
  const kindSelect = adminProductForm.querySelector('select[name="kind"]');
  const gradingCompany = adminProductForm.querySelector('select[name="gradingCompany"]')?.value || "";
  const setId = imageSearchPreview.dataset.setId || "";
  const setName = imageSearchPreview.dataset.setName || "";
  const rarity = rarityOptionFromApi(imageSearchPreview.dataset.rarity);

  if (nameInput && imageSearchPreview.dataset.name && finalize) nameInput.value = imageSearchPreview.dataset.name;
  if (numberInput && imageSearchPreview.dataset.number) numberInput.value = imageSearchPreview.dataset.number;
  if (raritySelect && rarity) raritySelect.value = rarity;
  if (categorySelect) categorySelect.value = gradingCompany ? "Graded" : "Singles";
  if (kindSelect) kindSelect.value = gradingCompany ? "slab" : "single";
  if (pokemonSetSelect && setId) {
    const option = [...pokemonSetSelect.options].find((item) => item.value === setId);
    if (option) pokemonSetSelect.value = setId;
    else if (setName && finalize) {
      pokemonSetSelect.insertAdjacentHTML("afterbegin", `<option value="${setId}" data-name="${setName}">${setName}</option>`);
      pokemonSetSelect.value = setId;
    }
  }
  syncAdminProductEditorFields();
  suggestMarketPrice({ silent: true });
}

function applySlabMode() {
  if (!adminProductForm) return;
  const company = adminProductForm.querySelector('select[name="gradingCompany"]')?.value || "";
  const categorySelect = adminProductForm.querySelector('select[name="category"]');
  const kindSelect = adminProductForm.querySelector('select[name="kind"]');
  if (company) {
    if (categorySelect) categorySelect.value = "Graded";
    if (kindSelect) kindSelect.value = "slab";
  }
  syncAdminProductEditorFields();
  suggestMarketPrice({ silent: true });
}

async function suggestMarketPrice(options = {}) {
  if (!adminProductForm || !suggestMarketButton) return;
  const form = new FormData(adminProductForm);
  if ((form.get("game") || "Pokemon") === "One Piece") {
    if (!options.silent && marketSuggestStatus) marketSuggestStatus.textContent = "Prix One Piece à valider manuellement pour l’instant.";
    return;
  }
  const params = new URLSearchParams({
    name: form.get("name") || "",
    setId: form.get("setId") || "",
    cardNumber: form.get("cardNumber") || "",
    condition: form.get("condition") || "",
    gradingCompany: form.get("gradingCompany") || "",
    grade: form.get("grade") || "",
  });
  if (!params.get("name")) {
    if (!options.silent && marketSuggestStatus) marketSuggestStatus.textContent = "Entre le nom de la carte avant de suggérer un prix.";
    return;
  }
  suggestMarketButton.disabled = true;
  if (!options.silent) suggestMarketButton.textContent = "Recherche...";
  try {
    const payload = await api(`/api/admin/market-suggest?${params.toString()}`);
    const marketInput = adminProductForm.querySelector('input[name="market"]');
    const priceInput = adminProductForm.querySelector('input[name="price"]');
    if (marketInput && payload.market) marketInput.value = payload.market;
    if (priceInput && payload.storePrice) priceInput.value = payload.storePrice;
    if (marketSuggestStatus) {
      marketSuggestStatus.textContent = `${payload.label}: ${money.format(payload.market)}. Prix affiché proposé: ${money.format(payload.storePrice)}. Source: ${payload.source}.`;
    }
  } catch (error) {
    if (!options.silent && marketSuggestStatus) marketSuggestStatus.textContent = error.message;
  } finally {
    suggestMarketButton.disabled = false;
    suggestMarketButton.textContent = "Suggérer prix marché";
  }
}

async function searchCardImage() {
  if (!adminProductForm || !searchCardImageButton) return;
  const name = adminProductForm.querySelector('input[name="name"]')?.value.trim();
  const cardNumber = adminProductForm.querySelector('input[name="cardNumber"]')?.value.trim();
  const setId = pokemonSetSelect?.value || "";
  const productType = adminProductForm.querySelector('select[name="kind"]')?.value || "";
  const game = adminProductForm.querySelector('select[name="game"]')?.value || "Pokemon";
  const intent = parseAdminSearchIntent(name);
  if (!name && !setId) {
    if (imageSearchStatus) imageSearchStatus.textContent = "Entre le nom ou choisis une extension.";
    return;
  }
  resetImageSearch();
  searchCardImageButton.disabled = true;
  searchCardImageButton.textContent = "Recherche...";
  if (imageSearchStatus) imageSearchStatus.textContent = "";
  try {
    const params = new URLSearchParams({
      q: name || "",
      number: cardNumber || intent.number || "",
      setId,
      productType,
      game,
      language: intent.language,
      promo: intent.promo ? "1" : "",
      mechanics: intent.mechanics.join(","),
    });
    const payload = await api(`/api/admin/card-images?${params.toString()}`);
    const candidates = payload.candidates || [];
    if (!candidates.length) {
      if (imageSearchStatus) imageSearchStatus.textContent = "Aucune image trouvée. Essaie avec le nom exact de la carte.";
      return;
    }
    renderImageCandidates(candidates);
    if (imageSearchStatus) {
      imageSearchStatus.textContent = `${candidates.length} résultat(s) trouvé(s). Choisis Avant pour l'image principale et Arrière pour la deuxième photo.`;
    }
  } catch (error) {
    if (imageSearchStatus) imageSearchStatus.textContent = error.message;
  } finally {
    searchCardImageButton.disabled = false;
    searchCardImageButton.textContent = "Rechercher la photo";
  }
}

function openSearchOverlay() {
  if (!searchOverlay) {
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
    searchInput?.focus();
    return;
  }
  searchOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");
  if (searchOverlayInput) {
    searchOverlayInput.value = state.search || "";
    requestAnimationFrame(() => searchOverlayInput.focus());
  }
}

function closeSearchOverlay({ scroll = false } = {}) {
  searchOverlay?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
  if (scroll) scrollToShopItems("smooth");
}

function openMobileFilters() {
  if (!inventoryTools) return;
  document.body.classList.add("filters-open");
  inventoryTools.setAttribute("aria-modal", "true");
  requestAnimationFrame(() => searchInput?.focus({ preventScroll: true }));
}

function closeMobileFilters({ scroll = false } = {}) {
  document.body.classList.remove("filters-open");
  inventoryTools?.removeAttribute("aria-modal");
  if (scroll) scrollToShopItems("smooth");
}

function openMenu() {
  document.body.classList.add("menu-open");
  const drawer = document.querySelector(".menu-drawer");
  drawer.scrollTop = 0;
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawers() {
  document.body.classList.remove("menu-open");
  document.body.classList.remove("cart-open");
  document.querySelector(".menu-drawer").setAttribute("aria-hidden", "true");
  document.querySelector(".cart-drawer")?.setAttribute("aria-hidden", "true");
}

function observeDynamicElements() {
  document.querySelectorAll(".product-card, .trust-row article, .reveal-section").forEach((element) => {
    element.classList.add("is-visible");
  });
}

let scrollFramePending = false;

window.addEventListener("scroll", () => {
  if (scrollFramePending) return;
  scrollFramePending = true;
  requestAnimationFrame(() => {
    scrollFramePending = false;
    document.body.classList.toggle("is-scrolled", window.scrollY > 18);
  });
}, { passive: true });

function syncScrollEffects() {
  document.body.classList.toggle("is-scrolled", window.scrollY > 18);
}

syncScrollEffects();

document.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-category]");
  const routeCategory = event.target.closest("[data-route-category]");
  const kindRoute = event.target.closest("[data-kind-route]");
  const openMenuButton = event.target.closest("[data-open-menu]");
  const openCartButton = event.target.closest("[data-open-cart]");
  const closeDrawersButton = event.target.closest("[data-close-drawers]");
  const viewProduct = event.target.closest("[data-view-product]");
  const contentRoute = event.target.closest("[data-content-route]");
  const adminSaleButton = event.target.closest("[data-admin-sale]");
  const adminDiscountButton = event.target.closest("[data-admin-discount]");
  const adminPriceAdjustButton = event.target.closest("[data-admin-price-adjust]");
  const adminEditButton = event.target.closest("[data-admin-edit]");
  const adminRemoveButton = event.target.closest("[data-admin-remove]");
  const adminAddSessionButton = event.target.closest("[data-admin-add-session]");
  const adminToggleNewButton = event.target.closest("[data-admin-toggle-new]");
  const adminDeleteButton = event.target.closest("[data-admin-delete]");
  const adminDuplicateButton = event.target.closest("[data-admin-duplicate]");
  const adminViewProductButton = event.target.closest("[data-admin-view-product]");
  const adminAdjacentButton = event.target.closest("[data-admin-adjacent]");
  const adminOpenItemRow = event.target.closest("[data-admin-open-item]");
  const adminClosePanelButton = event.target.closest("[data-admin-close-panel]");
  const adminCancelEditButton = event.target.closest("[data-admin-cancel-edit]");
  const adminDiscardCancel = event.target.closest("[data-admin-discard-cancel]");
  const adminDiscardConfirm = event.target.closest("[data-admin-discard-confirm]");
  const adminStatusFilterButton = event.target.closest("[data-admin-status-filter]");
  const adminCategoryFilterButton = event.target.closest("[data-admin-category-filter]");
  const adminGameFilterButton = event.target.closest("[data-admin-game-filter]");
  const adminCommandButton = event.target.closest("[data-admin-command]");
  const adminViewButton = event.target.closest("[data-admin-view]");
  const editShowButton = event.target.closest("[data-edit-show]");
  const deleteShowButton = event.target.closest("[data-delete-show]");
  const editReviewButton = event.target.closest("[data-edit-review]");
  const deleteReviewButton = event.target.closest("[data-delete-review]");
  const editNewSlideButton = event.target.closest("[data-edit-new-slide]");
  const deleteNewSlideButton = event.target.closest("[data-delete-new-slide]");
  const adminCancelOrderButton = event.target.closest("[data-admin-cancel-order]");
  const adminPaidOrderButton = event.target.closest("[data-admin-paid-order]");
  const merchActionButton = event.target.closest("[data-merch-action]");
  const addCartButton = event.target.closest("[data-add-cart]");
  const backShopButton = event.target.closest("[data-back-shop]");
  const homeLink = event.target.closest("[data-home-link]");
  const accountLink = event.target.closest("[data-account-link]");
  const closeAccountModalButton = event.target.closest("[data-close-account-modal]");
  const createAccountLink = event.target.closest("[data-create-account-link]");
  const cartQtyButton = event.target.closest("[data-cart-qty]");
  const cartRemoveButton = event.target.closest("[data-cart-remove]");
  const checkoutLink = event.target.closest("[data-checkout-link]");
  const reportDownload = event.target.closest("[data-report-download]");
  const galleryImage = event.target.closest("[data-gallery-image]");
  const languageButton = event.target.closest("[data-language]");
  const showAnchor = event.target.closest("[data-show-anchor]");
  const homeSectionLink = event.target.closest("[data-home-section]");
  const homeFilterLink = event.target.closest("[data-home-filter]");
  const accountLogout = event.target.closest("[data-account-logout]");
  const passwordToggle = event.target.closest("[data-toggle-password]");
  const editProfileButton = event.target.closest("[data-edit-profile]");
  const resetFiltersButton = event.target.closest("[data-reset-filters]");
  const openFiltersButton = event.target.closest("[data-open-filters]");
  const closeFiltersButton = event.target.closest("[data-close-filters]");

  if (openFiltersButton) {
    event.preventDefault();
    openMobileFilters();
  }
  if (closeFiltersButton) {
    event.preventDefault();
    closeMobileFilters({ scroll: Boolean(event.target.closest(".mobile-filter-apply")) });
  }
  if (resetFiltersButton) {
    event.preventDefault();
    resetShopFiltersForRoute();
    state.category = "all";
    state.game = "Pokemon";
    state.search = "";
    history.pushState({}, "", "/");
    applyRoute();
    requestAnimationFrame(() => scrollToShopItems("smooth"));
  }
  if (passwordToggle) {
    event.preventDefault();
    const input = passwordToggle.parentElement?.querySelector("input");
    if (input) input.type = input.type === "password" ? "text" : "password";
  }
  if (editNewSlideButton) {
    event.preventDefault();
    editNewArrivalSlide(editNewSlideButton.dataset.editNewSlide);
  }
  if (deleteNewSlideButton) {
    event.preventDefault();
    deleteNewArrivalSlide(deleteNewSlideButton.dataset.deleteNewSlide);
  }
  if (adminClosePanelButton) {
    event.preventDefault();
    requestCloseAdminPanels();
  }
  if (adminCancelEditButton) {
    event.preventDefault();
    requestCloseAdminPanels();
  }
  if (adminDiscardCancel) {
    event.preventDefault();
    closeAdminDiscardModal();
  }
  if (adminDiscardConfirm) {
    event.preventDefault();
    const action = pendingAdminDiscardAction;
    markAdminProductFormPristine();
    closeAdminDiscardModal();
    action?.();
  }
  if (adminViewButton) {
    event.preventDefault();
    openAdminSection(adminViewButton.dataset.adminView);
  }
  if (adminStatusFilterButton) {
    event.preventDefault();
    adminInventoryView.status = adminStatusFilterButton.dataset.adminStatusFilter || "all";
    if (adminInventoryStatus) adminInventoryStatus.value = adminInventoryView.status;
    document.querySelectorAll("[data-admin-status-filter]").forEach((button) => button.classList.toggle("active", button === adminStatusFilterButton));
    renderAdmin();
  }
  if (adminCategoryFilterButton) {
    event.preventDefault();
    adminInventoryView.category = adminCategoryFilterButton.dataset.adminCategoryFilter || "all";
    if (adminInventoryCategory) adminInventoryCategory.value = adminInventoryView.category;
    document.querySelectorAll("[data-admin-category-filter]").forEach((button) => button.classList.toggle("active", button === adminCategoryFilterButton));
    renderAdmin();
  }
  if (adminGameFilterButton) {
    event.preventDefault();
    adminInventoryView.game = adminGameFilterButton.dataset.adminGameFilter || "all";
    if (adminInventoryGame) adminInventoryGame.value = adminInventoryView.game;
    syncAdminFilterButtons();
    renderAdmin();
  }
  if (adminCommandButton) {
    event.preventDefault();
    const command = adminCommandButton.dataset.adminCommand;
    if (command === "add") openAdminDiscardModal(openAdminAddDrawer);
    if (command === "session") openAdminDiscardModal(openAdminSessionDrawer);
    if (command === "search") adminInventorySearch?.focus();
    if (command === "session-filter") {
      adminInventoryView.status = "draft";
      if (adminInventoryStatus) adminInventoryStatus.value = "draft";
      renderAdmin();
    }
    if (command === "dormant") {
      adminInventoryView.status = "dormant";
      if (adminInventoryStatus) adminInventoryStatus.value = "dormant";
      renderAdmin();
    }
    if (command === "sale") {
      const firstVisible = adminVisibleInventory(adminInventoryCache).find((item) => Number(item.stock || 0) > 0);
      if (firstVisible) openAdminSaleModal(firstVisible.id);
    }
    if (command === "jarvis") window.location.href = "/jarvis";
    if (!["add", "session", "sale"].includes(command)) closeAdminPanels();
  }
  if (merchActionButton) {
    event.preventDefault();
    applyMerchandisingAction({
      section: merchActionButton.dataset.merchSection,
      productId: merchActionButton.dataset.merchProduct,
      action: merchActionButton.dataset.merchAction,
      button: merchActionButton,
    });
  }
  if (editProfileButton) {
    event.preventDefault();
    profileEditMode = true;
    renderAccount();
  }

  if (closeAccountModalButton) {
    event.preventDefault();
    closeAccountModal();
  }
  if (createAccountLink) {
    event.preventDefault();
    closeAccountModal();
    showTransitionLoader(t("createAccount"));
    window.setTimeout(() => {
      history.pushState({}, "", "/creer-compte");
      applyRoute();
      window.setTimeout(hideTransitionLoader, 220);
    }, 340);
  }
  if (accountLogout) {
    event.preventDefault();
    api("/api/logout", { method: "POST", body: "{}" }).catch(() => {});
    currentUser = null;
    customerOrders = [];
    profileEditMode = false;
    updateAccountButtons();
    renderAccount();
  }
  if (languageButton) setLanguage(languageButton.dataset.language);
  if (showAnchor) {
    event.preventDefault();
    closeDrawers();
    history.pushState({}, "", "/");
    applyRoute();
    requestAnimationFrame(() => document.querySelector("#cardshows")?.scrollIntoView({ behavior: "smooth" }));
  }
  if (homeSectionLink) {
    event.preventDefault();
    closeDrawers();
    const sectionId = homeSectionLink.dataset.homeSection;
    history.pushState({}, "", sectionId ? `/#${sectionId}` : "/");
    state.category = "all";
    state.typeFilter = "all";
    state.setFilter = "all";
    state.search = "";
    if (searchInput) searchInput.value = "";
    if (setFilterSelect) setFilterSelect.value = "all";
    applyRoute();
    requestAnimationFrame(() => document.querySelector(`#${CSS.escape(sectionId)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  if (homeFilterLink) {
    event.preventDefault();
    closeDrawers();
    history.pushState({}, "", "/");
    state.category = homeFilterLink.dataset.homeFilter || "all";
    applyRoute();
    requestAnimationFrame(() => scrollToShopItems("smooth"));
  }
  if (galleryImage) selectGalleryImage(galleryImage);
  if (reportDownload) {
    event.preventDefault();
    downloadAdminReport(reportDownload);
  }
  if (addCartButton) addToCart(addCartButton.dataset.addCart);
  if (backShopButton) {
    event.preventDefault();
    closeDrawers();
    restoreShopView();
  }
  if (homeLink) {
    event.preventDefault();
    closeDrawers();
    history.pushState({}, "", "/");
    state.category = "all";
    state.game = "Pokemon";
    state.typeFilter = "all";
    state.setFilter = "all";
    state.search = "";
    if (searchInput) searchInput.value = "";
    if (setFilterSelect) setFilterSelect.value = "all";
    applyRoute();
    requestAnimationFrame(() => document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" }));
  }
  if (accountLink) {
    event.preventDefault();
    closeDrawers();
    if (!currentUser) {
      openAccountModal();
    } else {
      history.pushState({}, "", "/compte");
      applyRoute();
    }
  }
  if (adminCancelOrderButton) cancelPendingOrder(adminCancelOrderButton.dataset.adminCancelOrder, adminCancelOrderButton);
  if (adminPaidOrderButton) markPendingOrderPaid(adminPaidOrderButton.dataset.adminPaidOrder, adminPaidOrderButton);
  if (cartQtyButton) updateCartQuantity(cartQtyButton.dataset.cartQty, Number(cartQtyButton.dataset.delta || 0));
  if (cartRemoveButton) {
    cart = cart.filter((item) => item.id !== cartRemoveButton.dataset.cartRemove);
    saveCart();
  }
  if (adminAdjacentButton?.dataset.adminAdjacent) {
    openAdminDiscardModal(() => editAdminItem(adminAdjacentButton.dataset.adminAdjacent));
  }
  if (adminEditButton) {
    openAdminDiscardModal(() => editAdminItem(adminEditButton.dataset.adminEdit));
  }
  if (adminDiscountButton) applyAdminDiscount(adminDiscountButton.dataset.adminDiscount, adminDiscountButton);
  if (adminPriceAdjustButton) openAdminPriceModal(adminPriceAdjustButton.dataset.adminPriceAdjust);
  if (adminRemoveButton) removeAdminItem(adminRemoveButton.dataset.adminRemove, adminRemoveButton);
  if (adminAddSessionButton) addAdminItemToSession(adminAddSessionButton.dataset.adminAddSession, adminAddSessionButton);
  if (adminToggleNewButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleAdminNewArrival(adminToggleNewButton.dataset.adminToggleNew, adminToggleNewButton);
    return;
  }
  if (adminDeleteButton) deleteAdminItem(adminDeleteButton.dataset.adminDelete, adminDeleteButton);
  if (adminDuplicateButton) {
    openAdminDiscardModal(() => duplicateAdminItem(adminDuplicateButton.dataset.adminDuplicate));
  }
  if (adminViewProductButton) viewAdminProduct(adminViewProductButton.dataset.adminViewProduct);
  if (editShowButton) editCardShow(editShowButton.dataset.editShow);
  if (deleteShowButton) deleteCardShow(deleteShowButton.dataset.deleteShow);
  if (editReviewButton) editReview(editReviewButton.dataset.editReview);
  if (deleteReviewButton) deleteReview(deleteReviewButton.dataset.deleteReview);
  if (adminSaleButton) openAdminSaleModal(adminSaleButton.dataset.adminSale);
  if (
    adminOpenItemRow &&
    !event.target.closest("button, a, input, select, textarea, summary, details, label")
  ) {
    openAdminDiscardModal(() => editAdminItem(adminOpenItemRow.dataset.adminOpenItem));
  }
  if (tabButton) {
    state.game = "Pokemon";
    selectCategory(tabButton.dataset.category);
  }
  const gameCategoryButton = event.target.closest("[data-game-category]");
  if (gameCategoryButton) {
    event.preventDefault();
    state.typeFilter = "all";
    state.setFilter = "all";
    goToCategory("all", true, gameCategoryButton.dataset.gameCategory || "One Piece");
  }
  if (routeCategory) {
    event.preventDefault();
    closeDrawers();
    state.typeFilter = "all";
    goToCategory(routeCategory.dataset.routeCategory, true, routeCategory.dataset.routeGame || "Pokemon");
  }
  if (kindRoute) {
    event.preventDefault();
    closeDrawers();
    state.category = kindRoute.dataset.kindRoute === "slab" ? "Graded" : "Sealed";
    state.game = event.target.closest("[data-route-game]")?.dataset.routeGame || "Pokemon";
    state.typeFilter = kindRoute.dataset.kindRoute;
    history.pushState({}, "", categoryPath(state.category, state.game));
    selectCategory(state.category, true);
  }
  if (viewProduct) {
    event.preventDefault();
    closeDrawers();
    saveShopView(viewProduct.dataset.viewProduct);
    history.pushState({}, "", productDetailPath({ id: viewProduct.dataset.viewProduct }));
    applyRoute();
  }
  if (contentRoute) {
    event.preventDefault();
    closeDrawers();
    history.pushState({}, "", `/${contentRoute.dataset.contentRoute}`);
    applyRoute();
  }
  if (event.target.closest("[data-admin-link]")) {
    event.preventDefault();
    closeDrawers();
    history.pushState({}, "", "/admin");
    applyRoute();
  }
  if (openMenuButton) openMenu();
  if (openCartButton) {
    document.body.classList.add("cart-open");
    document.querySelector(".cart-drawer")?.setAttribute("aria-hidden", "false");
    trackShopEvent("view_cart", { cart_quantity: cartQuantity(), value: roundMoney(cartTotal()) });
  }
  if (checkoutLink) {
    event.preventDefault();
    closeDrawers();
    trackShopEvent("begin_checkout", { cart_quantity: cartQuantity(), value: roundMoney(cartTaxes().total) });
    showTransitionLoader(currentLang === "en" ? "Checkout" : "Finaliser");
    setTimeout(() => {
      history.pushState({}, "", "/checkout");
      applyRoute();
      setTimeout(hideTransitionLoader, 220);
    }, 340);
  }
  if (closeDrawersButton) closeDrawers();
  if (event.target.closest(".drawer-nav a")) closeDrawers();
});

searchInput.addEventListener("input", (event) => {
  setShopSearch(event.target.value);
});

document.querySelector("[data-open-search]")?.addEventListener("click", openSearchOverlay);

searchOverlayInput?.addEventListener("input", (event) => {
  setShopSearch(event.target.value);
});

document.querySelectorAll("[data-close-search]").forEach((button) => {
  button.addEventListener("click", () => closeSearchOverlay());
});

document.querySelectorAll("[data-search-chip]").forEach((button) => {
  button.addEventListener("click", () => {
    setShopSearch(button.dataset.searchChip || "");
    closeSearchOverlay({ scroll: true });
  });
});

document.querySelector("[data-search-submit]")?.addEventListener("click", () => {
  closeSearchOverlay({ scroll: true });
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
  if (mobileShopQuery.matches) closeMobileFilters({ scroll: true });
});

setFilterSelect?.addEventListener("change", (event) => {
  state.setFilter = event.target.value || "all";
  renderProducts();
  if (mobileShopQuery.matches) closeMobileFilters({ scroll: true });
});

conditionFilterSelect?.addEventListener("change", (event) => {
  state.conditionFilter = event.target.value || "all";
  renderProducts();
  if (mobileShopQuery.matches) closeMobileFilters({ scroll: true });
});

availabilityFilterSelect?.addEventListener("change", (event) => {
  state.availabilityFilter = event.target.value || "available";
  if (state.availabilityFilter === "sale") state.category = "sale";
  if (state.availabilityFilter === "new") state.category = "new";
  if (state.availabilityFilter === "available" && ["sale", "new"].includes(state.category)) state.category = "all";
  renderProducts();
  if (mobileShopQuery.matches) closeMobileFilters({ scroll: true });
});

document.querySelectorAll("[data-feature-checkbox]").forEach((input) => {
  input.addEventListener("change", updateFeatureLimitState);
});

[adminInventorySearch, adminInventoryCategory, adminInventoryGame, adminInventoryStatus, adminInventorySort].forEach((control) => {
  control?.addEventListener("input", () => {
    adminInventoryView = {
      search: adminInventorySearch?.value || "",
      category: adminInventoryCategory?.value || "all",
      game: adminInventoryGame?.value || "all",
      status: adminInventoryStatus?.value || "all",
      sort: adminInventorySort?.value || "recent",
    };
    syncAdminFilterButtons();
    renderAdmin();
  });
  control?.addEventListener("change", () => {
    adminInventoryView = {
      search: adminInventorySearch?.value || "",
      category: adminInventoryCategory?.value || "all",
      game: adminInventoryGame?.value || "all",
      status: adminInventoryStatus?.value || "all",
      sort: adminInventorySort?.value || "recent",
    };
    syncAdminFilterButtons();
    renderAdmin();
  });
});

adminSaleForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminSaleForm);
  const submitButton = adminSaleForm.querySelector('button[type="submit"]');
  const status = adminSaleForm.querySelector(".admin-status");
  if (status) status.textContent = "Vente en cours...";
  await registerAdminSale(form.get("id"), submitButton, form.get("soldPrice"));
});

adminUsePriceSuggestionButton?.addEventListener("click", () => {
  if (!adminPriceForm) return;
  const suggestion = adminPriceForm.dataset.suggestion || "";
  if (suggestion) {
    adminPriceForm.querySelector('[name="price"]').value = suggestion;
    adminPriceForm.querySelector('[name="strategy"]').value = "suggestion";
  }
});

adminPriceForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminPriceForm);
  const submitButton = adminPriceForm.querySelector('button[type="submit"]');
  const status = adminPriceForm.querySelector(".admin-status");
  if (form.get("strategy") === "keep") {
    closeAdminPanels();
    return;
  }
  if (status) status.textContent = "Ajustement en cours...";
  await applyAdminDiscount(form.get("id"), submitButton, form.get("price"));
});

document.querySelectorAll(".newsletter").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email") || "";
    trackShopEvent("newsletter_signup", { source: "preorder_mystery_box", has_email: Boolean(String(email).trim()) });
    event.currentTarget.reset();
  });
});

document.addEventListener("submit", async (event) => {
  if (!event.target.matches(".request-form")) return;
  event.preventDefault();
  const status = event.target.querySelector(".form-status");
  const submitButton = event.target.querySelector('button[type="submit"]');
  const form = new FormData(event.target);
  const body = {
    name: form.get("name"),
    email: form.get("email"),
    askingPrice: form.get("askingPrice"),
    summary: form.get("summary"),
    cardNames: form.get("cardNames"),
    photos: await filesToDataUrls(form.getAll("collectionPhotos"), 12),
  };
  if (submitButton) submitButton.disabled = true;
  event.target.classList.add("is-uploading");
  if (status) status.textContent = currentLang === "en" ? "Sending request..." : "Envoi de la demande...";
  try {
    const payload = await api("/api/sell-request", { method: "POST", body: JSON.stringify(body) });
    if (status) {
      status.textContent =
        currentLang === "en"
          ? payload.message || "Request sent. We will review it and reply by email."
          : payload.message || "Demande envoyée. Nous allons l’évaluer et répondre par courriel.";
    }
    trackShopEvent("buylist_request_sent", {
      photo_count: form.getAll("collectionPhotos").filter((file) => file && file.size).length,
      has_asking_price: Boolean(form.get("askingPrice")),
    });
    event.target.reset();
    event.target.querySelectorAll("[data-coffee-upload] input").forEach(syncCoffeeUpload);
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    event.target.classList.remove("is-uploading");
    if (signupForm) setTimeout(hideTransitionLoader, 220);
    if (submitButton) submitButton.disabled = false;
  }
});

document.addEventListener("submit", async (event) => {
  const loginForm = event.target.closest("[data-account-login]");
  const signupForm = event.target.closest("[data-account-signup]");
  const profileForm = event.target.closest("[data-account-profile]");
  if (!loginForm && !signupForm && !profileForm) return;
  event.preventDefault();
  const formElement = loginForm || signupForm || profileForm;
  const status = formElement.querySelector(".form-status");
  const submitButton = formElement.querySelector('button[type="submit"]');
  const form = new FormData(formElement);
  if (submitButton) submitButton.disabled = true;
  if (status) status.textContent = currentLang === "en" ? "One moment..." : "Un instant...";
  try {
    if (loginForm || signupForm) {
      if (signupForm && form.get("password") !== form.get("passwordConfirm")) {
        throw new Error(currentLang === "en" ? "Passwords do not match." : "Les mots de passe ne correspondent pas.");
      }
      if (signupForm) showTransitionLoader(t("createAccount"));
      const endpoint = loginForm ? "/api/login" : "/api/signup";
      const body = {
        name: form.get("name") || "",
        email: form.get("email"),
        password: form.get("password"),
        marketingOptIn: Boolean(form.get("marketingOptIn")),
        rememberMe: Boolean(form.get("rememberMe")),
      };
      const payload = await api(endpoint, { method: "POST", body: JSON.stringify(body) });
      currentUser = payload.user || null;
      const shouldWelcome = Boolean(currentUser);
      if (signupForm && formElement.querySelector('[name="address"]')) {
        const profilePayload = await api("/api/profile", {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"),
            address: {
              phone: form.get("phone"),
              address: form.get("address"),
              city: form.get("city"),
              province: form.get("province"),
              postal: form.get("postal"),
              notes: form.get("notes"),
            },
          }),
        });
        currentUser = profilePayload.user || currentUser;
      }
      await loadCustomerOrders();
      closeAccountModal();
      profileEditMode = false;
      updateAccountButtons();
      if (shouldWelcome) showWelcomeToast(currentUser);
      history.pushState({}, "", "/compte");
      renderAccount();
      fillCheckoutFromProfile();
      return;
    }
    const body = {
      name: form.get("name"),
      address: {
        phone: form.get("phone"),
        address: form.get("address"),
        city: form.get("city"),
        province: form.get("province"),
        postal: form.get("postal"),
        notes: form.get("notes"),
      },
    };
    const payload = await api("/api/profile", { method: "POST", body: JSON.stringify(body) });
    currentUser = payload.user || null;
    profileEditMode = false;
    updateAccountButtons();
    renderAccount();
    const nextStatus = accountContent?.querySelector(".form-status");
    if (nextStatus) nextStatus.textContent = t("profileSaved");
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

checkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!cart.length) {
    if (checkoutStatus) checkoutStatus.textContent = t("cartEmpty");
    return;
  }
  const form = new FormData(checkoutForm);
  const body = {
    customer: {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
    },
    address: {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      province: form.get("province"),
      postal: form.get("postal"),
      notes: form.get("notes"),
    },
    shipping: "canada_post_manual",
    paymentMethod: { type: "square" },
    items: cart,
    marketingOptIn: Boolean(form.get("marketingOptIn")),
  };
  const submitButtons = [...checkoutForm.querySelectorAll('button[type="submit"]')];
  submitButtons.forEach((button) => {
    button.disabled = true;
  });
  if (checkoutStatus) {
    checkoutStatus.textContent = currentLang === "en" ? "Preparing Square payment..." : "Préparation du paiement Square...";
  }
  try {
    trackShopEvent("payment_started", { method: "square", cart_quantity: cartQuantity(), value: roundMoney(cartTaxes().total) });
    const payload = await api("/api/order", { method: "POST", body: JSON.stringify(body) });
    currentUser = payload.user || currentUser;
    cart = [];
    saveCart();
    await loadProducts();
    renderProducts();
    checkoutForm.reset();
    if (payload.squareCheckoutUrl) {
      if (checkoutStatus) checkoutStatus.textContent = currentLang === "en" ? "Redirecting to Square payment..." : "Redirection vers le paiement Square...";
      window.location.href = payload.squareCheckoutUrl;
    } else if (checkoutStatus) {
      checkoutStatus.textContent = currentLang === "en" ? "Square payment is being prepared." : "Paiement Square en préparation.";
    }
  } catch (error) {
    if (checkoutStatus) checkoutStatus.textContent = error.message;
  } finally {
    submitButtons.forEach((button) => {
      button.disabled = false;
    });
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTextEntry = target?.matches?.("input, textarea, select, [contenteditable='true']");
  const isAdminVisible = adminPage && !adminPage.classList.contains("hidden") && adminContent && !adminContent.classList.contains("hidden");

  if (event.key === "Escape") {
    if (document.body.classList.contains("filters-open")) {
      closeMobileFilters();
      return;
    }
    if (searchOverlay?.getAttribute("aria-hidden") === "false") {
      closeSearchOverlay();
      return;
    }
    if (adminDiscardModal?.getAttribute("aria-hidden") === "false") {
      closeAdminDiscardModal();
      return;
    }
    requestCloseAdminPanels();
    closeDrawers();
    closeAccountModal();
    return;
  }

  if (!isAdminVisible) return;

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openAdminCommandPalette();
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
    if (adminProductDrawer?.getAttribute("aria-hidden") === "false") {
      event.preventDefault();
      adminProductForm?.requestSubmit();
    }
    return;
  }

  if (isTextEntry) return;

  if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    openAdminDiscardModal(openAdminAddDrawer);
  }

  if (event.key === "/") {
    event.preventDefault();
    adminInventorySearch?.focus();
  }
});

adminOpenAddButton?.addEventListener("click", () => openAdminDiscardModal(openAdminAddDrawer));
adminOpenCardShowButton?.addEventListener("click", focusCardShowForm);
adminOpenSessionButton?.addEventListener("click", openAdminSessionDrawer);
adminCommandPaletteButton?.addEventListener("click", openAdminCommandPalette);
adminSavePublishButton?.addEventListener("click", () => {
  adminSubmitMode = "publish";
  adminProductForm?.requestSubmit();
});
adminSaveDraftButton?.addEventListener("click", () => {
  adminSubmitMode = "admin_draft";
  adminProductForm?.requestSubmit();
});
adminDrawerPriceButton?.addEventListener("click", () => {
  if (adminDrawerPriceButton.dataset.adminDrawerItem) openAdminDiscardModal(() => openAdminPriceModal(adminDrawerPriceButton.dataset.adminDrawerItem));
});
adminDrawerSaleButton?.addEventListener("click", () => {
  if (adminDrawerSaleButton.dataset.adminDrawerItem) openAdminDiscardModal(() => openAdminSaleModal(adminDrawerSaleButton.dataset.adminDrawerItem));
});
adminDrawerRemoveButton?.addEventListener("click", () => {
  if (adminDrawerRemoveButton.dataset.adminDrawerItem) openAdminDiscardModal(() => removeAdminItem(adminDrawerRemoveButton.dataset.adminDrawerItem, adminDrawerRemoveButton));
});
searchCardImageButton?.addEventListener("click", searchCardImage);
productGameSelect?.addEventListener("change", () => {
  resetCardLookupDetails();
  loadPokemonSets();
  syncAdminProductEditorFields();
});
adminOnlineToggle?.addEventListener("change", () => {
  syncAdminStatusFromOnlineToggle();
  syncAdminOnlineToggle();
});
adminProductForm?.querySelector('select[name="category"]')?.addEventListener("change", syncAdminProductEditorFields);
adminProductForm?.querySelector('select[name="kind"]')?.addEventListener("change", syncAdminProductEditorFields);
adminProductForm?.querySelector('input[name="name"]')?.addEventListener("input", () => {
  renderAdminSearchIntent();
  if (editingProductId?.value) {
    resetImageSearch();
    if (imageSearchStatus) imageSearchStatus.textContent = "";
    return;
  }
  resetCardLookupDetails();
  renderAdminSearchIntent();
});
cardLanguageSelect?.addEventListener("change", renderAdminSearchIntent);
imageSearchPreview?.addEventListener("click", (event) => {
  const roleButton = event.target.closest("[data-image-role]");
  const choice = event.target.closest("[data-image-choice]");
  if (choice) selectImageCandidate(choice, roleButton?.dataset.imageRole || "front");
});
suggestMarketButton?.addEventListener("click", suggestMarketPrice);
recalculateMerchandisingButton?.addEventListener("click", () => {
  renderMerchandisingAdmin(adminInventoryCache);
  if (merchandisingStatus) merchandisingStatus.textContent = "Scores recalculés avec l’inventaire actuel.";
});
resetMerchandisingButton?.addEventListener("click", () => resetMerchandisingSuggestions(resetMerchandisingButton));
adminProductForm?.querySelector('select[name="gradingCompany"]')?.addEventListener("change", applySlabMode);
adminProductForm?.querySelector('select[name="gradingCompany"]')?.addEventListener("change", syncAdminProductEditorFields);

window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedAdminProductChanges()) return;
  event.preventDefault();
  event.returnValue = "";
});
publishDraftProductsButton?.addEventListener("click", publishDraftProducts);
quickBatchPreviewButton?.addEventListener("click", renderQuickBatchPreview);
quickBatchCreateButton?.addEventListener("click", createQuickBatchDrafts);
quickBatchInput?.addEventListener("input", () => {
  if (quickBatchStatus) quickBatchStatus.textContent = "";
});
toggleSoldCardsButton?.addEventListener("click", () => {
  const isHidden = soldCardsWrap?.classList.toggle("hidden");
  toggleSoldCardsButton.textContent = isHidden ? "Afficher les ventes" : "Masquer les ventes";
});

adminLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminLoginForm);
  const submitButton = adminLoginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  if (adminLoginStatus) adminLoginStatus.textContent = "Connexion...";
  try {
    await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    adminLoginForm.reset();
    if (adminLoginStatus) adminLoginStatus.textContent = "";
    await refreshAdminState();
    await loadPokemonSets();
    renderAdmin();
  } catch (error) {
    if (adminLoginStatus) adminLoginStatus.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

async function logoutAdmin() {
  try {
    await api("/api/admin/logout", { method: "POST", body: "{}" });
  } catch {
    // The local session is cleared by the server when possible; the UI still locks if the request fails.
  }
  toggleAdminLinks(false);
  showAdminLogin("");
  history.pushState({}, "", "/");
  applyRoute();
}

adminLogoutButton?.addEventListener("click", logoutAdmin);
adminSidebarLogoutButton?.addEventListener("click", logoutAdmin);

adminCardShowForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminCardShowForm);
  const body = {
    id: form.get("id") || "",
    name: form.get("name"),
    location: form.get("location"),
    city: form.get("city"),
    date: form.get("date"),
    dateEnd: form.get("dateEnd"),
    time: form.get("time"),
    tables: form.get("tables"),
    collaborator: form.get("collaborator"),
    announcementUrl: form.get("announcementUrl"),
    imageUrl: form.get("imageUrl") || "",
    imageData: await fileToDataUrl(form.get("imageFile")),
  };
  try {
    await api("/api/admin/card-shows", { method: "POST", body: JSON.stringify(body) });
    if (cardShowStatus) cardShowStatus.textContent = body.id ? "Card show mis à jour." : "Card show sauvegardé.";
    adminCardShowForm.reset();
    if (cardShowImagePreview) {
      cardShowImagePreview.classList.add("hidden");
      cardShowImagePreview.innerHTML = "";
    }
    await loadCardShows();
    renderCardShows();
    renderAdmin();
  } catch (error) {
    if (cardShowStatus) cardShowStatus.textContent = error.message;
  }
});

adminReviewForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminReviewForm);
  const body = {
    id: form.get("id") || "",
    name: form.get("name"),
    city: form.get("city"),
    rating: form.get("rating"),
    product: form.get("product"),
    date: form.get("date"),
    text: form.get("text"),
    published: Boolean(form.get("published")),
    photoData: await fileToDataUrl(form.get("photoFile")),
  };
  try {
    await api("/api/admin/reviews", { method: "POST", body: JSON.stringify(body) });
    if (reviewStatus) reviewStatus.textContent = body.id ? "Avis mis à jour." : "Avis sauvegardé.";
    adminReviewForm.reset();
    const published = adminReviewForm.querySelector('[name="published"]');
    if (published) published.checked = true;
    await loadReviews();
    renderReviews();
    renderAdmin();
  } catch (error) {
    if (reviewStatus) reviewStatus.textContent = error.message;
  }
});

adminNewArrivalSlideForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminNewArrivalSlideForm);
  const body = {
    id: form.get("id") || "",
    title: form.get("title"),
    href: form.get("href"),
    imageUrl: form.get("imageUrl") || "",
    active: Boolean(form.get("active")),
    imageData: await fileToDataUrl(form.get("imageFile")),
  };
  try {
    await api("/api/admin/new-arrival-slides", { method: "POST", body: JSON.stringify(body) });
    if (newArrivalSlideStatus) newArrivalSlideStatus.textContent = body.id ? "Slide mis à jour." : "Slide sauvegardé.";
    adminNewArrivalSlideForm.reset();
    const active = adminNewArrivalSlideForm.querySelector('[name="active"]');
    if (active) active.checked = true;
    await loadNewArrivalSlides();
    renderNewArrivalsCarousel();
    renderAdmin();
  } catch (error) {
    if (newArrivalSlideStatus) newArrivalSlideStatus.textContent = error.message;
  }
});

adminProductForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = adminProductForm.querySelector(".admin-status");
  const form = new FormData(adminProductForm);
  const selectedSetOption = pokemonSetSelect?.selectedOptions?.[0];
  const id = form.get("id") || "";
  const category = form.get("category") || "Singles";
  const requestedStatus =
    adminSubmitMode === "publish"
      ? category === "Preorder"
        ? "preorder"
        : "available"
      : adminSubmitMode === "admin_draft"
      ? "admin_draft"
    : !id && adminSubmitMode === "session"
      ? form.get("status") || "draft"
      : form.get("status") || "";
  const body = {
    id,
    name: form.get("name"),
    game: form.get("game") || "Pokemon",
    language: form.get("language") || "en",
    setId: form.get("setId"),
    setName: selectedSetOption?.dataset.name || selectedSetOption?.textContent?.replace(/\s+-\s+\d{4}\/\d{2}\/\d{2}$/, "") || "",
    category,
    kind: form.get("kind"),
    status: requestedStatus,
    rarity: form.get("rarity"),
    cardNumber: form.get("cardNumber"),
    condition: form.get("condition"),
    gradingCompany: form.get("gradingCompany"),
    grade: form.get("grade"),
    stock: form.get("stock"),
    cost: form.get("cost"),
    market: form.get("market"),
    price: form.get("price"),
    priceAuto: false,
    featured: Boolean(form.get("featured")),
    heroFeatured: Boolean(form.get("heroFeatured")),
    featuredRank: form.get("featuredRank"),
    homepageCollection: form.get("newArrivalFavorite") ? "new" : form.get("homepageCollection"),
    badge: form.get("badge"),
    features: form.getAll("features").slice(0, 2),
    imageUrl: form.get("imageUrl"),
    galleryImageUrls: parseJsonArray(form.get("galleryImageUrls")).slice(0, 4),
    galleryImageData: await filesToDataUrls(form.getAll("galleryFiles"), 4),
  };
  try {
    await api("/api/admin/products", { method: "POST", body: JSON.stringify(body) });
    const message = body.id
      ? "Item mis à jour."
      : body.status === "draft"
      ? "Item ajouté à la session."
      : body.status === "admin_draft"
      ? "Brouillon sauvegardé."
      : "Item ajouté et mis en ligne.";
    await loadProducts();
    renderProducts();
    await renderAdmin();
    if (body.id) {
      if (body.status && editingProductStatus) editingProductStatus.value = body.status;
      syncAdminProductEditorFields();
      markAdminProductFormPristine();
      if (status) status.textContent = message;
      adminSubmitMode = "keep";
    } else {
      resetAdminProductForm();
      adminSubmitMode = "session";
      if (status) status.textContent = `${message} Prêt pour le prochain item.`;
      window.requestAnimationFrame(() => adminProductForm.querySelector('input[name="name"]')?.focus());
    }
  } catch (error) {
    status.textContent = error.message;
  }
});

syncPricesButton?.addEventListener("click", async () => {
  syncPricesButton.disabled = true;
  syncPricesButton.textContent = "Mise à jour...";
  try {
    const payload = await api("/api/admin/prices/sync", { method: "POST", body: "{}" });
    if (adminPriceSync) {
      adminPriceSync.textContent = `Prix auto: ${payload.summary.updated} items mis à jour. Dernière synchronisation ${syncDate(payload.summary.lastRunAt)}. Source: ${payload.summary.provider}.`;
    }
    await loadProducts();
    renderProducts();
    renderAdmin();
  } catch (error) {
    if (adminPriceSync) adminPriceSync.textContent = error.message;
  } finally {
    syncPricesButton.disabled = false;
    syncPricesButton.textContent = "Mettre à jour les prix";
  }
});

window.addEventListener("popstate", applyRoute);
if (mobileShopQuery.addEventListener) {
  mobileShopQuery.addEventListener("change", renderProducts);
} else {
  mobileShopQuery.addListener(renderProducts);
}
refreshAdminState();
loadPokemonSets();
applyTranslations();
fillProvinceSelects();
wireAddressAutocomplete();
Promise.all([loadProducts(), loadCardShows(), loadReviews(), loadNewArrivalSlides(), loadCurrentUser()]).then(() => {
  applyRoute();
  renderCardShows();
  renderReviews();
  renderHomeSections();
  renderNewArrivalsCarousel();
  renderCart();
});
