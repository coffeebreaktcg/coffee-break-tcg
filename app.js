let inventory = [];

const state = {
  category: "all",
  search: "",
  sort: "featured",
  typeFilter: "all",
  setFilter: "all",
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
const sortSelect = document.querySelector("#sortSelect");
const setFilterSelect = document.querySelector("#setFilterSelect");
const categoryTitle = document.querySelector("#categoryTitle");
const categoryEyebrow = document.querySelector("#categoryEyebrow");
const adminPage = document.querySelector("#adminPage");
const adminLogin = document.querySelector("#adminLogin");
const adminContent = document.querySelector("#adminContent");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginStatus = document.querySelector("#adminLoginStatus");
const adminLogoutButton = document.querySelector("#adminLogoutButton");
const adminMetrics = document.querySelector("#adminMetrics");
const adminPriceSync = document.querySelector("#adminPriceSync");
const syncPricesButton = document.querySelector("#syncPricesButton");
const adminInventoryRows = document.querySelector("#adminInventoryRows");
const adminInventorySearch = document.querySelector("#adminInventorySearch");
const adminInventoryCategory = document.querySelector("#adminInventoryCategory");
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
const adminOpenSessionButton = document.querySelector("#adminOpenSessionButton");
const adminCommandPaletteButton = document.querySelector("#adminCommandPaletteButton");
const adminProductDrawer = document.querySelector("#adminProductDrawer");
const adminSessionDrawer = document.querySelector("#adminSessionDrawer");
const adminSessionList = document.querySelector("#adminSessionList");
const adminSessionValue = document.querySelector("#adminSessionValue");
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
const coffeeVitrineGrid = document.querySelector("#coffeeVitrineGrid");
const slabsUnderGrid = document.querySelector("#slabsUnderGrid");
const reviewSection = document.querySelector("#reviewSection");
const languageLoader = document.querySelector("#languageLoader");
const welcomeToast = document.querySelector("#welcomeToast");
let adminInventoryCache = [];
let adminInventoryView = { search: "", category: "all", status: "all", sort: "recent" };
let adminSubmitMode = "session";
let cart = JSON.parse(localStorage.getItem("coffeeBreakCart") || "[]");
let lastShopView = JSON.parse(sessionStorage.getItem("coffeeBreakLastShopView") || "null");
let cardShows = [];
let reviews = [];
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
    heroTitle: "Des cartes qu’on garde.",
    heroText: "Singles, slabs et sealed choisis pour les collectionneurs. Photos réelles, livraison suivie et service local.",
    shopNow: "Voir les nouveautés",
    seeOptions: "Vendre ou échanger",
    trustPhotos: "Photos réelles",
    trustShipping: "Livraison suivie",
    trustPayment: "Paiement sécurisé",
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
    stayTuned: "Restez à l’affût des prochains drops à l’avance!",
    emailPlaceholder: "Votre courriel",
    curatedEyebrow: "Sélection Coffee Break",
    featuredTitle: "La vitrine CoffeeBreak",
    featuredText: "Une sélection qu’on garderait nous-mêmes.",
    newTitle: "Nouveautés",
    newText: "Les derniers ajouts à la vitrine.",
    viewAllNew: "Voir toutes les nouveautés →",
    exploreTitle: "Explorer la vitrine",
    exploreText: "Chaque catégorie a son moment.",
    exploreSingles: "Pour les cartes à collectionner, jouer ou offrir.",
    exploreGraded: "Pour les pièces protégées et les cartes qui méritent la vitrine.",
    exploreSealed: "Pour garder fermé, ouvrir ou offrir.",
    exploreUnder100: "Des cartes protégées qui restent accessibles.",
    sellTradeTitle: "Vendre / Échanger",
    sellStepOne: "Envoie-nous photos ou liste rapide.",
    sellStepTwo: "Reçois une offre claire.",
    sellStepThree: "Vends, expédie ou échange vers une carte plus importante.",
    howItWorks: "Comment ça fonctionne",
    viewAllGradedArrow: "Voir les graded →",
    newsletterTitle: "Les prochains drops, avant tout le monde.",
    newsletterText: "Nouveautés, Card Shows et collections fraîchement arrivées.",
    newsletterCta: "Recevoir les prochains drops →",
    under25Title: "Singles sous 25 $",
    under25Text: "Des ajouts faciles pour compléter une commande.",
    under100Title: "Slabs sous 100 $",
    under100Text: "Des graded accessibles pour commencer ou compléter une collection.",
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
    viewAllGraded: "Voir tous les graded",
    viewAllSealed: "Voir tout le sealed",
    buyCardsEyebrow: "On achète vos cartes",
    buyCardsTitle: "Soumets-nous ta collection.",
    buyCardsCardTitle: "On achète vos cartes",
    buyCardsCardText: "Soumets ta collection de 1 000 $ et plus avec un résumé clair, les cartes importantes et des photos nettes.",
    submitCollection: "Soumettre une collection",
    shippingCardTitle: "Livraison claire",
    shippingCardText: "Livraison depuis Laval, suivi inclus, avec protection adaptée pour singles, sealed et slabs.",
    viewShipping: "Voir la livraison",
    eventsEyebrow: "Événements",
    upcomingShows: "Prochains card shows",
    upcomingShowsShort: "Prochains shows",
    footerLocation: "Laval, Québec",
    pokemonCategory: "Pokémon",
  },
  en: {
    menuOpen: "Open menu",
    search: "Search",
    cartOpen: "Open cart",
    account: "Account",
    navAbout: "About",
    heroEyebrow: "CoffeeBreakTCG · Laval",
    heroTitle: "Cards worth keeping.",
    heroText: "Singles, slabs and sealed product selected for collectors. Real photos, tracked shipping and local service.",
    shopNow: "See new arrivals",
    seeOptions: "Sell or trade",
    trustPhotos: "Real photos",
    trustShipping: "Tracked shipping",
    trustPayment: "Secure payment",
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
    stayTuned: "Get early notice of upcoming drops!",
    emailPlaceholder: "Your email",
    curatedEyebrow: "Coffee Break picks",
    featuredTitle: "The CoffeeBreak Showcase",
    featuredText: "A selection we would keep ourselves.",
    newTitle: "New arrivals",
    newText: "The latest additions to the showcase.",
    viewAllNew: "View all new arrivals →",
    exploreTitle: "Explore the showcase",
    exploreText: "Each category has its moment.",
    exploreSingles: "For collecting, playing or gifting.",
    exploreGraded: "For protected pieces and cards worth displaying.",
    exploreSealed: "To keep sealed, open or gift.",
    exploreUnder100: "Protected cards that stay accessible.",
    sellTradeTitle: "Sell / Trade",
    sellStepOne: "Send photos or a quick list.",
    sellStepTwo: "Receive a clear offer.",
    sellStepThree: "Sell, ship or trade toward a bigger card.",
    howItWorks: "How it works",
    viewAllGradedArrow: "View graded →",
    newsletterTitle: "Upcoming drops, before everyone else.",
    newsletterText: "New arrivals, Card Shows and fresh collections.",
    newsletterCta: "Get upcoming drops →",
    under25Title: "Singles under $25",
    under25Text: "Easy additions to complete an order.",
    under100Title: "Slabs under $100",
    under100Text: "Accessible graded cards to start or grow a collection.",
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
    viewAllGraded: "View all graded",
    viewAllSealed: "View all sealed",
    buyCardsEyebrow: "We buy cards",
    buyCardsTitle: "Submit your collection.",
    buyCardsCardTitle: "We buy cards",
    buyCardsCardText: "Submit your collection of $1,000 and up with a clear summary, key cards and sharp photos.",
    submitCollection: "Submit a collection",
    shippingCardTitle: "Clear shipping",
    shippingCardText: "Shipping from Laval, tracking included, with protection adapted to singles, sealed products and slabs.",
    viewShipping: "View shipping",
    eventsEyebrow: "Events",
    upcomingShows: "Upcoming card shows",
    upcomingShowsShort: "Upcoming shows",
    footerLocation: "Laval, Quebec",
    pokemonCategory: "Pokemon",
  },
};

