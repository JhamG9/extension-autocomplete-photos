/**
 * Configuración por plataforma (delays, límites, comportamientos)
 */
const PLATFORM_CONFIG = {
  SHUTTERSTOCK: {
    name: 'Shutterstock',
    domain: 'submit.shutterstock',
    delays: {
      afterClick: 1000,
      beforeKeywords: 500,
      categoryDelay: 3000
    },
    limits: {
      maxKeywords: 50
    }
  },
  
  ADOBE_STOCK: {
    name: 'Adobe Stock',
    domain: 'contributor.stock.adobe.com',
    delays: {
      afterClick: 1000,
      sidebarLoad: 1000
    },
    limits: {
      maxKeywords: 49
    }
  },
  
  GETTY_IMAGES: {
    name: 'Getty Images',
    domain: 'gettyimages.com',
    delays: {
      afterClick: 1000,
      countryDropdown: 1500,
      initialization: 12000
    },
    limits: {
      maxKeywords: 50
    }
  },
  
  DREAMSTIME: {
    name: 'Dreamstime',
    domain: 'dreamstime.com',
    delays: {
      initialization: 1000,
      afterClick: 1000,
      beforeSubmit: 2000
    },
    coordinates: {
      // Coordenadas para hacer clic (ajustables por pantalla)
      workScreen: { x: 74, y: 505 },
      personalScreen: { x: 101, y: 430 }
    }
  },
  
  DEPOSITPHOTOS: {
    name: 'DepositPhotos',
    domain: 'depositphotos.com',
    delays: {
      afterClick: 100,
      typingSpeed: 5
    }
  },
  
  ALAMY: {
    name: 'Alamy',
    domain: 'alamy.com',
    delays: {
      initialization: 20000,
      afterClick: 1000,
      autoSubmit: 500
    },
    limits: {
      maxKeywords: 50,
      maxSuperTags: 10
    }
  }
};

window.PLATFORM_CONFIG = PLATFORM_CONFIG;