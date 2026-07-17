(() => {
  "use strict";
  const DAMAGE_TARGET_PERCENT = 0.83;
  const STORAGE_KEY = "markdownPro.v1";
  const ids = ["wtdSales", "todayPlan", "damagePercent", "storeMarkdownPercent", "budgetPercent", "salesSlider"];
  const el = Object.fromEntries([...ids, "sliderValue", "forecastSales", "currentDamage", "damageTarget", "damageRemaining", "storeMarkdown", "budgetAmount", "budgetRemaining", "projectedPercent", "actionDamage", "actionBudget", "actionMessage", "action-heading", "budgetBadge", "budgetStatus", "damageLabel", "damageDetail", "budgetLabel", "budgetDetail", "damageTile", "budgetTile", "resetButton"].map(id => [id, document.getElementById(id)]));
  const currency = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 });
  const number = value => Number.parseFloat(String(value).replace(/[$,%\s,]/g, "")) || 0;
  const money = value => currency.format(value);
  const pct = value => `${value.toFixed(2)}%`;
  function read() { return Object.fromEntries(ids.map(id => [id, el[id].value])); }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(read())); }
  function load() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (saved) ids.forEach(id => { if (saved[id] !== undefined) el[id].value = saved[id]; }); } catch (_) { localStorage.removeItem(STORAGE_KEY); } }
  function setTile(tile, isNegative) { tile.classList.toggle("positive", !isNegative); tile.classList.toggle("negative", isNegative); }
  function sliderText(adjustment) { if (!adjustment) return "On plan"; return `${adjustment > 0 ? "+" : "âˆ’"}${money(Math.abs(adjustment))}`; }
  function calculate() {
    const wtd = number(el.wtdSales.value), plan = number(el.todayPlan.value), adjustment = number(el.salesSlider.value);
    const damageRate = number(el.damagePercent.value) / 100, storeRate = number(el.storeMarkdownPercent.value) / 100, budgetRate = number(el.budgetPercent.value) / 100;
    const forecastSales = Math.max(0, wtd + plan + adjustment);
    const currentDamage = wtd * damageRate;
    const damageTarget = forecastSales * (DAMAGE_TARGET_PERCENT / 100);
    const damageRoom = damageTarget - currentDamage;
    const currentStoreMarkdown = wtd * storeRate;
    const projectedStoreMarkdown = currentStoreMarkdown + Math.max(0, damageRoom);
    const budgetAmount = forecastSales * budgetRate;
    const budgetRoom = budgetAmount - projectedStoreMarkdown;
    const projectedStorePercent = forecastSales ? (projectedStoreMarkdown / forecastSales) * 100 : 0;
    el.sliderValue.textContent = sliderText(adjustment);
    el.forecastSales.textContent = money(forecastSales);
    el.currentDamage.textContent = money(currentDamage); el.damageTarget.textContent = money(damageTarget);
    el.damageRemaining.textContent = money(Math.abs(damageRoom)); el.storeMarkdown.textContent = money(projectedStoreMarkdown);
    el.budgetAmount.textContent = money(budgetAmount); el.budgetRemaining.textContent = money(Math.abs(budgetRoom)); el.projectedPercent.textContent = pct(projectedStorePercent);
    const enteredSales = wtd > 0 && forecastSales > 0;
    if (!enteredSales) { blankState(); return; }
    el.damageLabel.textContent = damageRoom >= 0 ? "Damage room" : "Damage over target";
    el.damageDetail.textContent = damageRoom >= 0 ? "Available to reach target" : "Already above target";
    el.budgetLabel.textContent = budgetRoom >= 0 ? "Budget room" : "Over store budget";
    el.budgetDetail.textContent = budgetRoom >= 0 ? "Remaining under budget" : "Above allowed budget";
    setTile(el.damageTile, damageRoom < 0); setTile(el.budgetTile, budgetRoom < 0);
    el.actionDamage.textContent = damageRoom >= 0 ? money(damageRoom) : `${money(Math.abs(damageRoom))} over`;
    el.actionBudget.textContent = budgetRoom >= 0 ? money(budgetRoom) : `${money(Math.abs(budgetRoom))} over`;
    const damageSentence = damageRoom >= 0 ? `You can take up to ${money(damageRoom)} in additional damage markdowns and finish at the ${DAMAGE_TARGET_PERCENT}% target.` : `Damage is already ${money(Math.abs(damageRoom))} above the ${DAMAGE_TARGET_PERCENT}% target.`;
    const budgetSentence = budgetRoom >= 0 ? `The store has ${money(budgetRoom)} remaining under its ${pct(budgetRate * 100)} markdown budget.` : `The store is forecast ${money(Math.abs(budgetRoom))} over its ${pct(budgetRate * 100)} markdown budget.`;
    el.actionMessage.textContent = `${damageSentence} ${budgetSentence}`;
    if (budgetRoom < 0) { setBudgetStatus("OVER BUDGET", "bad", `At this forecast, the store is ${money(Math.abs(budgetRoom))} over the ${pct(budgetRate * 100)} total markdown budget.`); }
    else if (budgetRate > 0 && projectedStorePercent >= budgetRate * 0.9) { setBudgetStatus("NEAR BUDGET", "warning", `At this forecast, the store is under budget by ${money(budgetRoom)}, but within 10% of the ${pct(budgetRate * 100)} limit.`); }
    else { setBudgetStatus("UNDER BUDGET", "good", `At this forecast, the store is under its ${pct(budgetRate * 100)} total markdown budget by ${money(budgetRoom)}.`); }
  }
  function blankState() { el.damageLabel.textContent = "Damage room"; el.damageDetail.textContent = "Available to reach target"; el.budgetLabel.textContent = "Budget room"; el.budgetDetail.textContent = "Remaining under budget"; setTile(el.damageTile, false); setTile(el.budgetTile, false); el.actionDamage.textContent = "$0.00"; el.actionBudget.textContent = "$0.00"; el.actionMessage.textContent = "Enter your morning numbers to see a live forecast."; setBudgetStatus("ENTER VALUES", "neutral", "Enter sales and markdown values to see your forecast."); }
  function setBudgetStatus(label, className, message) { el.budgetBadge.textContent = label; el.budgetBadge.className = `badge ${className}`; el.budgetStatus.textContent = message; }
  ids.forEach(id => el[id].addEventListener("input", () => { save(); calculate(); }));
  el.resetButton.addEventListener("click", () => { if (!confirm("Clear all saved calculator values?")) return; localStorage.removeItem(STORAGE_KEY); ids.forEach(id => { el[id].value = id === "budgetPercent" ? "1.60" : id === "salesSlider" ? "0" : ""; }); calculate(); });
  load(); calculate();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
})();


