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
let speechTimer = null;
let currentActionDecisions = [];
let currentAllEmails = [];
let currentEmailQueue = [];
let currentFollowupEmails = [];
let gmailAutoSyncTimer = null;

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

function setThinkingLine(text) {
  const node = document.querySelector("[data-thinking-line]");
  if (node) node.textContent = text;
}

function setJarvisState(state) {
  document.body.dataset.jarvisState = state;
}

function prepareImmersiveReveal() {
  setJarvisState("thinking");
  document.body.classList.remove("jarvis-ready");
  document.querySelectorAll("[data-reveal]").forEach((node) => {
    node.classList.remove("is-visible");
    node.style.removeProperty("--reveal-delay");
  });
  document.querySelectorAll(".living-board article, .living-board .signal-chip").forEach((node) => {
    node.classList.remove("is-visible");
  });
}

function runImmersiveReveal() {
  const revealTargets = [
    document.querySelector("[data-ticker]"),
    document.querySelector(".spoken-briefing"),
    document.querySelector(".today-sidebar"),
    document.querySelector("[data-living-board]"),
    document.querySelector(".quiet-panels"),
  ].filter(Boolean);

  revealTargets.forEach((node, index) => {
    node.dataset.reveal = "";
    node.style.setProperty("--reveal-delay", `${280 + index * 420}ms`);
    requestAnimationFrame(() => node.classList.add("is-visible"));
  });

  document.querySelectorAll(".living-board article, .living-board .signal-chip").forEach((node, index) => {
    node.style.setProperty("--board-delay", `${1100 + index * 260}ms`);
    requestAnimationFrame(() => node.classList.add("is-visible"));
  });

  document.body.classList.add("jarvis-ready");
  setTimeout(() => {
    setThinkingLine("Briefing construit.");
    setJarvisState("idle");
  }, 1450);
}

