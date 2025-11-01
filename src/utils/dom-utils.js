/**
 * Utilidades para manipulación del DOM
 */
class DOMUtils {
  /**
   * Espera a que aparezca un elemento en el DOM
   */
  static waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        Logger.log('DOM', `Element found immediately: ${selector}`);
        return resolve(element);
      }
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          Logger.log('DOM', `Element found after wait: ${selector}`);
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        Logger.error('DOM', `Element not found: ${selector}`, { timeout });
        reject(new Error(`Element ${selector} not found after ${timeout}ms`));
      }, timeout);
    });
  }
  
  /**
   * Simula escritura natural carácter por carácter
   */
  static simulateTyping(element, text, speed = 50) {
    return new Promise((resolve) => {
      element.focus();
      element.value = '';
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          element.value += text[i];
          element.dispatchEvent(new Event('input', { bubbles: true }));
          i++;
          setTimeout(type, speed);
        } else {
          element.dispatchEvent(new Event('change', { bubbles: true }));
          Logger.success('DOM', 'Typing completed', { text: text.substring(0, 50) + '...' });
          resolve();
        }
      };
      
      type();
    });
  }
  
  /**
   * Establece valor en un input y dispara eventos necesarios
   */
  static setElementValue(element, value) {
    if (!element) {
      Logger.error('DOM', 'Element not found for setValue');
      return false;
    }
    
    element.focus();
    
    // Para inputs React, usar el descriptor nativo
    if (element.tagName === 'INPUT') {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(element, value);
    } else {
      element.value = value;
    }
    
    // Disparar eventos para que frameworks los detecten
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    Logger.success('DOM', 'Value set', { value: value.substring(0, 50) + '...' });
    return true;
  }
  
  /**
   * Simula tecla Enter en un elemento
   */
  static pressEnter(element) {
    const events = ['keydown', 'keypress', 'keyup'];
    events.forEach(eventType => {
      const enterEvent = new KeyboardEvent(eventType, {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13
      });
      element.dispatchEvent(enterEvent);
    });
    Logger.log('DOM', 'Enter key pressed');
  }
  
  /**
   * Hace clic en coordenadas específicas
   */
  static clickAt(x, y) {
    const element = document.elementFromPoint(x, y);
    if (element) {
      const eventOptions = {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      };
      
      element.dispatchEvent(new MouseEvent('mouseover', eventOptions));
      element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
      element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
      element.dispatchEvent(new MouseEvent('click', eventOptions));
      
      Logger.log('DOM', `Clicked at coordinates`, { x, y, element: element.tagName });
      return element;
    } else {
      Logger.warn('DOM', `No element found at coordinates`, { x, y });
      return null;
    }
  }
}

window.DOMUtils = DOMUtils;