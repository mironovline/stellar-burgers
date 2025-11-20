// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Скрываем webpack dev server overlay, если он появляется
Cypress.on('uncaught:exception', (err) => {
  // Игнорируем ошибки, связанные с overlay
  if (err.message.includes('appendChild') || err.message.includes('webpack-dev-server')) {
    return false;
  }
  return true;
});

// Скрываем overlay после загрузки страницы
Cypress.on('window:load', (win) => {
  const hideOverlay = () => {
    const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  // Пытаемся скрыть сразу
  hideOverlay();

  // Также проверяем периодически на случай, если overlay появляется позже
  const interval = setInterval(() => {
    hideOverlay();
  }, 100);

  // Останавливаем проверку через 5 секунд
  setTimeout(() => {
    clearInterval(interval);
  }, 5000);
});