function t(key) {
  return translations[currentLang]?.[key] ?? translations.fr[key] ?? key;
}

const provinceCodes = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

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
  "/graded": "Graded",
};

const categoryLabels = {
  all: () => t("availableCards"),
  new: () => t("newCategory"),
  sale: () => t("saleCategory"),
  Singles: "Singles",
  Sealed: "Sealed",
  Graded: "Graded",
  Preorder: "Précommandes",
  Accessories: "Accessoires",
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
  if (document.body.classList.contains("account-mode")) renderAccount();
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
    if (["Preorder", "Accessories"].includes(product.category)) return false;
    if (getProductStatus(product) === "reserved") return false;
    const matchesCategory =
      state.category === "all" ||
      product.category === state.category ||
      (state.category === "new" && isRecentProduct(product)) ||
      (state.category === "sale" && isSaleProduct(product));
    const matchesType = state.typeFilter === "all" || product.kind === state.typeFilter || product.visual === state.typeFilter;
    const matchesSet = state.setFilter === "all" || product.setId === state.setFilter || product.setName === state.setFilter;
    const conditionCode = cardConditionCode(product);
    const haystack = `${product.name} ${product.category} ${product.condition} ${conditionCode} ${product.kind || ""} ${product.sku || ""} ${product.setName || ""} ${product.cardNumber || ""} ${product.rarity || ""} ${(product.features || []).join(" ")}`.toLowerCase();
    const query = state.search.toLowerCase().trim();
    const searchableTokens = haystack.split(/[^a-z0-9]+/).filter(Boolean);
    const matchesSearch = ["nm", "lp", "mp"].includes(query) ? searchableTokens.includes(query) : haystack.includes(query);
    return matchesCategory && matchesType && matchesSet && matchesSearch;
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
      Graded: "Graded",
      Sealed: "Sealed",
      Preorder: "Précommande",
      Accessories: "Accessoires",
    }[product.category] || product.category
  );
}

