const loginPanel = document.querySelector("[data-login-panel]");
const appPanel = document.querySelector("[data-app-panel]");
const loginForm = document.querySelector("[data-login-form]");
const loginMessage = document.querySelector("[data-login-message]");
const greeting = document.querySelector("[data-greeting]");
const emailCategories = [
  "Critique",
  "Card Shows",
  "Collections à vendre",
  "Registraire des entreprises",
  "Fournisseurs importants",
  "Partenariats",
  "Emails de mon boss",
  "Emails nécessitant une décision",
  "Important",
  "Questions clients",
  "Factures",
  "Commandes",
  "Livraison",
  "Faible",
  "Marketing",
  "Newsletters",
  "Promotions",
];
const emailPriorities = ["Critique", "Important", "Peut attendre"];
const replyVerdicts = ["correcte", "à modifier", "incorrecte"];
let currentEmailFilter = "all";
let currentContentOpportunities = [];
let activeStudioOpportunity = null;

function oauthMessageFromParams() {
  const params = new URLSearchParams(window.location.search);
  const service = params.has("gmail") ? "Gmail" : params.has("calendar") ? "Google Calendar" : "";
  const code = params.get("gmail") || params.get("calendar") || "";
  if (!service || !code) return null;
  const message = params.get("message") || params.get("expected") || params.get("email") || "";
  const labels = {
    connected: `${service} est connecté. Tu peux importer les données.`,
    "missing-config": `${service}: configuration OAuth manquante sur le serveur.`,
    "invalid-state": `${service}: session OAuth expirée ou invalide. Réessaie depuis Jarvis.`,
    expired: `${service}: lien OAuth expiré. Relance la connexion.`,
    "wrong-account": `${service}: mauvais compte Google sélectionné.`,
    error: `${service}: Google a retourné une erreur.`,
  };
  return {
    ok: code === "connected",
    text: `${labels[code] || `${service}: statut OAuth ${code}.`}${message ? ` Détail: ${message}` : ""}`,
  };
}

function renderOAuthMessage() {
  const node = document.querySelector("[data-oauth-alert]");
  if (!node) return;
  const message = oauthMessageFromParams();
  if (!message) return;
  node.hidden = false;
  node.classList.toggle("ok", message.ok);
  node.textContent = message.text;
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, document.title, cleanUrl);
}

function cleanSensitiveUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  if (email) loginForm.querySelector('input[name="email"]').value = email;
  if (!params.has("password")) return;
  const cleanUrl = window.location.origin === "null" ? window.location.pathname : `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, document.title, cleanUrl);
  loginMessage.textContent = "Le mot de passe a été retiré de l’URL. Entre-le seulement dans le champ du formulaire.";
}

function warnIfOpenedAsFile() {
  if (window.location.protocol !== "file:") return false;
  loginMessage.innerHTML = 'Jarvis doit être ouvert depuis le serveur local: <a href="http://localhost:4173/jarvis">http://localhost:4173/jarvis</a>';
  loginForm.querySelector("button").disabled = true;
  return true;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Erreur Jarvis");
  return payload;
}

function setSessionView(user) {
  loginPanel.hidden = Boolean(user);
  appPanel.hidden = !user;
  if (user) greeting.textContent = `Bonjour ${user.shortName || user.name || "Max"}`;
}

function money(value) {
  return Number(value || 0).toLocaleString("fr-CA", { style: "currency", currency: "CAD" });
}

function shortDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-CA", { weekday: "short", month: "short", day: "numeric" });
}

function shortDateTime(value) {
  if (!value) return "Jamais";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fr-CA", { dateStyle: "medium", timeStyle: "short" });
}

function renderList(container, items, renderer, emptyText) {
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }
  container.innerHTML = items.map(renderer).join("");
}

function pill(label, type = "") {
  return `<span class="pill ${type}">${label}</span>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function optionList(options, selected) {
  return options
    .map((option) => `<option value="${escapeHtml(option)}" ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`)
    .join("");
}

function scorePill(score) {
  return `<span class="score-pill">${Math.round(Number(score || 0))}/100</span>`;
}

function setCounts(counts) {
  Object.entries(counts).forEach(([key, value]) => {
    const node = document.querySelector(`[data-count="${key}"]`);
    if (node) node.textContent = value;
  });
}

function renderGmailState(integrations) {
  const gmail = integrations.gmail;
  const accounts = Object.values(gmail.accounts || {});
  const accountRows = accounts.length
    ? accounts
        .map(
          (account) =>
            `<span class="gmail-account ${account.connected ? "connected" : ""}">${account.label}: ${
              account.connected ? `connecté (${account.email})` : "non connecté"
            }</span>`
        )
        .join("")
    : "";
  document.querySelector("[data-gmail-state]").innerHTML = `
    <p>${gmail.message}</p>
    <div class="gmail-account-row">${accountRows}</div>
  `;
}

function renderCalendarState(integrations) {
  const calendar = integrations.calendar;
  const accounts = Object.values(calendar.accounts || {});
  const accountRows = accounts.length
    ? accounts
        .map((account) => {
          const calendarCount = account.calendars?.length ? ` · ${account.calendars.length} calendrier${account.calendars.length > 1 ? "s" : ""}` : "";
          return `<span class="gmail-account ${account.connected ? "connected" : ""}">${account.label}: ${
            account.connected ? `connecté (${account.email || "Google"})${calendarCount}` : "non connecté"
          }</span>`;
        })
        .join("")
    : "";
  document.querySelector("[data-calendar-state]").innerHTML = `
    <p>${calendar.message}</p>
    <div class="gmail-account-row">${accountRows}</div>
  `;
}

