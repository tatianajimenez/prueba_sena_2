const tailwindConfig = {
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'melissa-green': '#175E29',
        'melissa': '#0F4D19',
        'melissa-light': '#6FC27C',
        'melissa-light-2': '#6FC27C',
      }
    }
  }
};

function loadTailwind() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => {
      if (window.tailwind && tailwind.config) {
        tailwind.config = tailwindConfig;
      }
      resolve();
    };
    script.onerror = () => reject(new Error('Error cargando Tailwind CSS'));
    document.head.appendChild(script);
  });
}

if (window.tailwind && tailwind.config) {
  tailwind.config = tailwindConfig;
}

function applyMobileLayout() {
  // Verificar si ya se aplicó el layout
  if (document.querySelector('#mobile-container')) return;
  
  // Crear el contenedor móvil
  const mobileContainer = document.createElement('div');
  mobileContainer.id = 'mobile-container';
  mobileContainer.className = 'max-w-[500px] mx-auto bg-white min-h-screen shadow-lg relative';
  
  // Aplicar fondo gris al body
  document.body.className = 'bg-gray-200 min-h-screen';
  
  // Mover todo el contenido del body al contenedor móvil
  const bodyContent = Array.from(document.body.children);
  bodyContent.forEach(child => {
    if (child !== mobileContainer) {
      mobileContainer.appendChild(child);
    }
  });
  
  // Añadir el contenedor al body
  document.body.appendChild(mobileContainer);
}

async function loadComponent(url, targetId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar el componente: ${response.status}`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    let componentId = '';
    if (targetId === 'header-container') {
      componentId = 'header-component';
    } else if (targetId === 'footer-container') {
      componentId = 'footer-component';
    } else {
      componentId = targetId + '-component';
    }
    
    const component = doc.getElementById(componentId);
    if (component) {
      document.getElementById(targetId).innerHTML = component.innerHTML;
      
      const scripts = doc.querySelectorAll('script');
      if (scripts.length > 0) {
        console.log(`Encontrados ${scripts.length} scripts en el componente ${url}`);
        
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          
          Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          
          newScript.textContent = script.textContent;
          
          document.getElementById(targetId).appendChild(newScript);
          
          console.log(`Script del componente ${url} ejecutado`);
        });
      }
    } else {
      console.error("No se encontró el componente en el archivo:", url, "Buscando ID:", componentId);
    }
  } catch (error) {
    console.error("Error cargando el componente:", error);
  }
}

function loadFonts() {
  const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Montserrat"]');
  if (!existingLink) {
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
    
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'true';
    document.head.appendChild(preconnect2);
    
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }
}

async function initMelissa() {
  try {
    await loadTailwind();
    loadFonts();
    // Aplicar el layout móvil después de cargar Tailwind
    setTimeout(applyMobileLayout, 0);
  } catch (error) {
    console.error("Error inicializando MELISSA:", error);
  }
} 