function typeJarvisSpeech(text) {
  const node = document.querySelector("[data-jarvis-speech]");
  if (!node) return;
  setJarvisState("speaking");
  clearInterval(speechTimer);
  node.textContent = "";
  let index = 0;
  const fullText = String(text || "");
  speechTimer = setInterval(() => {
    index += 3;
    node.textContent = fullText.slice(0, index);
    if (index >= fullText.length) {
      clearInterval(speechTimer);
      setJarvisState("idle");
    }
  }, 18);
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

function timeOnly(value) {
  if (!value) return "jamais";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
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
  const latestSync = accounts
    .map((account) => account.lastSyncAt)
    .filter(Boolean)
    .sort()
    .reverse()[0];
  const syncLine = document.querySelector("[data-gmail-sync-line]");
  if (syncLine) syncLine.textContent = `Dernière synchro : ${timeOnly(latestSync)}`;
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

function emailIsHandled(email) {
  return ["traité", "ignoré"].includes(String(email.status || "").toLowerCase());
}

function emailIsFollowup(email) {
  return ["à suivre", "pending"].includes(String(email.status || "").toLowerCase());
}

function sortedEmailQueue(emails = []) {
  return emails
    .filter((email) => !emailIsHandled(email) && !emailIsFollowup(email))
    .filter((email) => ["Critique", "Important"].includes(email.priority) || Number(email.score || 0) >= 62)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || String(b.receivedAt || "").localeCompare(String(a.receivedAt || "")));
}

function emailTrustMode(email) {
  const existing = email?.trustMode;
  if (existing?.level) return existing;
  const category = String(email?.category || "");
  const priority = String(email?.priority || "");
  if (category === "Card Shows") return { level: 2, label: "Niveau 2", action: "Créer brouillon", reason: "Opportunité business: Max valide avant l’envoi." };
  if (["Questions clients", "Commandes", "Livraison"].includes(category)) {
    return { level: 2, label: "Niveau 2", action: "Créer brouillon", reason: "Réponse simple, validation humaine au début." };
  }
  if (["Emails de mon boss", "Personnel", "Registraire des entreprises", "Factures", "Fournisseurs importants"].includes(category) || priority === "Critique") {
    return { level: 1, label: "Niveau 1", action: "Suggérer seulement", reason: "Sujet sensible: Max garde le contrôle." };
  }
  if (["Faible", "Marketing", "Newsletters", "Promotions", "Spam"].includes(category)) {
    return { level: 3, label: "Niveau 3", action: "Ignorer / archiver seulement", reason: "Aucune réponse à envoyer pour ce type d’email." };
  }
  return { level: 1, label: "Niveau 1", action: "Suggérer seulement", reason: "Autonomie basse tant que Jarvis apprend." };
}

function emailCanReply(email) {
  return !["Faible", "Marketing", "Newsletters", "Promotions", "Spam"].includes(String(email?.category || ""));
}

function renderEmailFocus(emails = []) {
  const node = document.querySelector("[data-email-focus]");
  const followupNode = document.querySelector("[data-email-followup]");
  if (!node) return;
  currentEmailQueue = sortedEmailQueue(emails);
  currentFollowupEmails = emails.filter(emailIsFollowup).sort((a, b) => String(b.receivedAt || "").localeCompare(String(a.receivedAt || "")));
  const active = currentEmailQueue[0];
  if (!active) {
    node.innerHTML = `
      <div class="email-focus-empty">
        <p class="eyebrow">Email Focus</p>
        <h3>Boîte prioritaire vidée.</h3>
        <p>Jarvis peut maintenant revenir à la prochaine priorité: contenu, inventaire, ajout de cartes ou Card Shows.</p>
      </div>
    `;
  } else {
    const bullets = String(active.summary || active.snippet || "Aucun résumé disponible.")
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 3);
    const trust = emailTrustMode(active);
    const canReply = emailCanReply(active);
    const canDraft = canReply && Number(trust.level || 1) >= 2;
    const canSend = canReply && Number(trust.level || 1) >= 3;
    node.innerHTML = `
      <article class="email-focus-card" data-active-email-id="${escapeHtml(active.id)}">
        <div class="email-progress">Email 1 sur ${currentEmailQueue.length} importants</div>
        <div class="email-focus-top">
          <span class="email-priority">${escapeHtml(active.priority || "Important")}</span>
          <span class="email-trust">Confiance ${escapeHtml(trust.label || `Niveau ${trust.level || 1}`)} · ${escapeHtml(trust.action || "Suggérer seulement")}</span>
          <span>${escapeHtml(active.sourceLabel || active.source || "")}</span>
          <span>${shortDateTime(active.receivedAt)}</span>
        </div>
        <div class="email-trust-box">
          <strong>Mode Confiance</strong>
          <p>${escapeHtml(trust.reason || "Jarvis reste prudent pour ce type d’email.")}</p>
        </div>
        <h3>${escapeHtml(active.subject || "(Sans sujet)")}</h3>
        <p class="email-from">${escapeHtml(active.from || active.fromEmail || "")}</p>
        <div class="email-summary">
          <strong>Résumé</strong>
          <ul>${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Aucun résumé disponible.</li>"}</ul>
        </div>
        <div class="email-decision">
          <strong>Action recommandée</strong>
          <p>${escapeHtml(active.action || "Décider si une réponse est nécessaire.")}</p>
        </div>
        <label class="email-reply-box">
          Réponse préparée par Jarvis
          <textarea data-email-reply rows="5">${escapeHtml(active.suggestedReply || "")}</textarea>
        </label>
        <div class="email-main-actions">
          ${
            canDraft
              ? `<button type="button" data-email-draft="${escapeHtml(active.id)}">Créer brouillon Gmail</button>`
              : `<button type="button" disabled title="${escapeHtml(trust.reason || "")}">Brouillon désactivé</button>`
          }
          ${
            canSend
              ? `<button type="button" class="ghost-dark" data-email-confirm-open="${escapeHtml(active.id)}">Envoyer après confirmation</button>`
              : `<button type="button" class="ghost-dark" disabled>Envoi désactivé</button>`
          }
          <button type="button" class="ghost-dark" data-email-status="à suivre" data-email-id="${escapeHtml(active.id)}">Mettre en attente</button>
        </div>
        <div class="email-confirmation" data-email-confirmation hidden></div>
        <div class="email-rewrite-actions">
          ${["plus professionnel", "plus gentil", "plus direct", "plus ferme", "plus court", "plus chaleureux"]
            .map((tone) => `<button type="button" class="ghost-dark" data-email-rewrite="${escapeHtml(active.id)}" data-tone="${escapeHtml(tone)}">${escapeHtml(tone)}</button>`)
            .join("")}
        </div>
        <div class="email-secondary-actions">
          <button type="button" class="ghost-dark" data-email-original="${escapeHtml(active.id)}">Voir l’email original</button>
          <button type="button" class="ghost-dark" data-email-status="ignoré" data-email-id="${escapeHtml(active.id)}">Ignorer</button>
          <button type="button" class="ghost-dark" data-email-status="traité" data-email-id="${escapeHtml(active.id)}">Marquer traité</button>
          <button type="button" class="ghost-dark" data-email-task="${escapeHtml(active.id)}">Créer tâche</button>
          ${active.calendarSuggestion ? `<button type="button" class="ghost-dark" data-email-event="${escapeHtml(active.id)}">Créer événement</button>` : ""}
        </div>
        <div class="email-original" data-email-original-panel hidden></div>
      </article>
    `;
  }
  if (followupNode) {
    followupNode.innerHTML = currentFollowupEmails.length
      ? `
        <details>
          <summary>À suivre (${currentFollowupEmails.length})</summary>
          <div class="followup-list">
            ${currentFollowupEmails
              .slice(0, 8)
              .map((email) => `<div><strong>${escapeHtml(email.subject || "(Sans sujet)")}</strong><span>${escapeHtml(email.from || "")}</span></div>`)
              .join("")}
          </div>
        </details>
      `
      : "";
  }
}