function estimateMinutes(item) {
  const type = String(item?.type || "").toLowerCase();
  const title = String(item?.title || "").toLowerCase();
  if (type.includes("commande") || title.includes("expédier")) return 4;
  if (type.includes("email") || title.includes("répondre")) return 2;
  if (type.includes("calendrier") || type.includes("card show")) return 3;
  if (title.includes("instagram")) return 15;
  if (title.includes("cartes")) return 30;
  return 8;
}

function impactFor(item) {
  const type = String(item?.type || "").toLowerCase();
  const title = String(item?.title || "").toLowerCase();
  if (type.includes("commande")) return "Satisfaction client immédiate.";
  if (type.includes("email")) return "Réduit le bruit mental et évite les suivis oubliés.";
  if (type.includes("card show") || title.includes("card show")) return "Croissance.";
  if (title.includes("instagram")) return "Visibilité.";
  if (title.includes("cartes")) return "Vitrine plus forte et plus de chances de vente.";
  return "Clarté opérationnelle.";
}

function whyFor(item) {
  const detail = String(item?.detail || "").trim();
  if (detail) return detail;
  const type = String(item?.type || "").toLowerCase();
  if (type.includes("commande")) return "Une commande client est en attente.";
  if (type.includes("email")) return "Un message demande une décision ou une réponse.";
  return "Jarvis estime que c’est le meilleur levier maintenant.";
}

function actionId(item) {
  return btoa(unescape(encodeURIComponent(`${item?.type || ""}:${item?.title || ""}:${item?.action || ""}`))).replace(/=+$/g, "");
}

function completedActions() {
  try {
    return new Set(JSON.parse(localStorage.getItem("jarvis_completed_actions") || "[]"));
  } catch {
    return new Set();
  }
}

function renderActionCard(slot, item, label) {
  const node = document.querySelector(`[data-action-card="${slot}"]`);
  if (!node) return;
  if (!item) {
    node.innerHTML = `
      <p class="action-label">${label}</p>
      <h2>Rien à traiter.</h2>
      <p class="action-muted">Jarvis ne voit pas d’action prioritaire dans cette zone.</p>
    `;
    node.classList.add("is-empty");
    return;
  }
  const id = actionId(item);
  const isDone = completedActions().has(id);
  node.classList.toggle("is-complete", isDone);
  node.classList.remove("is-empty");
  node.innerHTML = `
    <p class="action-label">${label}</p>
    <div class="action-title-row">
      <h2>${escapeHtml(item.title || "Action sans titre")}</h2>
      <span>${estimateMinutes(item)} min</span>
    </div>
    <dl>
      <div>
        <dt>Pourquoi</dt>
        <dd>${escapeHtml(whyFor(item))}</dd>
      </div>
      <div>
        <dt>Impact</dt>
        <dd>${escapeHtml(impactFor(item))}</dd>
      </div>
    </dl>
    ${item.opportunity ? renderOpportunityBlock(item.opportunity, true) : ""}
    <button type="button" data-complete-action="${escapeHtml(id)}">${isDone ? "Terminé" : "Terminé"}</button>
  `;
}

function shortTaskLabel(count, singular, plural = `${singular}s`) {
  if (!count) return "";
  return `${count} ${count > 1 ? plural : singular}`;
}

function renderTodaySummary(counts, cardShowsCount) {
  const items = [
    shortTaskLabel(counts.ordersToShip || 0, "commande à expédier", "commandes à expédier"),
    shortTaskLabel(counts.invoices || 0, "facture à vérifier", "factures à vérifier"),
    shortTaskLabel(cardShowsCount || 0, "opportunité Card Show", "opportunités Card Show"),
  ].filter(Boolean);
  document.querySelector("[data-today-summary]").innerHTML = items.length
    ? `<div class="summary-lines">${items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>`
    : `<p>Aucun feu administratif majeur. Tu peux passer à une action de croissance.</p>`;
  const adminMinutes = Math.max(0, (counts.ordersToShip || 0) * 4 + (counts.invoices || 0) * 2 + Math.min(cardShowsCount || 0, 3) * 2);
  document.querySelector("[data-admin-time]").textContent = `${adminMinutes || 8} minutes`;
}

function renderTicker(ticker) {
  const node = document.querySelector("[data-ticker]");
  if (!node) return;
  node.innerHTML = (ticker || [])
    .map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
    .join("");
}

function renderJarvisSpeech(payload, decisions) {
  const node = document.querySelector("[data-jarvis-speech]");
  if (!node) return;
  const counts = payload.counts || {};
  const focus = decisions?.[0];
  const urgency = counts.criticalEmails ? `${counts.criticalEmails} email${counts.criticalEmails > 1 ? "s" : ""} critique${counts.criticalEmails > 1 ? "s" : ""}` : "aucune urgence critique";
  node.textContent = `Bonjour Max. Tu as ${urgency}, ${counts.ordersToShip || 0} commande${counts.ordersToShip > 1 ? "s" : ""} à expédier et ${
    counts.cardShows || 0
  } opportunité${counts.cardShows > 1 ? "s" : ""} Card Show. Je recommande: ${focus?.title || "ajouter des cartes au site"}. ${focus?.action || ""}`;
}

function renderLivingBoard(payload, decisions) {
  const node = document.querySelector("[data-living-board]");
  if (!node) return;
  const emails = payload.emails?.important || [];
  const inventory = payload.inventoryIntelligence || {};
  const cards = [
    {
      label: "Maintenant",
      title: decisions?.[0]?.title || "Aucune urgence",
      detail: decisions?.[0]?.action || "Passer à une action de croissance.",
    },
    {
      label: "Email",
      title: emails[0]?.subject || "Aucun email critique",
      detail: emails[0]?.action || "Gmail reste sous contrôle.",
    },
    {
      label: "Inventaire",
      title: `${inventory.summary?.dormantCount || 0} item${inventory.summary?.dormantCount > 1 ? "s" : ""} dormant${inventory.summary?.dormantCount > 1 ? "s" : ""}`,
      detail: inventory.liquidityAlerts?.[0]?.reason || "Aucune alerte de liquidité majeure.",
    },
    {
      label: "Opportunité",
      title: payload.contentOpportunities?.[0]?.title || "Contenu à définir",
      detail: payload.contentOpportunities?.[0]?.tier || "Score opportunité à calculer.",
    },
  ];
  node.innerHTML = cards
    .map(
      (card, index) => `
        <article style="--i:${index}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.detail)}</p>
        </article>
      `
    )
    .join("");
}

