const getBoot = () => document.getElementById("catalyst-boot");
const detail = document.getElementById("catalyst-boot-detail");
const errorBox = document.getElementById("catalyst-boot-error");
const title = document.getElementById("catalyst-boot-title");

const slowTimer = window.setTimeout(() => {
  if (getBoot() && detail) {
    detail.textContent =
      "Catalyst is still loading application modules. The workspace has not crashed.";
  }
}, 2500);

const showBootstrapError = (message: string) => {
  if (!getBoot()) return;
  window.clearTimeout(slowTimer);
  if (title) title.textContent = "Catalyst failed before the workspace mounted.";
  if (detail) {
    detail.textContent =
      "The startup error is shown below so the failure does not appear as a blank screen.";
  }
  if (errorBox) {
    errorBox.hidden = false;
    errorBox.textContent = message || "Unknown startup error";
  }
};

window.addEventListener("error", (event) => {
  if (!(event instanceof ErrorEvent)) return;
  const message =
    event.error?.stack ||
    `${event.message}\n${event.filename}:${event.lineno}:${event.colno}`;
  showBootstrapError(message);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  showBootstrapError(reason?.stack || reason?.message || String(reason));
});
