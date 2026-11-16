const API_URL = 'http://localhost:3000';
const CONFIG_KEY = 'generationConfig';
const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp', '.mp4'];

const $ = (id) => document.getElementById(id);
const queueEl = $('queue');

const queue = []; // { file, el, status }
let running = false;

// ---------------------------------------------------------------------------
// Estado del backend y configuración
// ---------------------------------------------------------------------------

async function checkBackend() {
  try {
    const health = await fetch(`${API_URL}/photos/test-config`).then((r) => r.json());
    $('backend-dot').className = 'dot ok';
    $('backend-text').textContent = `Backend conectado · ${health.model}`;
  } catch (error) {
    $('backend-dot').className = 'dot bad';
    $('backend-text').textContent = 'Backend apagado (localhost:3000)';
  }
}

/** "2026-05-01" -> "May 1, 2026" (igual que api-client.js) */
function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00`);
  if (isNaN(date)) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

async function getConfig() {
  try {
    const config = (await chrome.storage.local.get([CONFIG_KEY]))[CONFIG_KEY];
    return config ? { ...config, date: formatDate(config.date) } : undefined;
  } catch (error) {
    return undefined;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function renderConfigSummary() {
  const summary = $('config-summary');
  const generate = $('generate').checked;
  summary.hidden = !generate;
  if (!generate) return;

  const config = await getConfig();
  if (!config || (!config.keywords && !config.editorial)) {
    summary.className = 'config-summary warn';
    summary.textContent = 'No hay configuración guardada. Ábrela en el popup de la extensión (keywords base, editorial…).';
    return;
  }

  const missing = config.editorial && (!config.place || !config.date);
  summary.className = `config-summary${missing ? ' warn' : ''}`;
  summary.innerHTML = [
    `<b>Tipo:</b> ${config.editorial ? 'Editorial' : 'Comercial'}`,
    config.editorial ? `<b>Lugar:</b> ${escapeHtml(config.place || '— falta —')} · <b>Fecha:</b> ${escapeHtml(config.date || '— falta —')}` : '',
    `<b>Keywords base:</b> ${escapeHtml(config.keywords || '—')}`,
    config.notes ? `<b>Notas:</b> ${escapeHtml(config.notes)}` : '',
    '<span>Se cambia desde el popup de la extensión.</span>'
  ].filter(Boolean).join('<br>');
}

// ---------------------------------------------------------------------------
// Cola de subida
// ---------------------------------------------------------------------------

function extOf(name) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function createItem(file) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerHTML = `
    <div class="thumb"></div>
    <div class="item-main">
      <div class="item-name"></div>
      <div class="item-detail"></div>
      <div class="progress"><div class="progress-bar"></div></div>
    </div>
    <span class="badge">En cola</span>`;
  li.querySelector('.item-name').textContent = file.name;
  li.querySelector('.item-detail').textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB`;

  const thumb = li.querySelector('.thumb');
  if (file.type.startsWith('image/')) {
    thumb.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  } else {
    thumb.textContent = extOf(file.name).replace('.', '').toUpperCase();
  }
  queueEl.appendChild(li);
  return li;
}

function setItemState(item, badgeClass, badgeText, detail, detailClass = '') {
  const badge = item.el.querySelector('.badge');
  badge.className = `badge ${badgeClass}`;
  badge.textContent = badgeText;
  if (detail !== undefined) {
    const detailEl = item.el.querySelector('.item-detail');
    detailEl.className = `item-detail ${detailClass}`;
    detailEl.textContent = detail;
    detailEl.title = detail;
  }
  item.status = badgeClass;
  updateStats();
}

function setProgress(item, ratio) {
  item.el.querySelector('.progress-bar').style.width = `${Math.round(ratio * 100)}%`;
}

function hideProgress(item) {
  item.el.querySelector('.progress').hidden = true;
}

function updateStats() {
  const done = queue.filter((i) => ['ok', 'warn', 'error'].includes(i.status)).length;
  const errors = queue.filter((i) => i.status === 'error').length;
  $('queue-stats').textContent =
    `${done} de ${queue.length} terminados${errors ? ` · ${errors} con error` : ''}`;
}

