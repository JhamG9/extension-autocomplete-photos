# Photo Stock Autocomplete Extension

Extensión de navegador que automatiza el llenado de metadatos para fotos de stock en múltiples plataformas.

## 🎯 Plataformas Soportadas

- ✅ **Shutterstock** - submit.shutterstock.com
- ✅ **Adobe Stock** - contributor.stock.adobe.com  
- ✅ **Getty Images** - gettyimages.com
- ✅ **Dreamstime** - dreamstime.com
- ✅ **DepositPhotos** - depositphotos.com
- ✅ **Alamy** - alamy.com

## 🚀 Instalación

1. **Clonar/Descargar** el repositorio
2. **Abrir Chrome** y ir a `chrome://extensions/`
3. **Activar "Modo de desarrollador"** (Developer mode)
4. **Hacer clic en "Cargar extensión sin empaquetar"** (Load unpacked)
5. **Seleccionar** la carpeta del proyecto

## 📁 Estructura del Proyecto

```
extension-autocomplete-photos/
├── src/
│   ├── content-main.js           # Punto de entrada principal
│   ├── platforms/                # Lógica específica por plataforma
│   │   ├── base-platform.js      # Clase base compartida
│   │   ├── shutterstock.js       # Shutterstock
│   │   ├── adobe-stock.js        # Adobe Stock
│   │   ├── getty-images.js       # Getty Images
│   │   ├── dreamstime.js         # Dreamstime
│   │   ├── depositphotos.js      # DepositPhotos
│   │   └── alamy.js              # Alamy
│   ├── utils/                    # Utilidades reutilizables
│   │   ├── logger.js             # Sistema de logging
│   │   ├── dom-utils.js          # Manipulación DOM
│   │   └── api-client.js         # Cliente API
│   └── config/                   # Configuración
│       ├── selectors.js          # Selectores CSS por plataforma
│       └── platforms.js          # Configuración de delays y límites
├── popup/                        # Interfaz de usuario
│   ├── popup.html               # HTML del popup
│   ├── popup.js                 # Lógica del popup
│   └── popup.css                # Estilos del popup
├── manifest.json                # Configuración de la extensión
└── README.md                    # Esta documentación
```

## ⚡ Cómo Funciona

### 1. **Detección Automática**
La extensión detecta automáticamente en qué plataforma estás trabajando basándose en el dominio de la página.

### 2. **API Local**
Se conecta a tu API local en `http://localhost:3000/photos/search?name={filename}` para obtener:
- Título/descripción de la foto
- Keywords/etiquetas
- Categorías (cuando aplique)

### 3. **Llenado Automático**
Al hacer clic en una foto o elemento de la interfaz:
- Extrae el nombre del archivo
- Consulta la API para obtener metadatos
- Llena automáticamente todos los campos
- Simula interacciones naturales con la página

## 🔧 Configuración

### API Endpoint
La extensión espera que tu API local esté ejecutándose en:
```
http://localhost:3000/photos/search?name={filename}
```

### Respuesta Esperada
```json
[
  {
    "title": "Título de la foto",
    "description": "Descripción detallada",
    "keywords": "palabra1, palabra2, palabra3, ...",
    "categoryOne": "Categoría principal",
    "categoryTwo": "Categoría secundaria"
  }
]
```

## 🎮 Uso

1. **Iniciar tu API local** en `localhost:3000`
2. **Navegar** a cualquier plataforma soportada
3. **Hacer clic** en una foto o elemento de upload
4. La extensión **automáticamente**:
   - Detectará el nombre del archivo
   - Consultará tu API
   - Llenará todos los campos
   - Aplicará configuraciones específicas de la plataforma

## 🔍 Debugging

### Logs en Consola
La extensión genera logs detallados:
```
🔵 [timestamp] [Platform] Action: data
✅ [timestamp] [Platform] Success: data  
❌ [timestamp] [Platform] Error: error
⚠️ [timestamp] [Platform] Warning: data
```

### Acceso Global
En la consola del navegador puedes acceder a:
```javascript
// Estado de la extensión
extensionManager.getStatus()

// Reinicializar si hay problemas
extensionManager.reinitialize()
```

## 🛠️ Personalización

### Modificar Selectores CSS
Edita `src/config/selectors.js` para actualizar selectores si cambian las interfaces.

### Ajustar Delays
Modifica `src/config/platforms.js` para cambiar tiempos de espera por plataforma.

### Agregar Nueva Plataforma
1. Crear nuevo archivo en `src/platforms/nueva-plataforma.js`
2. Extender `BasePlatform`
3. Agregar configuración en `src/config/`
4. Actualizar `manifest.json` y `content-main.js`

## 📈 Estadísticas

- **Antes**: 20 fotos por día
- **Después**: 200+ fotos por día
- **Mejora**: 10x aumento en productividad

## 🚨 Solución de Problemas

### La extensión no funciona
1. Verificar que la API local esté corriendo
2. Revisar logs en la consola del navegador
3. Recargar la página y la extensión

### Selectores no funcionan
- Las plataformas actualizan sus interfaces
- Revisar y actualizar selectores en `src/config/selectors.js`

### Delays muy rápidos/lentos
- Ajustar tiempos en `src/config/platforms.js`
- Diferentes máquinas pueden necesitar delays distintos

## 🔄 Actualizaciones

Para actualizar la extensión:
1. Realizar cambios en el código
2. Ir a `chrome://extensions/`
3. Hacer clic en el botón "Recargar" de la extensión
4. O usar el botón "Recargar Extensión" en el popup

## 📝 Changelog

### v2.0.0
- ✅ Arquitectura modular completamente reorganizada
- ✅ Sistema de logging estructurado
- ✅ Configuración centralizada
- ✅ Manejo de errores mejorado
- ✅ Interfaz de popup renovada
- ✅ Código mantenible y escalable

### v1.0.0
- ✅ Funcionalidad básica para 6 plataformas
- ✅ Integración con API local
- ✅ Automatización completa del flujo de trabajo