function growthScoreFrom(growth, priorities) {
  let score = 72;
  if ((growth.cardsAddedThisWeek || 0) >= 20) score += 8;
  if ((growth.instagramPostsThisWeek || 0) > 0) score += 7;
  if ((growth.cardShowsThisWeek || 0) > 0) score += 6;
  if ((growth.collectionsBoughtThisWeek || 0) > 0) score += 4;
  score = Math.max(35, Math.min(100, score));
  const missing = [];
  if ((growth.instagramPostsThisWeek || 0) === 0) missing.push("publier Instagram");
  if ((growth.cardShowsThisWeek || 0) === 0) missing.push("confirmer un Card Show");
  if ((growth.cardsAddedThisWeek || 0) < 20) missing.push("ajouter 20 cartes");
  if (!missing.length && priorities?.[0]) missing.push(priorities[0].title.toLowerCase());
  return { score, missing };
}

function renderGrowthScore(growth, priorities) {
  const node = document.querySelector("[data-growth-score]");
  if (!node) return;
  const result = growthScoreFrom(growth || {}, priorities || []);
  node.innerHTML = `
    <div class="growth-number">
      <span>Score croissance</span>
      <strong>${result.score} / 100</strong>
    </div>
    <div class="growth-missing">
      <span>Pour atteindre 85</span>
      <ul>${result.missing.map((item) => `<li>+ ${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function opportunityScorePill(opportunity) {
  return `<span class="opportunity-score">Score opportunité ${Math.round(Number(opportunity?.score || 0))}/100 · ${escapeHtml(opportunity?.tier || "")}</span>`;
}

function renderOpportunityBlock(opportunity, compact = false) {
  if (!opportunity) return "";
  return `
    <div class="content-opportunity-card ${compact ? "compact-opportunity" : ""}" data-content-opportunity-id="${escapeHtml(opportunity.id)}">
      <div class="item-title-row">
        <div>
          <strong>${escapeHtml(opportunity.title)}</strong>
          <p>${escapeHtml(opportunity.whyNow || "Pourquoi maintenant à valider.")}</p>
        </div>
        ${opportunityScorePill(opportunity)}
      </div>
      <div class="opportunity-meta">
        <span>Temps: ${escapeHtml(opportunity.timeRequired || "")}</span>
        <span>Confiance: ${escapeHtml(opportunity.confidence || "Prudent")}</span>
        <span>Impact: ${escapeHtml(opportunity.impactExpected || "")}</span>
      </div>
      <div class="factor-list">
        ${(opportunity.factors || [])
          .map(
            (factor) => `
              <div>
                <span>+${Math.round(Number(factor.points || 0))}</span>
                <p><strong>${escapeHtml(factor.label)}</strong> ${escapeHtml(factor.detail || "")}</p>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="content-actions">
        <button type="button" data-content-develop data-opportunity-id="${escapeHtml(opportunity.id)}">Développer l’idée</button>
        <button type="button" class="ghost-dark" data-content-generate="reel" data-opportunity-id="${escapeHtml(opportunity.id)}">Générer le Reel</button>
        <button type="button" class="ghost-dark" data-content-generate="post" data-opportunity-id="${escapeHtml(opportunity.id)}">Générer le Post</button>
        <button type="button" class="ghost-dark" data-content-generate="story" data-opportunity-id="${escapeHtml(opportunity.id)}">Générer la Story</button>
        <button type="button" class="ghost-dark" data-content-task data-opportunity-id="${escapeHtml(opportunity.id)}">Convertir en tâche</button>
      </div>
      <div class="content-draft" data-content-draft hidden></div>
    </div>
  `;
}

function contentAngles(opportunity) {
  const base = opportunity?.title || "cette sélection";
  const topic = opportunity?.topic || "CoffeeBreakTCG";
  return {
    hook: `Tu collectionnes Pokémon? Voici pourquoi ${base.toLowerCase()} mérite ton attention aujourd’hui.`,
    reel15: `0-3s: plan serré sur l’item. 3-9s: montre le détail qui crée la valeur. 9-13s: explique pourquoi maintenant. 13-15s: CTA clair vers CoffeeBreakTCG.com ou DM.`,
    reel30: `0-4s: hook visuel. 4-12s: contexte rapide sur ${topic}. 12-22s: montre 2-3 plans de détails. 22-27s: lien business: vente, collection ou confiance. 27-30s: CTA vers le site ou message privé.`,
    caption: `Powered by coffee and cardboard. ${base}. On bâtit CoffeeBreakTCG autour des belles collections, des échanges honnêtes et des cartes bien protégées. Écris-nous pour réserver, vendre une collection ou voir plus de photos.`,
    story: `Slide 1: ${base}. Slide 2: pourquoi c’est intéressant maintenant. Slide 3: “DM pour réserver / proposer une collection / poser une question”.`,
    shotList: `Plan 1: reveal lent. Plan 2: détail de la carte ou du produit. Plan 3: texture/protection. Plan 4: plan main + logo CoffeeBreak. Plan 5: CTA final.`,
    cta: `Découvre les items sur CoffeeBreakTCG.com ou écris-nous si tu veux vendre une collection.`,
    premium: `Ton calme, précis, collectionneur sérieux: insiste sur l’état, la rareté, la protection et la confiance.`,
    funny: `Ton plus léger: “on a dit qu’on arrêtait d’acheter des belles cartes... ça a duré 12 minutes.”`,
    educational: `Explique simplement ce qui rend l’item intéressant: set, condition, demande, grading, protection ou potentiel collectionneur.`,
  };
}

function contentDraft(opportunity, channel) {
  const labels = {
    reel: "Reel",
    post: "Post",
    story: "Story",
    hook: "Hook",
    reel15: "Script Reel 15 secondes",
    reel30: "Script Reel 30 secondes",
    caption: "Caption Instagram",
    story3: "Story en 3 slides",
    shotList: "Shot list",
    cta: "CTA vers le site",
    premium: "Variante premium",
    funny: "Variante drôle",
    educational: "Variante éducative",
  };
  const angles = contentAngles(opportunity);
  const body =
    {
      reel: angles.reel15,
      post: angles.caption,
      story: angles.story,
      hook: angles.hook,
      reel15: angles.reel15,
      reel30: angles.reel30,
      caption: angles.caption,
      story3: angles.story,
      shotList: angles.shotList,
      cta: angles.cta,
      premium: angles.premium,
      funny: angles.funny,
      educational: angles.educational,
    }[channel] || angles.reel15;
  return `
    <strong>Brouillon ${labels[channel] || "contenu"}</strong>
    <p>${escapeHtml(body)}</p>
    <p><strong>Objectif business:</strong> vendre, attirer des collectionneurs, trouver des collections, développer la communauté ou augmenter la confiance.</p>
  `;
}

function renderContentStudio(opportunity) {
  const node = document.querySelector("[data-content-studio]");
  if (!node) return;
  if (!opportunity) {
    node.hidden = true;
    node.innerHTML = "";
    return;
  }
  activeStudioOpportunity = opportunity;
  node.hidden = false;
  node.innerHTML = `
    <div class="studio-head">
      <div>
        <p class="eyebrow">Studio Contenu</p>
        <h3>${escapeHtml(opportunity.title)}</h3>
        <p>${escapeHtml(opportunity.whyNow || "")}</p>
      </div>
      ${opportunityScorePill(opportunity)}
    </div>
    <div class="opportunity-meta">
      <span>Temps: ${escapeHtml(opportunity.timeRequired || "")}</span>
      <span>Impact: ${escapeHtml(opportunity.impactExpected || "")}</span>
      <span>Confiance: ${escapeHtml(opportunity.confidence || "Prudent")}</span>
    </div>
    <div class="studio-objectives">
      <span>Vendre</span>
      <span>Attirer des collectionneurs</span>
      <span>Trouver des collections</span>
      <span>Communauté</span>
      <span>Confiance</span>
    </div>
    <div class="studio-actions">
      <button type="button" data-studio-generate="hook">Hook</button>
      <button type="button" data-studio-generate="reel15">Script Reel 15s</button>
      <button type="button" data-studio-generate="reel30">Script Reel 30s</button>
      <button type="button" data-studio-generate="caption">Caption Instagram</button>
      <button type="button" data-studio-generate="story3">Story 3 slides</button>
      <button type="button" data-studio-generate="shotList">Shot list</button>
      <button type="button" data-studio-generate="cta">CTA site</button>
      <button type="button" data-studio-generate="premium">Variante premium</button>
      <button type="button" data-studio-generate="funny">Variante drôle</button>
      <button type="button" data-studio-generate="educational">Variante éducative</button>
    </div>
    <div class="studio-conversation" data-studio-conversation>
      <div class="studio-message jarvis">
        <strong>Jarvis</strong>
        <p>On garde le contenu relié à la croissance CoffeeBreak. Ma recommandation: produire le format ${escapeHtml(
          opportunity.format || "Instagram"
        )} parce que l’opportunité business est la plus claire maintenant.</p>
      </div>
    </div>
    <div class="content-actions">
      <button type="button" data-content-task data-opportunity-id="${escapeHtml(opportunity.id)}">Convertir en tâche</button>
      <button type="button" class="ghost-dark" data-content-studio-close>Fermer le Studio</button>
    </div>
  `;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

function groupEmails(emails) {
  const groups = new Map();
  for (const email of emails || []) {
    const key = email.category || "Important";
    const group = groups.get(key) || { category: key, score: 0, items: [], actions: new Set() };
    group.items.push(email);
    group.score = Math.max(group.score, Number(email.score || 0));
    if (email.action) group.actions.add(email.action);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.score - a.score);
}

function renderBriefing(payload) {
  const { briefing, counts, emails, calendar, priorities, contentOpportunities, inventoryIntelligence, growth, integrations, ticker } = payload;
  currentContentOpportunities = contentOpportunities || [];
  const decisions = briefing.decisionMatrix?.all || [];
  renderTodaySummary(counts || {}, (emails.important || []).filter((email) => email.category === "Card Shows").length || (payload.cardShows || []).length);
  renderTicker(ticker || []);
  renderJarvisSpeech(payload, decisions);
  renderLivingBoard(payload, decisions);
  renderActionCard("now", decisions[0], "Faire maintenant");
  renderActionCard("next", decisions[1], "Ensuite");
  renderActionCard("later", decisions[2], "Après");

  renderGmailState(integrations);
  renderList(
    document.querySelector("[data-email-list]"),
    groupEmails(emails.important),
    (group) => `
      <div class="email-item email-group">
        <div class="item-title-row">
          <strong>${escapeHtml(group.category)}</strong>
          ${scorePill(group.score)}
        </div>
        <p>${group.items.length} email${group.items.length > 1 ? "s" : ""} relié${group.items.length > 1 ? "s" : ""}.</p>
        <ul class="group-list">
          ${group.items
            .slice(0, 4)
            .map((item) => `<li>${escapeHtml(item.subject || "(Sans sujet)")}</li>`)
            .join("")}
        </ul>
        <p><strong>Action:</strong> ${escapeHtml([...group.actions][0] || "Décider quoi faire avec ce groupe.")}</p>
        <div class="pill-row">
          ${pill(group.category)}
          ${pill(`${group.items.length} emails`)}
        </div>
      </div>
    `,
    "Aucun email critique importé. Branche Gmail pour activer le tri automatique."
  );

  renderCalendarState(integrations);
  renderList(
    document.querySelector("[data-event-list]"),
    calendar.week,
    (event) => `
      <div class="compact-item">
        <strong>${shortDate(event.start)}${event.startTime ? ` · ${event.startTime}` : ""} - ${event.title}</strong>
        <p>${event.action || event.location || event.type || "Événement"}</p>
        <div class="pill-row">
          ${pill(event.colorLabel || event.category || event.type || "Calendrier", event.colorType || "")}
          ${pill(event.priority || "Important", event.priority === "Critique" ? "critical" : event.priority === "Important" ? "important" : "")}
          ${event.calendarSource ? pill(event.calendarSource) : ""}
        </div>
      </div>
    `,
    "Aucun événement importé pour cette semaine."
  );

  renderList(
    document.querySelector("[data-priority-list]"),
    priorities,
    (priority) => `
      <div class="focus-item">
        <div class="item-title-row">
          <strong>${priority.title}</strong>
          ${scorePill(priority.score)}
        </div>
        <p>${priority.reason}</p>
      </div>
    `,
    "Aucune priorité configurée."
  );
  renderList(
    document.querySelector("[data-content-opportunities]"),
    currentContentOpportunities,
    (opportunity) => renderOpportunityBlock(opportunity),
    "Aucune opportunité contenu calculée pour l’instant."
  );
  renderInventoryIntelligence(inventoryIntelligence || {});
  renderGrowthScore(growth, priorities);
}

function renderRecommendationList(items) {
  if (!items?.length) return `<p class="empty">Rien à signaler.</p>`;
  return items
    .map(
      (item) => `
        <div class="intel-item">
          <strong>${escapeHtml(item.title || item.name || "Signal")}</strong>
          <p>${escapeHtml(item.reason || "Pourquoi Max devrait s’en soucier: signal à examiner.")}</p>
          <div class="opportunity-meta">
            <span>Impact: ${escapeHtml(item.impact || "À confirmer")}</span>
            <span>Effort: ${escapeHtml(item.effort || "À confirmer")}</span>
            <span>Délai: ${escapeHtml(item.delay || "À confirmer")}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function renderInventoryIntelligence(intel) {
  const node = document.querySelector("[data-inventory-intelligence]");
  if (!node) return;
  node.innerHTML = `
    <div class="intel-summary">
      <div><span>Inventaire</span><strong>${Number(intel.summary?.inventoryCount || 0)}</strong></div>
      <div><span>Dormant</span><strong>${Number(intel.summary?.dormantCount || 0)}</strong></div>
      <div><span>Valeur dormante</span><strong>${money(intel.summary?.totalDormantValue || 0)}</strong></div>
    </div>
    <div class="intel-grid">
      <section><h3>Top vendeurs</h3>${renderRecommendationList(intel.topSellers)}</section>
      <section><h3>Inventaire dormant</h3>${renderRecommendationList(intel.dormantInventory)}</section>
      <section><h3>Alertes de liquidité</h3>${renderRecommendationList(intel.liquidityAlerts)}</section>
      <section><h3>Bundles</h3>${renderRecommendationList(intel.bundleOpportunities)}</section>
      <section><h3>Trades</h3>${renderRecommendationList(intel.tradeOpportunities)}</section>
      <section><h3>Contenu basé sur l’inventaire</h3>${renderRecommendationList(intel.contentRecommendations)}</section>
    </div>
  `;
}

function renderEmailReviewList(payload) {
  const list = document.querySelector("[data-email-review-list]");
  const counter = document.querySelector("[data-feedback-count]");
  if (counter) {
    const count = Number(payload.feedbackCount || 0);
    counter.textContent = `${count} correction${count > 1 ? "s" : ""} sauvegardée${count > 1 ? "s" : ""}`;
  }
  renderList(
    list,
    payload.emails || [],
    (item) => `
      <form class="email-review-item" data-email-review-item data-email-id="${escapeHtml(item.id)}">
        <div class="review-email-head">
          <div>
            <strong>${escapeHtml(item.subject || "(Sans sujet)")}</strong>
            <p>${escapeHtml(item.from || item.account || "")}</p>
          </div>
          <div class="review-meta">
            ${scorePill(item.score)}
            ${item.learnedFromMax ? pill("Corrigé par Max", "coffee") : ""}
          </div>
        </div>
        <p class="review-summary">${escapeHtml(item.summary || item.snippet || "Aucun résumé disponible.")}</p>
        <div class="pill-row">
          ${pill(item.category || "Important", item.categoryType || "")}
          ${pill(item.priority || "Important", item.priority === "Critique" ? "critical" : item.priority === "Important" ? "important" : "")}
          ${pill(item.status || "nouveau")}
          ${item.source ? pill(item.source) : ""}
        </div>
        <div class="review-form-grid">
          <label>
            Catégorie correcte
            <select name="category">${optionList(emailCategories, item.category || "Important")}</select>
          </label>
          <label>
            Priorité correcte
            <select name="priority">${optionList(emailPriorities, item.priority || "Important")}</select>
          </label>
          <label class="wide-field">
            Action correcte
            <input name="action" value="${escapeHtml(item.action || "")}" />
          </label>
          <label>
            Réponse suggérée
            <select name="replyVerdict">${optionList(replyVerdicts, item.feedbackVerdict || "correcte")}</select>
          </label>
          <label class="wide-field">
            Texte de réponse suggérée
            <textarea name="suggestedReply" rows="3">${escapeHtml(item.suggestedReply || "")}</textarea>
          </label>
        </div>
        <div class="email-actions review-actions">
          <button type="button" data-save-email-feedback>Sauvegarder la correction</button>
          <button type="button" class="ghost-dark" data-email-status="à suivre" data-email-id="${escapeHtml(item.id)}">À suivre</button>
          <button type="button" class="ghost-dark" data-email-status="traité" data-email-id="${escapeHtml(item.id)}">Traité</button>
          <button type="button" class="ghost-dark" data-email-status="ignoré" data-email-id="${escapeHtml(item.id)}">Ignorer</button>
        </div>
      </form>
    `,
    "Aucun email à valider pour ce filtre. Importe Gmail pour nourrir Jarvis."
  );
}

async function loadEmailReview(filter = currentEmailFilter) {
  currentEmailFilter = filter;
  const payload = await api(`/api/jarvis/emails?filter=${encodeURIComponent(filter)}`);
  renderEmailReviewList(payload);
}

function diagnosticValue(label, value, status = "") {
  return `
    <div class="diagnostic-item ${status}">
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderDiagnostic(payload) {
  const grid = document.querySelector("[data-diagnostic-grid]");
  const errors = document.querySelector("[data-diagnostic-errors]");
  if (!grid || !errors) return;
  grid.innerHTML = [
    diagnosticValue("Gmail business", payload.connections?.gmailBusiness ? "Oui" : "Non", payload.connections?.gmailBusiness ? "ok" : "warn"),
    diagnosticValue("Gmail personnel", payload.connections?.gmailPersonal ? "Oui" : "Non", payload.connections?.gmailPersonal ? "ok" : "warn"),
    diagnosticValue("Calendar", payload.connections?.calendar ? "Oui" : "Non", payload.connections?.calendar ? "ok" : "warn"),
    diagnosticValue("Emails importés", String(payload.counts?.emailsImported || 0)),
    diagnosticValue("Événements importés", String(payload.counts?.eventsImported || 0)),
    diagnosticValue("Feedback sauvegardé", String(payload.counts?.feedbackSaved || 0)),
    diagnosticValue("Dernier import réussi", shortDateTime(payload.imports?.lastSuccessfulImportAt)),
    diagnosticValue("System prompt + IA", payload.configured?.openai ? "OpenAI actif" : "Moteur local", payload.configured?.openai ? "ok" : "warn"),
  ].join("");
  const activeErrors = payload.errors || [];
  errors.innerHTML = activeErrors.length
    ? `
      <h3>Erreurs OAuth / API</h3>
      <div class="diagnostic-error-list">
        ${activeErrors
          .map(
            (error) => `
              <div class="diagnostic-error">
                <strong>${escapeHtml(error.service || "service")}</strong>
                <p>${escapeHtml(error.message || "Erreur inconnue")}</p>
                <span>${escapeHtml(error.context || "")} · ${shortDateTime(error.at)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `
    : `<p class="empty">Aucune erreur OAuth/API enregistrée.</p>`;
}

async function loadDiagnostic() {
  const payload = await api("/api/jarvis/diagnostic");
  renderDiagnostic(payload);
}

function renderTestBriefing(payload) {
  const output = document.querySelector("[data-test-briefing-output]");
  const test = payload.test || {};
  const focus = payload.briefing?.briefing?.focus || {};
  output.hidden = false;
  output.innerHTML = `
    <h3>Briefing test</h3>
    <div class="test-focus">
      <span>Prochaine action concrète</span>
      <strong>${escapeHtml(test.nextAction || focus.nextAction || "Aucune action générée.")}</strong>
      ${focus.reason ? `<p>${escapeHtml(focus.reason)}</p>` : ""}
    </div>
    <div class="test-columns">
      <div>
        <h4>Urgent</h4>
        ${renderDecisionPreview(test.urgent || [])}
      </div>
      <div>
        <h4>Important</h4>
        ${renderDecisionPreview(test.important || [])}
      </div>
      <div>
        <h4>Peut attendre</h4>
        ${renderDecisionPreview(test.waiting || [])}
      </div>
    </div>
  `;
}

function renderTestResult(title, payload, ok = true) {
  const node = document.querySelector("[data-test-results]");
  if (!node) return;
  const details = payload?.results
    ? payload.results.map((result) => `${result.source}: ${result.message || (result.ok ? "OK" : "Erreur")}`).join(" · ")
    : payload?.calendars
      ? `${payload.message || "OK"} ${payload.calendars.length ? `Calendriers: ${payload.calendars.join(", ")}` : ""}`
      : payload?.message || payload?.error || "Test terminé.";
  node.innerHTML = `
    <div class="test-result ${ok ? "ok" : "warn"}">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(details)}</p>
    </div>
  `;
}

function renderDecisionPreview(items) {
  if (!items.length) return `<p class="empty">Rien ici.</p>`;
  return items
    .slice(0, 4)
    .map(
      (item) => `
        <div class="test-decision">
          <strong>${escapeHtml(item.title || "")}</strong>
          <p>${escapeHtml(item.action || item.detail || "")}</p>
          <div class="pill-row">${pill(item.priority || "Important")} ${scorePill(item.score)}</div>
        </div>
      `
    )
    .join("");
}

async function loadJarvis() {
  const payload = await api("/api/jarvis/briefing");
  renderBriefing(payload);
  await loadEmailReview().catch(() => {});
  await loadDiagnostic().catch(() => {});
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (warnIfOpenedAsFile()) return;
  loginMessage.textContent = "";
  const form = new FormData(loginForm);
  try {
    const payload = await api("/api/jarvis/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setSessionView(payload.user);
    await loadJarvis();
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

document.querySelector("[data-refresh]").addEventListener("click", () => {
  loadJarvis().catch((error) => {
    const alert = document.querySelector("[data-oauth-alert]");
    if (!alert) return;
    alert.hidden = false;
    alert.classList.remove("ok");
    alert.textContent = error.message;
  });
});

document.addEventListener("click", async (event) => {
  const connectButton = event.target.closest("[data-connect-gmail]");
  const connectCalendarButton = event.target.closest("[data-connect-calendar]");
  const syncButton = event.target.closest("[data-sync-gmail]");
  const syncCalendarButton = event.target.closest("[data-sync-calendar]");
  const emailStatusButton = event.target.closest("[data-email-status]");
  const emailFilterButton = event.target.closest("[data-email-filter]");
  const saveFeedbackButton = event.target.closest("[data-save-email-feedback]");
  const testBriefingButton = event.target.closest("[data-test-briefing]");
  const testOpenAiButton = event.target.closest("[data-test-openai]");
  const testGmailButton = event.target.closest("[data-test-gmail]");
  const testCalendarButton = event.target.closest("[data-test-calendar]");
  const reimportAllButton = event.target.closest("[data-reimport-all]");
  const completeActionButton = event.target.closest("[data-complete-action]");
  const contentGenerateButton = event.target.closest("[data-content-generate]");
  const contentDevelopButton = event.target.closest("[data-content-develop]");
  const contentTaskButton = event.target.closest("[data-content-task]");
  const studioGenerateButton = event.target.closest("[data-studio-generate]");
  const studioCloseButton = event.target.closest("[data-content-studio-close]");

  if (completeActionButton) {
    const done = completedActions();
    done.add(completeActionButton.dataset.completeAction);
    localStorage.setItem("jarvis_completed_actions", JSON.stringify([...done]));
    completeActionButton.closest("[data-action-card]")?.classList.add("is-complete");
    completeActionButton.textContent = "Terminé";
    return;
  }

  if (contentGenerateButton) {
    const opportunity = currentContentOpportunities.find((item) => item.id === contentGenerateButton.dataset.opportunityId);
    const card = contentGenerateButton.closest("[data-content-opportunity-id]");
    const draft = card?.querySelector("[data-content-draft]");
    if (!opportunity || !draft) return;
    draft.hidden = false;
    draft.innerHTML = contentDraft(opportunity, contentGenerateButton.dataset.contentGenerate);
    return;
  }

  if (contentDevelopButton) {
    const opportunity = currentContentOpportunities.find((item) => item.id === contentDevelopButton.dataset.opportunityId);
    renderContentStudio(opportunity);
    return;
  }

  if (studioCloseButton) {
    renderContentStudio(null);
    return;
  }

  if (studioGenerateButton) {
    if (!activeStudioOpportunity) return;
    const conversation = document.querySelector("[data-studio-conversation]");
    if (!conversation) return;
    conversation.insertAdjacentHTML(
      "beforeend",
      `<div class="studio-message jarvis">${contentDraft(activeStudioOpportunity, studioGenerateButton.dataset.studioGenerate)}</div>`
    );
    conversation.scrollIntoView({ behavior: "smooth", block: "end" });
    return;
  }

  if (contentTaskButton) {
    const opportunity =
      currentContentOpportunities.find((item) => item.id === contentTaskButton.dataset.opportunityId) || activeStudioOpportunity;
    if (!opportunity) return;
    contentTaskButton.disabled = true;
    contentTaskButton.textContent = "Création...";
    const previousConversationHtml = document.querySelector("[data-studio-conversation]")?.innerHTML || "";
    try {
      const payload = await api("/api/jarvis/content-task", {
        method: "POST",
        body: JSON.stringify({
          opportunity,
          title: opportunity.title,
          timeRequired: opportunity.timeRequired || "15 minutes",
          impact: opportunity.impactExpected || "visibilité + confiance",
        }),
      });
      renderBriefing(payload.briefing);
      renderContentStudio(payload.task.opportunity || opportunity);
      const conversation = document.querySelector("[data-studio-conversation]");
      if (conversation && previousConversationHtml) conversation.innerHTML = previousConversationHtml;
      conversation?.insertAdjacentHTML(
        "beforeend",
        `<div class="studio-message system"><strong>Tâche créée</strong><p>${escapeHtml(payload.task.title)} · ${escapeHtml(
          payload.task.timeRequired
        )} · ${escapeHtml(payload.task.impact)}</p></div>`
      );
    } catch (error) {
      const draft = contentTaskButton.closest("[data-content-opportunity-id]")?.querySelector("[data-content-draft]");
      if (draft) {
        draft.hidden = false;
        draft.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
      }
    } finally {
      contentTaskButton.disabled = false;
      contentTaskButton.textContent = "Convertir en tâche";
    }
    return;
  }

  if (emailFilterButton) {
    document.querySelectorAll("[data-email-filter]").forEach((button) => {
      button.classList.toggle("active", button === emailFilterButton);
    });
    await loadEmailReview(emailFilterButton.dataset.emailFilter).catch((error) => {
      document.querySelector("[data-email-review-list]").innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
    });
    return;
  }

  if (connectButton) {
    const source = connectButton.dataset.connectGmail;
    connectButton.disabled = true;
    try {
      const payload = await api(`/api/jarvis/gmail/auth?source=${encodeURIComponent(source)}`);
      window.location.href = payload.url;
    } catch (error) {
      document.querySelector("[data-gmail-state]").innerHTML = `<p>${error.message}</p>`;
      connectButton.disabled = false;
    }
  }

  if (connectCalendarButton) {
    connectCalendarButton.disabled = true;
    try {
      const payload = await api("/api/jarvis/calendar/auth");
      window.location.href = payload.url;
    } catch (error) {
      document.querySelector("[data-calendar-state]").innerHTML = `<p>${escapeHtml(error.message)}</p>`;
      connectCalendarButton.disabled = false;
    }
  }

  if (syncButton) {
    syncButton.disabled = true;
    syncButton.textContent = "Import en cours...";
    try {
      await api("/api/jarvis/gmail/sync", { method: "POST", body: JSON.stringify({ source: "all", maxResults: 15 }) });
      await loadJarvis();
    } catch (error) {
      document.querySelector("[data-gmail-state]").innerHTML = `<p>${error.message}</p>`;
    } finally {
      syncButton.disabled = false;
      syncButton.textContent = "Importer les emails récents";
    }
  }

  if (syncCalendarButton) {
    syncCalendarButton.disabled = true;
    syncCalendarButton.textContent = "Import en cours...";
    try {
      const payload = await api("/api/jarvis/calendar/sync", { method: "POST", body: "{}" });
      renderBriefing(payload.briefing);
      await loadDiagnostic().catch(() => {});
    } catch (error) {
      document.querySelector("[data-calendar-state]").innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    } finally {
      syncCalendarButton.disabled = false;
      syncCalendarButton.textContent = "Importer les 7 prochains jours";
    }
  }

  if (emailStatusButton) {
    emailStatusButton.disabled = true;
    try {
      const payload = await api("/api/jarvis/emails/status", {
        method: "POST",
        body: JSON.stringify({
          id: emailStatusButton.dataset.emailId,
          status: emailStatusButton.dataset.emailStatus,
        }),
      });
      renderBriefing(payload.briefing);
      await loadEmailReview().catch(() => {});
    } catch (error) {
      emailStatusButton.textContent = error.message;
    }
  }

  if (testBriefingButton) {
    testBriefingButton.disabled = true;
    testBriefingButton.textContent = "Génération...";
    try {
      const payload = await api("/api/jarvis/briefing-test", { method: "POST", body: "{}" });
      renderBriefing(payload.briefing);
      renderDiagnostic(payload.diagnostic);
      renderTestBriefing(payload);
    } catch (error) {
      document.querySelector("[data-test-briefing-output]").hidden = false;
      document.querySelector("[data-test-briefing-output]").innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
    } finally {
      testBriefingButton.disabled = false;
      testBriefingButton.textContent = "Générer briefing test";
    }
  }

  if (testOpenAiButton) {
    testOpenAiButton.disabled = true;
    testOpenAiButton.textContent = "Test...";
    try {
      const payload = await api("/api/jarvis/test-openai", { method: "POST", body: "{}" });
      renderTestResult("OpenAI", payload, true);
    } catch (error) {
      renderTestResult("OpenAI", { error: error.message }, false);
      await loadDiagnostic().catch(() => {});
    } finally {
      testOpenAiButton.disabled = false;
      testOpenAiButton.textContent = "Tester connexion OpenAI";
    }
  }

  if (testGmailButton) {
    testGmailButton.disabled = true;
    testGmailButton.textContent = "Test...";
    try {
      const payload = await api("/api/jarvis/test-gmail", { method: "POST", body: "{}" });
      renderTestResult("Gmail", payload, Boolean(payload.ok));
      renderDiagnostic(payload.diagnostic);
    } catch (error) {
      renderTestResult("Gmail", { error: error.message }, false);
      await loadDiagnostic().catch(() => {});
    } finally {
      testGmailButton.disabled = false;
      testGmailButton.textContent = "Tester Gmail";
    }
  }

  if (testCalendarButton) {
    testCalendarButton.disabled = true;
    testCalendarButton.textContent = "Test...";
    try {
      const payload = await api("/api/jarvis/test-calendar", { method: "POST", body: "{}" });
      renderTestResult("Google Calendar", payload, Boolean(payload.ok));
      renderDiagnostic(payload.diagnostic);
    } catch (error) {
      renderTestResult("Google Calendar", { error: error.message }, false);
      await loadDiagnostic().catch(() => {});
    } finally {
      testCalendarButton.disabled = false;
      testCalendarButton.textContent = "Tester Calendar";
    }
  }

  if (reimportAllButton) {
    reimportAllButton.disabled = true;
    reimportAllButton.textContent = "Réimport...";
    try {
      const payload = await api("/api/jarvis/reimport", { method: "POST", body: "{}" });
      renderBriefing(payload.briefing);
      renderDiagnostic(payload.diagnostic);
      await loadEmailReview().catch(() => {});
    } catch (error) {
      document.querySelector("[data-diagnostic-errors]").innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
    } finally {
      reimportAllButton.disabled = false;
      reimportAllButton.textContent = "Tout réimporter";
    }
  }

  if (saveFeedbackButton) {
    const form = saveFeedbackButton.closest("[data-email-review-item]");
    if (!form) return;
    saveFeedbackButton.disabled = true;
    saveFeedbackButton.textContent = "Sauvegarde...";
    const formData = new FormData(form);
    try {
      const payload = await api("/api/jarvis/emails/feedback", {
        method: "POST",
        body: JSON.stringify({
          id: form.dataset.emailId,
          category: formData.get("category"),
          priority: formData.get("priority"),
          action: formData.get("action"),
          suggestedReply: formData.get("suggestedReply"),
          replyVerdict: formData.get("replyVerdict"),
        }),
      });
      renderBriefing(payload.briefing);
      await loadEmailReview();
    } catch (error) {
      saveFeedbackButton.textContent = error.message;
    } finally {
      saveFeedbackButton.disabled = false;
      if (saveFeedbackButton.textContent === "Sauvegarde...") saveFeedbackButton.textContent = "Sauvegarder la correction";
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.closest("[data-email-review-item]")) event.preventDefault();
});

document.querySelector("[data-logout]").addEventListener("click", async () => {
  await api("/api/jarvis/logout", { method: "POST", body: "{}" }).catch(() => {});
  setSessionView(null);
});

cleanSensitiveUrlParams();
renderOAuthMessage();

if (!warnIfOpenedAsFile()) {
  api("/api/jarvis/me")
    .then(async ({ user }) => {
      setSessionView(user);
      if (user) await loadJarvis();
    })
    .catch(() => setSessionView(null));
}