function addFiles(fileList) {
  const files = Array.from(fileList);
  if (files.length === 0) return;
  $('queue-section').hidden = false;

  for (const file of files) {
    const item = { file, el: createItem(file), status: 'pending' };
    queue.push(item);
    if (!ALLOWED.includes(extOf(file.name))) {
      hideProgress(item);
      setItemState(item, 'error', 'No permitido', 'Solo JPG, PNG, WEBP o MP4', 'error');
    }
  }
  updateStats();
  processQueue();
}

/** Sube un archivo con XHR para tener progreso real */
function uploadFile(item, generate, config) {
  return new Promise((resolve) => {
    const form = new FormData();
    form.append('file', item.file);
    form.append('generate', generate ? 'true' : 'false');
    if (generate && config) form.append('config', JSON.stringify(config));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/photos/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setProgress(item, event.loaded / event.total);
    };
    xhr.upload.onload = () => {
      setProgress(item, 1);
      if (generate) setItemState(item, 'busy', 'Generando…', 'Subido · generando título y keywords');
    };

    xhr.onload = () => {
      hideProgress(item);
      let body = {};
      try { body = JSON.parse(xhr.responseText); } catch (_) { /* sin JSON */ }

      if (xhr.status === 409) {
        setItemState(item, 'warn', 'Ya existía', 'Ya hay un archivo con ese nombre en /public; no se sobrescribió', 'warn');
      } else if (xhr.status >= 400) {
        setItemState(item, 'error', 'Error', body.message || `HTTP ${xhr.status}`, 'error');
      } else if (body.generated) {
        setItemState(item, 'ok', 'Listo', body.title || 'Generado');
      } else if (generate && body.error) {
        setItemState(item, 'warn', 'Subido', `No se generó: ${body.error}`, 'warn');
      } else {
        setItemState(item, 'ok', 'Subido', 'Se generará al hacer clic en la plataforma');
      }
      resolve();
    };

    xhr.onerror = () => {
      hideProgress(item);
      setItemState(item, 'error', 'Error', 'No se pudo conectar con el backend (localhost:3000)', 'error');
      resolve();
    };

    setItemState(item, 'busy', 'Subiendo…');
    xhr.send(form);
  });
}

async function processQueue() {
  if (running) return;
  running = true;
  try {
    let item;
    while ((item = queue.find((i) => i.status === 'pending'))) {
      // Se leen en cada archivo por si cambias la casilla o el popup a mitad
      const generate = $('generate').checked;
      const config = generate ? await getConfig() : undefined;
      await uploadFile(item, generate, config);
    }
  } finally {
    running = false;
  }
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

const dropzone = $('dropzone');

['dragenter', 'dragover'].forEach((type) =>
  dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    dropzone.classList.add('dragover');
  })
);

['dragleave', 'drop'].forEach((type) =>
  dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    dropzone.classList.remove('dragover');
  })
);

dropzone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files));
$('file-input').addEventListener('change', (event) => {
  addFiles(event.target.files);
  event.target.value = '';
});

// Evita que soltar fuera de la zona abra el archivo en la pestaña
window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('drop', (event) => event.preventDefault());

$('generate').addEventListener('change', () => {
  try { localStorage.setItem('uploadGenerate', $('generate').checked ? '1' : '0'); } catch (_) {}
  renderConfigSummary();
});

$('clear-btn').addEventListener('click', () => {
  for (let i = queue.length - 1; i >= 0; i--) {
    if (!['pending', 'busy'].includes(queue[i].status)) {
      queue[i].el.remove();
      queue.splice(i, 1);
    }
  }
  $('queue-section').hidden = queue.length === 0;
  updateStats();
});

// Si cambias la configuración en el popup, el resumen se actualiza solo
chrome.storage.onChanged.addListener((changes) => {
  if (changes[CONFIG_KEY]) renderConfigSummary();
});

try { $('generate').checked = localStorage.getItem('uploadGenerate') === '1'; } catch (_) {}
checkBackend();
renderConfigSummary();