function productDetailPath(product) {
  return `/produit/${product.id}`;
}

function categoryPath(category) {
  return Object.entries(categoryRoutes).find(([, value]) => value === category)?.[0] || "/";
}

function saveShopView(productId = "") {
  lastShopView = {
    category: state.category,
    typeFilter: state.typeFilter,
    setFilter: state.setFilter,
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
  state.typeFilter = view.typeFilter || "all";
  state.setFilter = view.setFilter || "all";
  state.search = view.search || "";
  state.sort = view.sort || "featured";
  if (searchInput) searchInput.value = state.search;
  if (sortSelect) sortSelect.value = state.sort;
  if (setFilterSelect) setFilterSelect.value = state.setFilter;
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
  const tps = roundMoney(subtotal * 0.05);
  const tvq = roundMoney(subtotal * 0.09975);
  return {
    subtotal,
    taxableSubtotal: subtotal,
    tps,
    tvq,
    total: roundMoney(subtotal + tps + tvq),
  };
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
  const totals = cartTaxes();
  const drawerTotalMarkup = `
    <div class="grand-total"><span>${t("total")}</span><strong>${money.format(totals.total)}</strong></div>
  `;
  const totalMarkup = `
    <div class="grand-total"><span>${t("total")}</span><strong>${money.format(totals.total)}</strong></div>
  `;
  if (cartItems) {
    cartItems.innerHTML = cart.length ? cart.map((item) => renderCartLine(item)).join("") : `<p>${t("cartEmpty")}</p>`;
  }
  if (cartTotals) cartTotals.innerHTML = drawerTotalMarkup;
  if (checkoutItems) {
    checkoutItems.innerHTML = cart.length ? cart.map((item) => renderCartLine(item, true)).join("") : `<p>${t("cartEmpty")}</p>`;
  }
  if (checkoutTotals) checkoutTotals.innerHTML = totalMarkup;
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
  const published = reviews
    .filter((review) => review.published !== false && String(review.text || "").trim())
    .slice(0, 6)
    .map((review) => ({
      name: String(review.name || "Coffee Break").trim(),
      city: String(review.city || "").trim(),
      product: String(review.product || "").trim(),
      rating: Number(review.rating || 5),
      text: String(review.text || "").trim(),
      photoUrl: String(review.photoUrl || "").trim(),
    }));
  if (!published.length) {
    published.push({
      name: "Coffee Break TCG",
      city: "Laval",
      product: "",
      rating: 5,
      text: currentLang === "en" ? "Customer reviews will appear here soon." : "Les premiers avis clients apparaîtront ici bientôt.",
    });
  }
  return [...published, ...published, ...published];
}

function renderTrustStrip() {
  if (!trustStrip) return;
  trustStrip.innerHTML = `
    <div class="trust-list">
      <span>${t("trustPhotos")}</span>
      <span>${t("trustShipping")}</span>
      <span>${t("trustPayment")}</span>
      <span>${t("trustLocal")}</span>
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

function renderCardShows() {
  if (!cardShowsGrid) return;
  const section = cardShowsGrid.closest(".shows-section");
  section?.classList.toggle("hidden", cardShows.length === 0);
  cardShowsGrid.innerHTML = cardShows.length
    ? cardShows
        .map((show) => {
          const meta = [formatShowDateRange(show), show.time, show.tables].filter(Boolean);
          return `
            <article class="show-card">
              <div class="show-card-body">
                <div class="show-meta">${meta.map((item) => `<span>${escapeAttribute(item)}</span>`).join("")}</div>
                <h3>${escapeAttribute(show.name)}</h3>
                <p>${[show.location, show.city].filter(Boolean).map(escapeAttribute).join(" - ")}</p>
                ${show.collaborator ? `<p>Avec ${escapeAttribute(show.collaborator)}</p>` : ""}
                ${show.announcementUrl ? `<a class="show-link" href="${escapeAttribute(show.announcementUrl)}" target="_blank" rel="noopener">Voir l’annonce</a>` : ""}
              </div>
              ${show.imageUrl ? `<img src="${escapeAttribute(show.imageUrl)}" alt="${escapeAttribute(show.name)}" />` : ""}
            </article>
          `;
        })
        .join("")
    : "";
  observeDynamicElements();
}

async function loadPokemonSets() {
  if (!pokemonSetSelect) return;
  try {
    const payload = await api("/api/admin/sets");
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
  const label = categoryLabels[state.category];
  if (categoryTitle) categoryTitle.textContent = typeof label === "function" ? label() : label || t("availableCards");
  if (categoryEyebrow) {
    categoryEyebrow.textContent = state.category === "all" ? t("inventory") : typeof label === "function" ? label() : productCategoryLabel({ category: state.category });
  }
}

function isMobileShop() {
  return mobileShopQuery.matches;
}

function isHomeShopPreview() {
  return window.location.pathname === "/" && !state.search.trim() && state.typeFilter === "all";
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

function setSectionVisibility(element, visible) {
  element?.closest("section")?.classList.toggle("hidden", !visible);
}

function renderHomeSections() {
  const available = availableHomeProducts();
  const newest = available
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0) || originalOrder(a, b))
    .slice(0, 6);
  if (newArrivalsGrid) {
    newArrivalsGrid.innerHTML = newest.map((product) => homeProductCard(product)).join("");
    setSectionVisibility(newArrivalsGrid, newest.length > 0);
  }

  const featured = available
    .filter(isHomepageFeatured)
    .sort((a, b) => Number(Boolean(b.heroFeatured)) - Number(Boolean(a.heroFeatured)) || featuredRank(a) - featuredRank(b) || originalOrder(a, b));
  const fallbackFeatured = available.slice().sort((a, b) => sortNumber(b.price) - sortNumber(a.price) || originalOrder(a, b)).slice(0, 6);
  const vitrineItems = (featured.length ? featured : fallbackFeatured).slice(0, 6);
  if (coffeeVitrineGrid) {
    const hero = vitrineItems.find((product) => product.heroFeatured) || vitrineItems[0];
    const secondary = vitrineItems.filter((product) => product !== hero).slice(0, 5);
    coffeeVitrineGrid.innerHTML = hero
      ? `${homeProductCard(hero, { hero: true })}<div class="editorial-featured-secondary">${secondary.map((product) => homeProductCard(product)).join("")}</div>`
      : "";
    setSectionVisibility(coffeeVitrineGrid, Boolean(hero));
  }

  const slabsUnder = available.filter((product) => product.category === "Graded" && Number(product.price || 0) <= 100).slice(0, 6);
  if (slabsUnderGrid) {
    slabsUnderGrid.innerHTML = slabsUnder.map((product) => homeProductCard(product)).join("");
    setSectionVisibility(slabsUnderGrid, slabsUnder.length >= 3);
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
    productGrid.innerHTML = `<p>${t("shopEmpty")}</p>`;
  }
  renderMobileMore(products.length > 0 && !homePreview && isMobileShop());
  renderHomeSections();
  renderCuratedSections();
  observeDynamicElements();
}

function categoryMoreLinks() {
  if (state.category === "Singles") {
    return `<a class="button primary" href="/singles" data-route-category="Singles">${t("viewAllSingles")}</a>`;
  }
  if (state.category === "Graded") {
    return `<a class="button primary" href="/graded" data-route-category="Graded">${t("viewAllGraded")}</a>`;
  }
  if (state.category === "Sealed") {
    return `<a class="button primary" href="/sealed" data-route-category="Sealed">${t("viewAllSealed")}</a>`;
  }
  return `
    <a class="button primary" href="/singles" data-route-category="Singles">${t("viewAllSingles")}</a>
    <a class="button secondary" href="/graded" data-route-category="Graded">${t("viewAllGraded")}</a>
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
    [t("under100Title"), t("under100Text"), available.filter((product) => product.category === "Graded" && Number(product.price || 0) <= 100).slice(0, 6)],
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
  const publicStock =
    product.category === "Preorder"
      ? `${Number(product.stock || 0)} disponible${Number(product.stock || 0) > 1 ? "s" : ""} en précommande`
      : product.category === "Sealed" || product.category === "Accessories"
        ? `${Number(product.stock || 0)} disponible${Number(product.stock || 0) > 1 ? "s" : ""}`
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
      <div class="detail-copy">
        <p class="eyebrow">${productCategoryLabel(product)}</p>
        <h1>${product.name}</h1>
        <p class="condition">${[
          product.gradingCompany && product.grade ? `${product.gradingCompany} ${product.grade}` : "",
          product.setName,
          product.cardNumber ? `#${product.cardNumber}` : "",
          product.rarity,
          product.condition,
        ]
          .filter(Boolean)
          .join(" - ") || "Détails à confirmer"}</p>
        <div class="detail-price">${priceMarkup(product, "detail-price-stack")}</div>
        <div class="detail-pills">
          ${product.gradingCompany && product.grade ? `<span>${product.gradingCompany} ${product.grade}</span>` : ""}
          ${cardCondition ? `<span>${cardCondition}</span>` : ""}
          ${product.maxPerCart ? `<span>Limite ${product.maxPerCart} / demande</span>` : ""}
          ${features.map((feature) => `<span>${feature}</span>`).join("")}
        </div>
        <button class="button primary" type="button" data-add-cart="${product.id}" ${status === "reserved" || limit <= 0 ? "disabled" : ""}>${status === "reserved" ? t("reserved") : t("addToCartFull")}</button>
        <dl class="detail-specs">
          ${detailSpec("Condition", conditionDetail)}
          ${detailSpec("Numéro", product.cardNumber)}
          ${detailSpec("Extension", product.setName)}
          ${detailSpec("Rareté", product.rarity)}
          ${detailSpec("Slab", product.gradingCompany && product.grade ? `${product.gradingCompany} ${product.grade}` : "")}
          ${features.length ? detailSpec("Spécifications", features.join(" - ")) : ""}
          <div><dt>Prix</dt><dd>${money.format(product.price)}</dd></div>
          <div><dt>Protection</dt><dd>Sleeve, team bag et emballage rigide inclus.</dd></div>
          <div><dt>Expédition</dt><dd>Livraison depuis Laval, suivi inclus.</dd></div>
        </dl>
      </div>
    </div>
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
    title: "On achète vos cartes.",
    text:
      "Soumets-nous ta collection d’une valeur minimale de 1 000 $. Ajoute un résumé clair, les cartes importantes et des photos nettes pour qu’on puisse te répondre sérieusement.",
    cards: [
      ["Photos claires", "Ajoute le devant, le dos, les coins et les défauts visibles."],
      ["Résumé complet", "Décris la collection, les cartes importantes, l’état général et tout détail utile pour comprendre ce que tu proposes."],
      ["Prix demandé", "Indique le montant souhaité pour la collection complète afin de nous aider à répondre rapidement."],
    ],
    sellForm: true,
  },
  livraison: {
    eyebrow: "Livraison",
    title: "Livraison suivie depuis Laval.",
    text:
      "Chaque commande est protégée selon le type d’item. Le suivi est inclus et l’emballage est préparé avec soin.",
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
      "Coffee Break TCG est nouveau, mais nous sommes réellement investis. Nous adorons ce que nous faisons, nous emballons chaque commande avec soin et nous voulons bâtir une relation de confiance avec les collectionneurs.",
    cards: [
      ["Livraison", "Nous expédions depuis Laval avec suivi. La livraison est gratuite à partir de 100 $, sinon elle est de 6,99 $."],
      ["Protection des cartes", "Les singles sont envoyés en sleeve, top loader ou card saver, puis protégés dans un emballage rigide."],
      ["Slabs et sealed", "Les slabs et produits sealed sont emballés avec rembourrage et boîte solide pour limiter les mouvements pendant le transport."],
      ["Paiement", "Le paiement Square est en intégration. Les commandes peuvent être confirmées avant le paiement lorsque nécessaire."],
      ["Réservation", "Lorsqu’un paiement Square est lancé, les items sont réservés pendant 10 minutes. Si le paiement n’est pas complété, ils reviennent automatiquement en vitrine."],
      ["État des cartes", "Nous faisons de notre mieux pour décrire chaque carte clairement. Tu peux demander des photos additionnelles avant de payer."],
      ["On achète vos cartes", "Nous évaluons les collections de 1 000 $ et plus avec photos, résumé et prix demandé."],
      ["Card shows", "Les prochains événements sont affichés sur la page d’accueil lorsqu’ils sont confirmés."],
    ],
  },
  apropos: {
    eyebrow: "À propos",
    title: "Coffee Break TCG, basé à Laval.",
    text:
      "Nous sommes une jeune boutique Pokémon TCG bâtie autour d’une idée simple: prendre le temps de bien faire les choses, une carte, une commande et une rencontre à la fois.",
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
    title: "We buy your cards.",
    text:
      "Submit your collection with a minimum value of $1,000. Add a clear summary, key cards and sharp photos so we can review it seriously.",
    cards: [
      ["Clear photos", "Add the front, back, corners and visible flaws."],
      ["Full summary", "Describe the collection, key cards, general condition and any useful details that help us understand what you are offering."],
      ["Asking price", "Tell us what you want for the full collection so we can answer faster."],
    ],
    sellForm: true,
  },
  livraison: {
    eyebrow: "Shipping",
    title: "Tracked shipping from Laval.",
    text: "Each order is protected based on the item type. Tracking is included and packaging is prepared with care.",
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
      "Coffee Break TCG is new, but we are genuinely invested. We love what we do, package every order carefully and want to build trust with collectors.",
    cards: [
      ["Shipping", "We ship from Laval with tracking. Free shipping starts at $100, otherwise shipping is $6.99."],
      ["Card protection", "Singles are shipped in a sleeve, top loader or card saver, then protected in rigid packaging."],
      ["Slabs and sealed", "Slabs and sealed products are packed with padding and a solid box."],
      ["Payment", "Square payment is being integrated. Orders can be confirmed before payment when needed."],
      ["Reservation", "When a Square payment is started, items are held for 10 minutes. If payment is not completed, they automatically return to the showcase."],
      ["Condition", "We do our best to describe each card clearly. You can ask for additional photos before paying."],
      ["Sell your cards", "We review collections of $1,000 and up with photos, a summary and an asking price."],
      ["Card shows", "Upcoming shows appear on the home page once confirmed."],
    ],
  },
  apropos: {
    eyebrow: "About",
    title: "Coffee Break TCG, based in Laval.",
    text:
      "We are a young Pokemon TCG shop built around a simple idea: taking the time to do things properly, one card, one order and one conversation at a time.",
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
            <label>${currentLang === "en" ? "Photos" : "Photos"} <input name="collectionPhotos" type="file" accept="image/*" multiple /></label>
            <button class="button primary" type="submit">${currentLang === "en" ? "Send request" : "Envoyer la demande"}</button>
            <p class="form-status" role="status"></p>
          </form>`
        : ""
    }
  `;
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

function goToCategory(category, push = true) {
  const path = Object.entries(categoryRoutes).find(([, value]) => value === category)?.[0] || "/";
  state.category = category;
  if (push) history.pushState({ category }, "", path);
  applyRoute();
  requestAnimationFrame(() => scrollToShopItems("smooth"));
  window.setTimeout(() => scrollToShopItems("smooth"), 120);
}

function applyRoute() {
  const isAdmin = window.location.pathname === "/admin";
  const isCheckout = window.location.pathname === "/checkout";
  const isAccount = window.location.pathname === "/compte";
  const isCreateAccount = window.location.pathname === "/creer-compte";
  const productMatch = window.location.pathname.match(/^\/produit\/([^/]+)$/);
  const contentMatch = window.location.pathname.match(/^\/(vendre|livraison|faq|apropos)$/);
  document.body.classList.toggle("admin-mode", isAdmin);
  document.body.classList.toggle("checkout-mode", isCheckout);
  document.body.classList.toggle("account-mode", isAccount || isCreateAccount);
  document.body.classList.toggle("product-mode", Boolean(productMatch));
  document.body.classList.toggle("content-mode", Boolean(contentMatch));
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
  const category = categoryRoutes[window.location.pathname] || "all";
  state.category = category;
  document.querySelectorAll("[data-category]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  renderProducts();
  renderCardShows();
  if (window.location.pathname !== "/" && category !== "all") {
    requestAnimationFrame(() => scrollToShopItems("auto"));
    window.setTimeout(() => scrollToShopItems("auto"), 160);
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

function renderAdminInventoryRow(item) {
  const profit = lineProfit(item);
  return `
    <tr class="admin-inventory-row" data-admin-open-item="${escapeAttribute(item.id)}">
      <td data-label="Item">
        <div class="admin-item">
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
  const { summary, inventory: adminInventory, orders, accounting, priceSync, cardShows: adminCardShows = [], reviews: adminReviews = [] } = payload;
  adminInventoryCache = adminInventory || [];
  cardShows = adminCardShows || [];
  reviews = adminReviews || [];
  adminMetrics.innerHTML = [
    ["Ventes", summary.orders],
    ["Unités vendues", summary.unitsSold],
    ["Revenu", adminMoney(summary.revenue)],
    ["Profit", adminMoney(summary.profit)],
    ["Inventaire payé", adminMoney(summary.inventoryValue)],
    ["Valeur marché", adminMoney(summary.marketValue)],
    ["Profit potentiel", adminMoney(summary.potentialProfit)],
    ["En session", summary.draftItems || 0],
  ]
    .map(([label, value]) => `<div class="metric-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  if (adminPriceSync) adminPriceSync.textContent = "";
  renderAccounting(accounting);
  const draftItems = adminInventoryCache.filter((item) => item.status === "draft");
  renderAdminSession(draftItems);

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
  [adminProductDrawer, adminSessionDrawer, adminSaleModal, adminPriceModal, adminCommandPalette].forEach((panel) => {
    panel?.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("admin-panel-open");
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
  setAdminDrawerSummary(null);
  if (adminPrevItemButton) adminPrevItemButton.hidden = true;
  if (adminNextItemButton) adminNextItemButton.hidden = true;
  adminEditActions?.classList.add("hidden");
  [adminDrawerPriceButton, adminDrawerSaleButton, adminDrawerRemoveButton].forEach((button) => {
    if (button) button.dataset.adminDrawerItem = "";
  });
}

function openAdminAddDrawer() {
  adminSubmitMode = "session";
  resetAdminProductForm();
  if (adminProductDrawerMode) adminProductDrawerMode.textContent = "Ajout rapide";
  if (adminProductDrawerTitle) adminProductDrawerTitle.textContent = "Ajouter une carte";
  if (adminSaveProductButton) adminSaveProductButton.textContent = "Ajouter à la session";
  openAdminPanel(adminProductDrawer);
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
  setAdminField("kind", item.kind || "single");
  setAdminField("rarity", item.rarity);
  setAdminField("badge", item.badge || "");
  setAdminField("featuredRank", item.featuredRank || "");
  setAdminField("homepageCollection", item.homepageCollection || "");
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
  setAdminDrawerSummary(item);
  syncAdminDrawerNavigation(item.id);
  adminEditActions?.classList.remove("hidden");
  if (adminDrawerPriceButton) adminDrawerPriceButton.dataset.adminDrawerItem = item.id;
  if (adminDrawerSaleButton) adminDrawerSaleButton.dataset.adminDrawerItem = item.id;
  if (adminDrawerRemoveButton) adminDrawerRemoveButton.dataset.adminDrawerItem = item.id;
  const status = adminProductForm.querySelector(".admin-status");
  if (status) status.textContent = `Modification de ${item.name}. Sauvegarde pour mettre l'item a jour.`;
  adminSubmitMode = "keep";
  if (adminProductDrawerMode) adminProductDrawerMode.textContent = "Modification";
  if (adminProductDrawerTitle) adminProductDrawerTitle.textContent = item.name || "Modifier l’item";
  if (adminSaveProductButton) adminSaveProductButton.textContent = "Enregistrer";
  openAdminPanel(adminProductDrawer);
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
      (candidate) => `
        <article
          class="image-choice"
          data-image-choice
          data-image-url="${escapeAttribute(candidate.imageUrl)}"
          data-name="${escapeAttribute(candidate.name || "")}"
          data-set-id="${escapeAttribute(candidate.setId || "")}"
          data-set-name="${escapeAttribute(candidate.set || "")}"
          data-number="${escapeAttribute(candidate.number || "")}"
          data-rarity="${escapeAttribute(candidate.rarity || "")}"
          data-image-type="${escapeAttribute(candidate.imageType || "card")}"
        >
          <img class="${candidate.imageType === "sealed" ? "sealed-choice-img" : ""}" src="${escapeAttribute(candidate.imageUrl)}" alt="${escapeAttribute(candidate.name)}" />
          <span>
            <strong>${escapeAttribute(candidate.name)}</strong>
            <small>${escapeAttribute(candidate.set || "Set à confirmer")}${candidate.number ? ` - #${escapeAttribute(candidate.number)}` : ""}</small>
            <small>${escapeAttribute(candidate.rarity || "Rareté à confirmer")}</small>
          </span>
          <div class="image-choice-actions">
            <button type="button" data-image-role="front">Avant</button>
            <button type="button" data-image-role="back">Arrière</button>
          </div>
        </article>
      `
    )
    .join("");
  selectImageCandidate(imageSearchPreview.querySelector("[data-image-choice]"));
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
  suggestMarketPrice({ silent: true });
}

async function suggestMarketPrice(options = {}) {
  if (!adminProductForm || !suggestMarketButton) return;
  const form = new FormData(adminProductForm);
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
  if (!name && !setId) {
    if (imageSearchStatus) imageSearchStatus.textContent = "Entre le nom ou choisis une extension.";
    return;
  }
  resetImageSearch();
  searchCardImageButton.disabled = true;
  searchCardImageButton.textContent = "Recherche...";
  if (imageSearchStatus) imageSearchStatus.textContent = "";
  try {
    const payload = await api(
      `/api/admin/card-images?q=${encodeURIComponent(name)}&number=${encodeURIComponent(cardNumber || "")}&setId=${encodeURIComponent(setId)}&productType=${encodeURIComponent(productType)}`
    );
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
  const adminDeleteButton = event.target.closest("[data-admin-delete]");
  const adminDuplicateButton = event.target.closest("[data-admin-duplicate]");
  const adminViewProductButton = event.target.closest("[data-admin-view-product]");
  const adminAdjacentButton = event.target.closest("[data-admin-adjacent]");
  const adminOpenItemRow = event.target.closest("[data-admin-open-item]");
  const adminClosePanelButton = event.target.closest("[data-admin-close-panel]");
  const adminStatusFilterButton = event.target.closest("[data-admin-status-filter]");
  const adminCategoryFilterButton = event.target.closest("[data-admin-category-filter]");
  const adminCommandButton = event.target.closest("[data-admin-command]");
  const editShowButton = event.target.closest("[data-edit-show]");
  const deleteShowButton = event.target.closest("[data-delete-show]");
  const editReviewButton = event.target.closest("[data-edit-review]");
  const deleteReviewButton = event.target.closest("[data-delete-review]");
  const adminCancelOrderButton = event.target.closest("[data-admin-cancel-order]");
  const adminPaidOrderButton = event.target.closest("[data-admin-paid-order]");
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

  if (passwordToggle) {
    event.preventDefault();
    const input = passwordToggle.parentElement?.querySelector("input");
    if (input) input.type = input.type === "password" ? "text" : "password";
  }
  if (adminClosePanelButton) {
    event.preventDefault();
    closeAdminPanels();
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
  if (adminCommandButton) {
    event.preventDefault();
    const command = adminCommandButton.dataset.adminCommand;
    if (command === "add") openAdminAddDrawer();
    if (command === "session") openAdminSessionDrawer();
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
  if (adminAdjacentButton?.dataset.adminAdjacent) editAdminItem(adminAdjacentButton.dataset.adminAdjacent);
  if (adminEditButton) editAdminItem(adminEditButton.dataset.adminEdit);
  if (adminDiscountButton) applyAdminDiscount(adminDiscountButton.dataset.adminDiscount, adminDiscountButton);
  if (adminPriceAdjustButton) openAdminPriceModal(adminPriceAdjustButton.dataset.adminPriceAdjust);
  if (adminRemoveButton) removeAdminItem(adminRemoveButton.dataset.adminRemove, adminRemoveButton);
  if (adminAddSessionButton) addAdminItemToSession(adminAddSessionButton.dataset.adminAddSession, adminAddSessionButton);
  if (adminDeleteButton) deleteAdminItem(adminDeleteButton.dataset.adminDelete, adminDeleteButton);
  if (adminDuplicateButton) duplicateAdminItem(adminDuplicateButton.dataset.adminDuplicate);
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
    editAdminItem(adminOpenItemRow.dataset.adminOpenItem);
  }
  if (tabButton) selectCategory(tabButton.dataset.category);
  if (routeCategory) {
    event.preventDefault();
    closeDrawers();
    state.typeFilter = "all";
    goToCategory(routeCategory.dataset.routeCategory);
  }
  if (kindRoute) {
    event.preventDefault();
    closeDrawers();
    state.category = kindRoute.dataset.kindRoute === "slab" ? "Graded" : "Sealed";
    state.typeFilter = kindRoute.dataset.kindRoute;
    history.pushState({}, "", state.category === "Graded" ? "/graded" : "/sealed");
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
  }
  if (checkoutLink) {
    event.preventDefault();
    closeDrawers();
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
  state.search = event.target.value;
  renderProducts();
});

document.querySelector("[data-open-search]").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  searchInput.focus();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

setFilterSelect?.addEventListener("change", (event) => {
  state.setFilter = event.target.value || "all";
  renderProducts();
});

document.querySelectorAll("[data-feature-checkbox]").forEach((input) => {
  input.addEventListener("change", updateFeatureLimitState);
});

[adminInventorySearch, adminInventoryCategory, adminInventoryStatus, adminInventorySort].forEach((control) => {
  control?.addEventListener("input", () => {
    adminInventoryView = {
      search: adminInventorySearch?.value || "",
      category: adminInventoryCategory?.value || "all",
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
  if (status) status.textContent = currentLang === "en" ? "Sending request..." : "Envoi de la demande...";
  try {
    const payload = await api("/api/sell-request", { method: "POST", body: JSON.stringify(body) });
    if (status) {
      status.textContent =
        currentLang === "en"
          ? payload.message || "Request sent. We will review it and reply by email."
          : payload.message || "Demande envoyée. Nous allons l’évaluer et répondre par courriel.";
    }
    event.target.reset();
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
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
    closeAdminPanels();
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
    openAdminAddDrawer();
  }

  if (event.key === "/") {
    event.preventDefault();
    adminInventorySearch?.focus();
  }
});

adminOpenAddButton?.addEventListener("click", openAdminAddDrawer);
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
  if (adminDrawerPriceButton.dataset.adminDrawerItem) openAdminPriceModal(adminDrawerPriceButton.dataset.adminDrawerItem);
});
adminDrawerSaleButton?.addEventListener("click", () => {
  if (adminDrawerSaleButton.dataset.adminDrawerItem) openAdminSaleModal(adminDrawerSaleButton.dataset.adminDrawerItem);
});
adminDrawerRemoveButton?.addEventListener("click", () => {
  if (adminDrawerRemoveButton.dataset.adminDrawerItem) removeAdminItem(adminDrawerRemoveButton.dataset.adminDrawerItem, adminDrawerRemoveButton);
});
searchCardImageButton?.addEventListener("click", searchCardImage);
adminProductForm?.querySelector('input[name="name"]')?.addEventListener("input", () => {
  if (editingProductId?.value) {
    resetImageSearch();
    if (imageSearchStatus) imageSearchStatus.textContent = "";
    return;
  }
  resetCardLookupDetails();
});
imageSearchPreview?.addEventListener("click", (event) => {
  const roleButton = event.target.closest("[data-image-role]");
  const choice = event.target.closest("[data-image-choice]");
  if (choice) selectImageCandidate(choice, roleButton?.dataset.imageRole || "front");
});
suggestMarketButton?.addEventListener("click", suggestMarketPrice);
adminProductForm?.querySelector('select[name="gradingCompany"]')?.addEventListener("change", applySlabMode);
publishDraftProductsButton?.addEventListener("click", publishDraftProducts);
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

adminLogoutButton?.addEventListener("click", async () => {
  try {
    await api("/api/admin/logout", { method: "POST", body: "{}" });
  } catch {
    // The local session is cleared by the server when possible; the UI still locks if the request fails.
  }
  toggleAdminLinks(false);
  showAdminLogin("");
  history.pushState({}, "", "/");
  applyRoute();
});

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
      ? "draft"
      : form.get("status") || "";
  const body = {
    id,
    name: form.get("name"),
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
    homepageCollection: form.get("homepageCollection"),
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
Promise.all([loadProducts(), loadCardShows(), loadReviews(), loadCurrentUser()]).then(() => {
  applyRoute();
  renderCardShows();
  renderReviews();
  renderCart();
});
