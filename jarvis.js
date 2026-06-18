const loginPanel = document.querySelector("[data-login-panel]");
const appPanel = document.querySelector("[data-app-panel]");
const loginForm = document.querySelector("[data-login-form]");
const loginMessage = document.querySelector("[data-login-message]");
const greeting = document.querySelector("[data-greeting]");

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

function setCounts(counts) {
  Object.entries(counts).forEach(([key, value]) => {
    const node = document.querySelector(`[data-count="${key}"]`);
    if (node) node.textContent = value;
  });
}

function renderBriefing(payload) {
  const { briefing, counts, emails, ordersToShip, calendar, priorities, integrations } = payload;
  document.querySelector("[data-focus-title]").textContent = briefing.focus.title;
  document.querySelector("[data-focus-reason]").textContent = briefing.focus.reason;
  document.querySelector("[data-briefing-time]").textContent = `Mis à jour ${new Date(briefing.generatedAt).toLocaleString("fr-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
  setCounts(counts);

  renderList(
    document.querySelector("[data-attention-list]"),
    briefing.attention,
    (item) => `
      <div class="attention-item">
        <strong>${item.title}</strong>
        <p>${item.detail}</p>
        <div class="pill-row">${pill(item.priority, item.priority === "Critique" ? "critical" : "important")}</div>
      </div>
    `,
    "Rien d’urgent pour l’instant."
  );

  document.querySelector("[data-gmail-state]").innerHTML = `<p>${integrations.gmail.message}</p>`;
  renderList(
    document.querySelector("[data-email-list]"),
    emails.important,
    (email) => `
      <div class="email-item">
        <strong>${email.subject}</strong>
        <p>${email.summary}</p>
        <div class="pill-row">
          ${pill(email.category, email.categoryType)}
          ${email.from ? pill(email.from) : ""}
        </div>
        ${email.suggestedReply ? `<p><strong>Réponse suggérée:</strong> ${email.suggestedReply}</p>` : ""}
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

  document.querySelector("[data-calendar-state]").innerHTML = `<p>${integrations.calendar.message}</p>`;
  renderList(
    document.querySelector("[data-event-list]"),
    calendar.week,
    (event) => `
      <div class="compact-item">
        <strong>${shortDate(event.start)} - ${event.title}</strong>
        <p>${event.location || event.type || "Événement"}</p>
        <div class="pill-row">${pill(event.colorLabel || event.type || "Calendrier", event.colorType || "")}</div>
      </div>
    `,
    "Aucun événement importé pour cette semaine."
  );

  renderList(
    document.querySelector("[data-priority-list]"),
    priorities,
    (priority) => `
      <div class="focus-item">
        <strong>${priority.title}</strong>
        <p>${priority.reason}</p>
      </div>
    `,
    "Aucune priorité configurée."
  );
}

async function loadJarvis() {
  const payload = await api("/api/jarvis/briefing");
  renderBriefing(payload);
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
