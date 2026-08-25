/**
 * Application Entry Point & Orchestrator
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Shazamal Saif Portfolio initialized.');

  // Set copyright year dynamically
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }
});