async function loadEmailActionLog() {
  const node = document.querySelector("[data-email-treatment-log]");
  if (!node) return;
  const payload = await api("/api/jarvis/emails/actions");
  const actions = payload.actions || [];
  node.innerHTML = actions.length
    ? `
      <details>
        <summary>Journal des emails traités (${actions.length})</summary>
        <div class="email-log-list">
          ${actions
            .slice(0, 12)
            .map(
              (action) => `
                <div>
                  <strong>${escapeHtml(action.action || "action")}</strong>
                  <span>${escapeHtml(action.subject || "(Sans sujet)")}</span>
                  <small>${escapeHtml(action.from || "")} · ${shortDateTime(action.createdAt)}</small>
                  ${action.responseBody ? `<details><summary>Voir la réponse</summary><pre>${escapeHtml(action.responseBody)}</pre></details>` : ""}
                </div>
              `
            )
            .join("")}
        </div>
      </details>
    `
    : "";
}

async function loadEmailFocus() {
  const payload = await api("/api/jarvis/emails?filter=all");
  currentAllEmails = payload.emails || [];
  renderEmailFocus(payload.emails || []);
  await loadEmailActionLog().catch(() => {});
  return payload;
}

function showEmailSyncMessage(message, tone = "working") {
  const node = document.querySelector("[data-gmail-sync-line]");
  if (!node) return;
  node.dataset.syncTone = tone;
  node.textContent = message;
}

function restoreEmailToQueue(email, message) {
  if (!email) return;
  currentAllEmails = [email, ...currentAllEmails.filter((item) => item.id !== email.id)];
  renderEmailFocus(currentAllEmails);
  showEmailSyncMessage(message || "L’action n’a pas pu être complétée. Email remis dans la pile.", "error");
}

function optimisticEmailAdvance(id, message) {
  const email = currentAllEmails.find((item) => item.id === id);
  currentAllEmails = currentAllEmails.filter((item) => item.id !== id);
  renderEmailFocus(currentAllEmails);
  showEmailSyncMessage(message || "Action en cours...", "working");
  return email;
}

async function syncGmail({ silent = false } = {}) {
  const syncButton = document.querySelector("[data-sync-gmail]");
  if (syncButton && !silent) {
    syncButton.disabled = true;
    syncButton.textContent = "Synchro...";
  }
  try {
    await api("/api/jarvis/gmail/sync", { method: "POST", body: JSON.stringify({ source: "all", maxResults: 15 }) });
    await loadJarvis({ skipAutoSync: true });
    await loadEmailFocus().catch(() => {});
  } catch (error) {
    if (!silent) document.querySelector("[data-gmail-state]").innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  } finally {
    if (syncButton && !silent) {
      syncButton.disabled = false;
      syncButton.textContent = "Synchroniser maintenant";
    }
  }
}

function startGmailAutoSync() {
  clearInterval(gmailAutoSyncTimer);
  gmailAutoSyncTimer = setInterval(() => {
    syncGmail({ silent: true }).catch(() => {});
  }, 5 * 60 * 1000);
}

