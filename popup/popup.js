const API_URL = 'http://localhost:3000';
const CONFIG_KEY = 'generationConfig';

const SUPPORTED_DOMAINS = [
  'submit.shutterstock.com',
  'contributor.stock.adobe.com',
  'gettyimages.com',
  'dreamstime.com',
  'depositphotos.com',
  'alamy.com',
  'pond5.com'
];

const $ = (id) => document.getElementById(id);

const fields = {
  keywords: $('keywords'),
  editorial: $('editorial'),
  place: $('place'),
  date: $('date'),
  notes: $('notes')
};

function setStatus(dotId, textId, active, text) {
  $(dotId).className = `status-dot ${active ? 'active' : 'inactive'}`;
  $(textId).textContent = text;
}

async function checkActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = tab?.url ? new URL(tab.url).hostname : '';
    const isSupported = SUPPORTED_DOMAINS.some((d) => domain.includes(d));
    setStatus('status-indicator', 'status-text', isSupported,
      isSupported ? `Activo en ${domain}` : 'No activo en esta página');
  } catch (error) {
    setStatus('status-indicator', 'status-text', false, 'Error al verificar estado');
  }
}

async function checkBackend() {
  try {
    const health = await fetch(`${API_URL}/photos/test-config`).then((r) => r.json());
    setStatus('backend-indicator', 'backend-text', health.hasOpenAIKey,
      health.hasOpenAIKey ? `Backend conectado · ${health.model}` : 'Backend sin OPENAI_API_KEY');
  } catch (error) {
    setStatus('backend-indicator', 'backend-text', false, 'Backend apagado (localhost:3000)');
  }
}

function readForm() {
  return {
    keywords: fields.keywords.value.trim(),
    editorial: fields.editorial.checked,
    place: fields.place.value.trim(),
    date: fields.date.value, // YYYY-MM-DD; api-client lo formatea en inglés
    notes: fields.notes.value.trim()
  };
}

function updateUI(config) {
  $('editorial-fields').hidden = !config.editorial;

  const count = config.keywords
    ? config.keywords.split(',').filter((k) => k.trim()).length
    : 0;
  $('keywords-count').textContent = `${count} keyword${count === 1 ? '' : 's'} base`;

  const problems = [];
  if (config.editorial && !config.place) problems.push('falta el lugar');
  if (config.editorial && !config.date) problems.push('falta la fecha');

  const warning = $('config-warning');
  warning.hidden = problems.length === 0;
  warning.textContent = problems.length
    ? `Para generar fotos nuevas: ${problems.join(', ')}.`
    : '';
}

let saveTimer;
function scheduleSave() {
  const config = readForm();
  updateUI(config);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await chrome.storage.local.set({ [CONFIG_KEY]: config });
      $('saved-text').textContent = 'Guardado ✓';
      setTimeout(() => { $('saved-text').textContent = ''; }, 1500);
    } catch (error) {
      $('saved-text').textContent = 'Error al guardar';
    }
  }, 300);
}

async function initConfigForm() {
  const stored = (await chrome.storage.local.get([CONFIG_KEY]))[CONFIG_KEY] || {};

  fields.keywords.value = stored.keywords || '';
  fields.editorial.checked = !!stored.editorial;
  fields.place.value = stored.place || '';
  fields.date.value = stored.date || '';
  fields.notes.value = stored.notes || '';
  updateUI(readForm());

  Object.values(fields).forEach((field) => {
    field.addEventListener('input', scheduleSave);
    field.addEventListener('change', scheduleSave);
  });
}

async function initDreamstimeSetting() {
  const checkbox = $('dreamstime-auto');
  try {
    const result = await chrome.storage.local.get(['dreamstimeAuto']);
    checkbox.checked = result.dreamstimeAuto !== false; // Por defecto true
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  checkbox.addEventListener('change', () => {
    chrome.storage.local.set({ dreamstimeAuto: checkbox.checked });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  checkActiveTab();
  initDreamstimeSetting();
  checkBackend();
  await initConfigForm();

  $('reload-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.tabs.reload(tab.id);
      window.close();
    }
  });
});
