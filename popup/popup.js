document.addEventListener('DOMContentLoaded', async () => {
  const statusText = document.getElementById('status-text');
  const statusIndicator = document.getElementById('status-indicator');
  const reloadBtn = document.getElementById('reload-btn');
  
  // Obtener información de la pestaña activa
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url) {
      const domain = new URL(tab.url).hostname;
      
      // Verificar si estamos en una plataforma soportada
      const supportedDomains = [
        'submit.shutterstock.com',
        'contributor.stock.adobe.com',
        'gettyimages.com',
        'dreamstime.com',
        'depositphotos.com',
        'alamy.com'
      ];
      
      const isSupported = supportedDomains.some(d => domain.includes(d));
      
      if (isSupported) {
        statusText.textContent = `Activo en ${domain}`;
        statusIndicator.className = 'status-dot active';
      } else {
        statusText.textContent = 'No activo en esta página';
        statusIndicator.className = 'status-dot inactive';
      }
    }
  } catch (error) {
    statusText.textContent = 'Error al verificar estado';
    statusIndicator.className = 'status-dot inactive';
    console.error('Error:', error);
  }
  
  // Configuración de Dreamstime automático
  const dreamstimeAutoCheckbox = document.getElementById('dreamstime-auto');
  
  // Cargar configuración guardada
  try {
    const result = await chrome.storage.local.get(['dreamstimeAuto']);
    dreamstimeAutoCheckbox.checked = result.dreamstimeAuto !== false; // Por defecto true
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  // Guardar cuando cambie
  dreamstimeAutoCheckbox.addEventListener('change', async () => {
    try {
      await chrome.storage.local.set({ 
        dreamstimeAuto: dreamstimeAutoCheckbox.checked 
      });
      console.log('Dreamstime auto setting saved:', dreamstimeAutoCheckbox.checked);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  });
  
  // Botón de recarga
  reloadBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.reload(tab.id);
        window.close();
      }
    } catch (error) {
      console.error('Error reloading tab:', error);
    }
  });
});