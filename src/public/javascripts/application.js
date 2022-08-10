/* eslint-env browser */
// = require govuk/components/header/header.js
window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};
window.GOVUK.Modules.GovukHeader = window.GOVUKFrontend.Header;

if (document.querySelector("#secondary-nav[data-module='govuk-header']")) {
  new window.GOVUK.Modules.GovukHeader(
    document.querySelector("#secondary-nav[data-module='govuk-header']")
  ).init();
}
