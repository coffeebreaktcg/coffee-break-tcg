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

function renderList(container, items, renderer, emptyText) {
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

function renderBriefing(payload) {
  const { briefing, counts, emails, ordersToShip, calendar, priorities, growth, integrations } = payload;
  document.querySelector("[data-focus-title]").textContent = briefing.focus.title;
  document.querySelector("[data-focus-reason]").textContent = briefing.focus.reason;
  const nextAction = document.querySelector("[data-next-action]");
  nextAction.hidden = !briefing.focus.nextAction;
  nextAction.innerHTML = briefing.focus.nextAction ? `<strong>Prochaine action:</strong> ${briefing.focus.nextAction}` : "";
  const aiAnalysis = document.querySelector("[data-ai-analysis]");
  const analysis = briefing.aiAnalysis || {};
  const hasAnalysis = analysis.important || analysis.canWait || analysis.bottleneck;
  aiAnalysis.hidden = !hasAnalysis;
  aiAnalysis.innerHTML = hasAnalysis
    ? `
      ${analysis.important ? `<p><strong>Important:</strong> ${analysis.important}</p>` : ""}
      ${analysis.canWait ? `<p><strong>Peut attendre:</strong> ${analysis.canWait}</p>` : ""}
      ${analysis.bottleneck ? `<p><strong>Frein:</strong> ${analysis.bottleneck}</p>` : ""}
    `
    : "";
  document.querySelector("[data-briefing-time]").textContent = `Mis à jour ${new Date(briefing.generatedAt).toLocaleString("fr-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
  setCounts(counts);

  const renderDecision = (item) => `
    <div class="attention-item">
      <div class="item-title-row">
        <strong>${item.title}</strong>
        ${scorePill(item.score)}
      </div>
      <p>${item.detail}</p>
      <p><strong>Action:</strong> ${item.action}</p>
      <div class="pill-row">
        ${pill(item.priority, item.priority === "Critique" ? "critical" : item.priority === "Important" ? "important" : "")}
        ${pill(item.type)}
        ${item.source ? pill(item.source) : ""}
      </div>
    </div>
  `;

  renderList(
    document.querySelector("[data-urgent-list]"),
    briefing.decisionMatrix?.urgent || [],
    renderDecision,
    "Aucune urgence active."
  );

  renderList(
    document.querySelector("[data-important-list]"),
    briefing.decisionMatrix?.important || [],
    renderDecision,
    "Rien d’important en attente."
  );

  renderList(
    document.querySelector("[data-waiting-list]"),
    briefing.decisionMatrix?.waiting || [],
    renderDecision,
    "Rien à reporter."
  );

  renderGmailState(integrations);
  renderList(
    document.querySelector("[data-email-list]"),
    emails.important,
    (item) => `
      <div class="email-item">
        <div class="item-title-row">
          <strong>${item.subject}</strong>
          ${scorePill(item.score)}
        </div>
        <p>${item.summary}</p>
        <p><strong>Action recommandée:</strong> ${item.action}</p>
        <div class="pill-row">
          ${pill(item.category, item.categoryType)}
          ${pill(item.priority, item.priority === "Critique" ? "critical" : item.priority === "Important" ? "important" : "")}
          ${pill(item.status || "nouveau")}
          ${item.source ? pill(item.source) : ""}
          ${item.from ? pill(item.from) : ""}
        </div>
          ${item.calendarSuggestion ? `<p><strong>Calendrier:</strong> ${item.calendarSuggestion.action}</p>` : ""}
          ${item.suggestedReply ? `<p><strong>Réponse suggérée:</strong> ${item.suggestedReply}</p>` : ""}
        <div class="email-actions">
          <button type="button" data-email-status="à suivre" data-email-id="${item.id}">À suivre</button>
          <button type="button" data-email-status="traité" data-email-id="${item.id}">Traité</button>
          <button type="button" data-email-status="ignoré" data-email-id="${item.id}">Ignorer</button>
        </div>
      </div>
    `,
    "Aucun email critique importé. Branche Gmail pour activer le tri automatique."
  );

  renderList(
    document.querySelector("[data-order-list]"),
    ordersToShip,
    (order) => `
      <div class="compact-item">
        <strong>${order.id} - ${money(order.totalAmount)}</strong>
        <p>${order.customerName || "Client"} · ${order.itemsSummary}</p>
      </div>
    `,
    "Aucune commande payée à expédier."
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

  const growthItems = [
    ["Cartes ajoutées", growth.cardsAddedThisWeek],
    ["Publications Instagram", growth.instagramPostsThisWeek],
    ["Card Shows", growth.cardShowsThisWeek],
    ["Collections achetées", growth.collectionsBoughtThisWeek],
    ["Partenariats", growth.partnershipsThisWeek],
  ];
  document.querySelector("[data-growth-list]").innerHTML = growthItems
    .map(([label, value]) => `<div class="growth-item"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
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

async function loadJarvis() {
  const payload = await api("/api/jarvis/briefing");
  renderBriefing(payload);
  await loadEmailReview().catch(() => {});
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
    document.querySelector("[data-focus-reason]").textContent = error.message;
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

if (!warnIfOpenedAsFile()) {
  api("/api/jarvis/me")
    .then(async ({ user }) => {
      setSessionView(user);
      if (user) await loadJarvis();
    })
    .catch(() => setSessionView(null));
}