function renderGmailNotice(integrations) {
  const node = document.querySelector("[data-gmail-notice]");
  if (!node) return;
  const accounts = Object.values(integrations?.gmail?.accounts || {});
  const connected = accounts.some((account) => account.connected);
  node.hidden = connected;
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

function saveCompletedActions(done) {
  localStorage.setItem("jarvis_completed_actions", JSON.stringify([...done]));
}

function demoActionDecisions() {
  return [
    {
      type: "Demo",
      title: "Ajouter 10 cartes au site",
      detail: "La vitrine doit avoir du stock frais pour convertir.",
      score: 92,
      priority: "Critique",
      source: "Demo data reset",
      action: "Préparer un bloc de 25 minutes et publier 10 items.",
    },
    {
      type: "Demo",
      title: "Répondre au Card Show Laval",
      detail: "Une opportunité de présence locale peut créer ventes et contacts.",
      score: 78,
      priority: "Important",
      source: "Demo data reset",
      action: "Confirmer prix, dates, installation et nombre de tables.",
    },
    {
      type: "Demo",
      title: "Préparer une Story de sourcing",
      detail: "Attirer des collections à acheter augmente la marge future.",
      score: 68,
      priority: "Important",
      source: "Demo data reset",
      action: "Publier une Story simple: ce qu’on recherche cette semaine.",
    },
  ];
}

function visibleActionDecisions(decisions = currentActionDecisions) {
  const done = completedActions();
  const seen = new Set();
  return (decisions || []).filter((item) => {
    if (done.has(actionId(item))) return false;
    const key = String(item.title || "").trim().toLowerCase();
    if (key && seen.has(key)) return false;
    if (key) seen.add(key);
    return true;
  });
}

function renderCompletedActions(decisions = currentActionDecisions) {
  const node = document.querySelector("[data-completed-list]");
  const wrapper = document.querySelector("[data-completed-actions]");
  if (!node || !wrapper) return;
  const done = completedActions();
  const completed = (decisions || []).filter((item) => done.has(actionId(item))).slice(0, 6);
  wrapper.hidden = completed.length === 0;
  node.innerHTML = completed.length
    ? completed
        .map(
          (item) => `
            <div class="completed-item">
              <strong>${escapeHtml(item.title || "Action")}</strong>
              <span>${estimateMinutes(item)} min</span>
            </div>
          `
        )
        .join("")
    : "";
}

function renderTodaySidebar(decisions = currentActionDecisions) {
  const active = visibleActionDecisions(decisions);
  const title = document.querySelector(".today-sidebar .eyebrow");
  if (title) title.innerHTML = `Aujourd’hui <span>${Math.min(active.length, 3)}</span>`;
  renderActionCard("now", active[0], "Faire maintenant");
  renderActionCard("next", active[1], "Ensuite");
  renderActionCard("later", active[2], "Après");
  renderCompletedActions(decisions);
}

function updateBriefingAfterCompletion(nextAction) {
  setJarvisState("complete");
  setTimeout(() => setJarvisState("idle"), 1200);
  const summary = document.querySelector("[data-today-summary]");
  if (summary) {
    summary.innerHTML = nextAction
      ? `<div class="calm-briefing"><span>Prochaine priorité</span><strong>${escapeHtml(nextAction.title || "continuer le plan")}</strong><p>${escapeHtml(nextAction.action || "Passe à cette étape maintenant.")}</p></div>`
      : `<div class="calm-briefing"><span>Aujourd’hui</span><strong>Plan immédiat vidé</strong><p>Relance un briefing ou passe à une action de croissance.</p></div>`;
  }
  typeJarvisSpeech(
    nextAction
      ? `Action terminée. La prochaine priorité est: ${nextAction.title}. ${nextAction.action || "Passe à cette étape maintenant."}`
      : "Action terminée. Tu as vidé le plan immédiat. Je recommande maintenant de respirer, puis de relancer un briefing."
  );
}

function renderActionCard(slot, item, label) {
  const node = document.querySelector(`[data-action-card="${slot}"]`);
  if (!node) return;
  if (!item) {
    node.innerHTML = `
      <p class="action-label">${label}</p>
      <div class="action-title-row">
        <button type="button" class="task-check" disabled aria-label="Aucune tâche"></button>
        <h2>Rien à traiter.</h2>
      </div>
      <p class="action-muted">Jarvis ne voit pas d’action prioritaire.</p>
    `;
    node.classList.add("is-empty");
    return;
  }
  const id = actionId(item);
  const isDone = completedActions().has(id);
  node.classList.toggle("is-complete", isDone);
  node.classList.remove("is-empty");
  node.innerHTML = `
    <details class="task-details">
      <summary>
        <button type="button" class="task-check" data-complete-action="${escapeHtml(id)}" aria-label="Terminer"></button>
        <span class="task-title">${escapeHtml(item.title || "Action sans titre")}</span>
        <span class="task-time">${estimateMinutes(item)} min</span>
      </summary>
      <p class="action-label">${label}</p>
      <dl>
        <div>
          <dt>Pourquoi</dt>
          <dd>${escapeHtml(whyFor(item))}</dd>
        </div>
        <div>
          <dt>Impact</dt>
          <dd>${escapeHtml(impactFor(item))}</dd>
        </div>
        <div>
          <dt>Comment faire</dt>
          <dd>${escapeHtml(item.action || "Faire la prochaine étape concrète, puis marquer terminé.")}</dd>
        </div>
      </dl>
      <div class="task-actions">
        <button type="button" data-complete-action="${escapeHtml(id)}">Terminé</button>
        <button type="button" class="ghost-dark" data-action-pending="${escapeHtml(id)}">Mettre en attente</button>
      </div>
    </details>
  `;
}

function shortTaskLabel(count, singular, plural = `${singular}s`) {
  if (!count) return "";
  return `${count} ${count > 1 ? plural : singular}`;
}

function renderTodaySummary(counts, cardShowsCount, focus) {
  const items = [
    shortTaskLabel(counts.ordersToShip || 0, "commande", "commandes"),
    shortTaskLabel(counts.invoices || 0, "facture", "factures"),
    shortTaskLabel(cardShowsCount || 0, "opportunité", "opportunités"),
  ].filter(Boolean);
  document.querySelector("[data-today-summary]").innerHTML = items.length
    ? `
      <div class="calm-briefing">
        <span>Aujourd’hui</span>
        <p class="brief-counts">${items.map(escapeHtml).join(" · ")}</p>
        <small>Priorité actuelle</small>
        <strong>${escapeHtml(focus?.title || "Avancer CoffeeBreak")}</strong>
        <p>${escapeHtml(focus?.action || "Traiter la prochaine action concrète.")}</p>
      </div>
    `
    : `
      <div class="calm-briefing">
        <span>Aujourd’hui</span>
        <p class="brief-counts">Calme opérationnel</p>
        <small>Priorité actuelle</small>
        <strong>${escapeHtml(focus?.title || "Action de croissance")}</strong>
        <p>${escapeHtml(focus?.action || "Avancer CoffeeBreak sans urgence administrative.")}</p>
      </div>
    `;
  const adminMinutes = Math.max(0, (counts.ordersToShip || 0) * 4 + (counts.invoices || 0) * 2 + Math.min(cardShowsCount || 0, 3) * 2);
  document.querySelector("[data-admin-time]").textContent = `${adminMinutes || 8} min`;
}

function renderTicker(ticker) {
  const node = document.querySelector("[data-ticker]");
  if (!node) return;
  const icons = ["↗", "□", "◇", "◷", "▱", "◌"];
  node.innerHTML = (ticker || [])
    .map((item, index) => `<div><em>${icons[index % icons.length]}</em><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
    .join("");
}

function renderJarvisSpeech(payload, decisions) {
  const counts = payload.counts || {};
  const focus = decisions?.[0];
  const after = decisions?.[1]?.title ? `Ensuite: ${decisions[1].title}.` : "Ensuite, avance une tâche de croissance.";
  typeJarvisSpeech(`${focus?.action || "Traite la priorité actuelle."} ${after}`);
}

function renderLivingBoard(payload, decisions) {
  const node = document.querySelector("[data-living-board]");
  if (!node) return;
  const emails = payload.emails?.important || [];
  const inventory = payload.inventoryIntelligence || {};
  const signals = [
    {
      label: "Email",
      title: emails[0]?.subject || "Aucun email critique",
      target: "Emails",
    },
    {
      label: "Inventaire",
      title: `${inventory.summary?.dormantCount || 0} item${inventory.summary?.dormantCount > 1 ? "s" : ""} dormant${inventory.summary?.dormantCount > 1 ? "s" : ""}`,
      target: "Inventaire & Produits",
    },
    {
      label: "Opportunité",
      title: payload.contentOpportunities?.[0]?.title || "Contenu à définir",
      target: "Marketing & Contenu",
    },
  ];
  node.innerHTML = signals
    .map(
      (signal, index) => `
        <button type="button" class="signal-chip" data-signal-target="${escapeHtml(signal.target)}" style="--i:${index}">
          <span>${escapeHtml(signal.label)}</span>
          <strong>${escapeHtml(signal.title)}</strong>
        </button>
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
  prepareImmersiveReveal();
  const { briefing, counts, emails, calendar, priorities, contentOpportunities, inventoryIntelligence, growth, integrations, ticker } = payload;
  currentContentOpportunities = contentOpportunities || [];
  const decisions = briefing.decisionMatrix?.all || [];
  currentActionDecisions = decisions;
  renderTicker(ticker || []);
  const visibleDecisions = visibleActionDecisions(decisions);
  renderTodaySummary(counts || {}, (emails.important || []).filter((email) => email.category === "Card Shows").length || (payload.cardShows || []).length, visibleDecisions[0]);
  renderJarvisSpeech(payload, visibleDecisions);
  renderLivingBoard(payload, visibleDecisions);
  renderTodaySidebar(decisions);

  renderGmailState(integrations);
  renderGmailNotice(integrations);
  renderEmailFocus(emails.important || []);

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
  runImmersiveReveal();
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

function gmailHasConnectedAccount(payload) {
  return Object.values(payload?.integrations?.gmail?.accounts || {}).some((account) => account.connected);
}

function gmailLastSyncMs(payload) {
  const latest = Object.values(payload?.integrations?.gmail?.accounts || {})
    .map((account) => account.lastSyncAt)
    .filter(Boolean)
    .sort()
    .reverse()[0];
  return latest ? new Date(latest).getTime() : 0;
}

async function loadJarvis({ skipAutoSync = false } = {}) {
  setThinkingLine("Jarvis analyse les signaux...");
  prepareImmersiveReveal();
  const payload = await api("/api/jarvis/briefing");
  renderBriefing(payload);
  await loadEmailReview().catch(() => {});
  await loadDiagnostic().catch(() => {});
  await loadEmailFocus().catch(() => {});
  if (!skipAutoSync && gmailHasConnectedAccount(payload) && Date.now() - gmailLastSyncMs(payload) > 60 * 1000) {
    syncGmail({ silent: true }).catch(() => {});
  }
  if (gmailHasConnectedAccount(payload)) startGmailAutoSync();
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

document.querySelector("[data-ask-jarvis-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const question = String(form.get("question") || "").trim();
  const response = document.querySelector("[data-ask-response]");
  if (!response) return;
  response.textContent = question
    ? "Reçu. Pour l’instant, Jarvis utilise ce poste de commande pour prioriser; la conversation complète sera branchée après la structure principale."
    : "";
  event.currentTarget.reset();
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
  const emailDraftButton = event.target.closest("[data-email-draft]");
  const emailConfirmOpenButton = event.target.closest("[data-email-confirm-open]");
  const emailConfirmSendButton = event.target.closest("[data-email-confirm-send]");
  const emailConfirmCancelButton = event.target.closest("[data-email-confirm-cancel]");
  const emailOriginalButton = event.target.closest("[data-email-original]");
  const emailRewriteButton = event.target.closest("[data-email-rewrite]");
  const emailTaskButton = event.target.closest("[data-email-task]");
  const emailEventButton = event.target.closest("[data-email-event]");
  const emailStatusButton = event.target.closest("[data-email-status]");
  const emailFilterButton = event.target.closest("[data-email-filter]");
  const saveFeedbackButton = event.target.closest("[data-save-email-feedback]");
  const testBriefingButton = event.target.closest("[data-test-briefing]");
  const testOpenAiButton = event.target.closest("[data-test-openai]");
  const testGmailButton = event.target.closest("[data-test-gmail]");
  const testCalendarButton = event.target.closest("[data-test-calendar]");
  const reimportAllButton = event.target.closest("[data-reimport-all]");
  const demoResetButton = event.target.closest("[data-demo-reset]");
  const completeActionButton = event.target.closest("[data-complete-action]");
  const actionPendingButton = event.target.closest("[data-action-pending]");
  const signalButton = event.target.closest("[data-signal-target]");
  const contentGenerateButton = event.target.closest("[data-content-generate]");
  const contentDevelopButton = event.target.closest("[data-content-develop]");
  const contentTaskButton = event.target.closest("[data-content-task]");
  const studioGenerateButton = event.target.closest("[data-studio-generate]");
  const studioCloseButton = event.target.closest("[data-content-studio-close]");

  if (completeActionButton) {
    event.preventDefault();
    event.stopPropagation();
    const done = completedActions();
    done.add(completeActionButton.dataset.completeAction);
    saveCompletedActions(done);
    renderTodaySidebar(currentActionDecisions);
    updateBriefingAfterCompletion(visibleActionDecisions(currentActionDecisions)[0]);
    return;
  }

  if (actionPendingButton) {
    event.preventDefault();
    event.stopPropagation();
    const done = completedActions();
    done.add(actionPendingButton.dataset.actionPending);
    saveCompletedActions(done);
    renderTodaySidebar(currentActionDecisions);
    updateBriefingAfterCompletion(visibleActionDecisions(currentActionDecisions)[0]);
    return;
  }

  if (demoResetButton) {
    currentActionDecisions = demoActionDecisions();
    saveCompletedActions(new Set());
    renderTodaySidebar(currentActionDecisions);
    updateBriefingAfterCompletion(visibleActionDecisions(currentActionDecisions)[0]);
    renderTestResult("Demo data reset", { message: "Trois tâches de test propres ont été chargées dans la sidebar AUJOURD’HUI." }, true);
    return;
  }

  if (signalButton) {
    const target = signalButton.dataset.signalTarget;
    const details = [...document.querySelectorAll(".quiet-panels details")].find(
      (item) => item.querySelector("summary")?.textContent?.trim() === target
    );
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    await syncGmail({ silent: false });
    return;
  }

  if (emailRewriteButton) {
    const card = emailRewriteButton.closest("[data-active-email-id]");
    const textarea = card?.querySelector("[data-email-reply]");
    emailRewriteButton.disabled = true;
    try {
      const payload = await api("/api/jarvis/emails/rewrite", {
        method: "POST",
        body: JSON.stringify({
          id: emailRewriteButton.dataset.emailRewrite,
          tone: emailRewriteButton.dataset.tone,
          body: textarea?.value || "",
        }),
      });
      if (textarea) textarea.value = payload.suggestedReply || "";
    } catch (error) {
      if (textarea) textarea.value = `${textarea.value}\n\n[Erreur Jarvis: ${error.message}]`;
    } finally {
      emailRewriteButton.disabled = false;
    }
    return;
  }

  if (emailOriginalButton) {
    const card = emailOriginalButton.closest("[data-active-email-id]");
    const panel = card?.querySelector("[data-email-original-panel]");
    if (!panel) return;
    emailOriginalButton.disabled = true;
    panel.hidden = false;
    panel.innerHTML = `<p class="empty">Chargement de l’email original...</p>`;
    try {
      const payload = await api(`/api/jarvis/emails/original?id=${encodeURIComponent(emailOriginalButton.dataset.emailOriginal)}`);
      const original = payload.email || {};
      panel.innerHTML = `
        <strong>Email original</strong>
        <div class="original-meta">
          <span>De: ${escapeHtml(original.from || "")}</span>
          <span>À: ${escapeHtml(original.to || "")}</span>
          <span>Date: ${escapeHtml(original.date || "")}</span>
        </div>
        <h4>${escapeHtml(original.subject || "(Sans sujet)")}</h4>
        <pre>${escapeHtml(original.body || original.snippet || "Aucun contenu texte lisible.")}</pre>
      `;
    } catch (error) {
      panel.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
    } finally {
      emailOriginalButton.disabled = false;
    }
    return;
  }

  if (emailConfirmOpenButton) {
    const card = emailConfirmOpenButton.closest("[data-active-email-id]");
    const textarea = card?.querySelector("[data-email-reply]");
    const confirmBox = card?.querySelector("[data-email-confirmation]");
    const active = currentEmailQueue.find((email) => email.id === emailConfirmOpenButton.dataset.emailConfirmOpen);
    if (!confirmBox || !active) return;
    confirmBox.hidden = false;
    confirmBox.innerHTML = `
      <p class="eyebrow">Confirmation obligatoire</p>
      <strong>Vérifie avant d’envoyer réellement</strong>
      <div class="confirm-meta">
        <span>Destinataire: ${escapeHtml(active.fromEmail || active.from || "")}</span>
        <span>Objet: ${escapeHtml(active.subject || "(Sans sujet)")}</span>
      </div>
      <pre>${escapeHtml(textarea?.value || "")}</pre>
      <div class="email-main-actions">
        <button type="button" data-email-confirm-send="${escapeHtml(active.id)}">Confirmer l’envoi</button>
        <button type="button" class="ghost-dark" data-email-confirm-cancel>Annuler</button>
      </div>
    `;
    confirmBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  if (emailConfirmCancelButton) {
    const confirmBox = emailConfirmCancelButton.closest("[data-email-confirmation]");
    if (confirmBox) {
      confirmBox.hidden = true;
      confirmBox.innerHTML = "";
    }
    return;
  }

  if (emailDraftButton || emailConfirmSendButton) {
    const button = emailDraftButton || emailConfirmSendButton;
    const card = button.closest("[data-active-email-id]");
    const textarea = card?.querySelector("[data-email-reply]");
    const isDraft = Boolean(emailDraftButton);
    const id = button.dataset.emailDraft || button.dataset.emailConfirmSend;
    const email = optimisticEmailAdvance(id, isDraft ? "Création du brouillon Gmail..." : "Envoi confirmé en cours...");
    button.disabled = true;
    button.textContent = isDraft ? "Création..." : "Envoi...";
    try {
      await api(isDraft ? "/api/jarvis/emails/draft" : "/api/jarvis/emails/send", {
        method: "POST",
        body: JSON.stringify({
          id,
          body: textarea?.value || "",
          confirm: !isDraft,
        }),
      });
      showEmailSyncMessage(isDraft ? "Brouillon Gmail créé." : "Email envoyé.", "ok");
      await loadJarvis({ skipAutoSync: true });
    } catch (error) {
      restoreEmailToQueue(email, `${isDraft ? "Brouillon impossible" : "Envoi impossible"}. ${error.message}`);
    } finally {
      button.disabled = false;
      button.textContent = isDraft ? "Créer brouillon Gmail" : "Confirmer l’envoi";
    }
    return;
  }

  if (emailTaskButton) {
    const email = optimisticEmailAdvance(emailTaskButton.dataset.emailTask, "Création de la tâche en arrière-plan...");
    emailTaskButton.disabled = true;
    try {
      await api("/api/jarvis/emails/task", { method: "POST", body: JSON.stringify({ id: emailTaskButton.dataset.emailTask }) });
      showEmailSyncMessage("Tâche créée.", "ok");
      await loadJarvis({ skipAutoSync: true });
    } catch (error) {
      restoreEmailToQueue(email, `L’action n’a pas pu être complétée. ${error.message}`);
    } finally {
      emailTaskButton.disabled = false;
    }
    return;
  }

  if (emailEventButton) {
    const email = optimisticEmailAdvance(emailEventButton.dataset.emailEvent, "Préparation de l’événement en arrière-plan...");
    emailEventButton.disabled = true;
    try {
      await api("/api/jarvis/emails/event", { method: "POST", body: JSON.stringify({ id: emailEventButton.dataset.emailEvent }) });
      showEmailSyncMessage("Événement à valider préparé.", "ok");
      await loadJarvis({ skipAutoSync: true });
    } catch (error) {
      restoreEmailToQueue(email, `L’action n’a pas pu être complétée. ${error.message}`);
    } finally {
      emailEventButton.disabled = false;
    }
    return;
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
    const id = emailStatusButton.dataset.emailId;
    const status = emailStatusButton.dataset.emailStatus;
    const email = optimisticEmailAdvance(id, status === "ignoré" ? "Email ignoré en arrière-plan..." : "Statut mis à jour en arrière-plan...");
    emailStatusButton.disabled = true;
    try {
      const payload = await api("/api/jarvis/emails/status", {
        method: "POST",
        body: JSON.stringify({
          id,
          status,
        }),
      });
      showEmailSyncMessage(status === "ignoré" ? "Email ignoré." : "Email mis à jour.", "ok");
      renderBriefing(payload.briefing);
      await loadEmailReview().catch(() => {});
      await loadEmailFocus().catch(() => {});
    } catch (error) {
      restoreEmailToQueue(email, `L’action n’a pas pu être complétée. ${error.message}`);
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
