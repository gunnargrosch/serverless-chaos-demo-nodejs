/* global apiBase */

if (typeof apiBase === "undefined" || apiBase === "<your-api-url>") {
  document.querySelector("main").innerHTML =
    '<p style="text-align:center;color:var(--red);padding:2rem;">' +
    "Missing configuration &mdash; copy <code>env.js.template</code> to " +
    "<code>env.js</code> and set <code>apiBase</code> to your API URL.</p>";
  throw new Error("apiBase not configured");
}

const POLL_INTERVAL = 5000;

const functions = [
  { name: "wrapper", path: "/wrapper" },
  { name: "middy",   path: "/middy" },
  { name: "layer",   path: "/layer" },
];

async function poll(fn) {
  const timeEl   = document.getElementById(`time-${fn.name}`);
  const statusEl = document.getElementById(`status-${fn.name}`);
  const imgEl    = document.getElementById(`img-${fn.name}`);
  const indEl    = document.getElementById(`ind-${fn.name}`);
  const errorEl  = document.getElementById(`error-${fn.name}`);

  const start = performance.now();

  try {
    const res = await fetch(apiBase + fn.path);
    const duration = Math.round(performance.now() - start);

    timeEl.textContent = `${duration} ms`;
    statusEl.textContent = res.status;
    errorEl.textContent = "";

    if (res.ok) {
      const data = await res.json();
      if (data.itemUrl) {
        imgEl.src = data.itemUrl;
      }
      timeEl.className = "stat-value ok";
      statusEl.className = "stat-value ok";
      indEl.className = "indicator ok";
    } else {
      timeEl.className = "stat-value error";
      statusEl.className = "stat-value error";
      indEl.className = "indicator error";
      errorEl.textContent = `HTTP ${res.status}`;
    }
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    timeEl.textContent = `${duration} ms`;
    timeEl.className = "stat-value error";
    statusEl.textContent = "ERR";
    statusEl.className = "stat-value error";
    indEl.className = "indicator error";
    errorEl.textContent = err.message;
  }
}

functions.forEach((fn) => {
  poll(fn);
  setInterval(() => poll(fn), POLL_INTERVAL);
});
