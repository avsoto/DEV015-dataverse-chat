import dataFunctions from "../lib/dataFunctions.js";
import { navigateTo } from "../router.js";

export const Cards = () => {
  const petsPerPage = 6;
  let currentPage = 1;

  const petsList = dataFunctions.showPets();

  const totalPages = Math.ceil(petsList.length / petsPerPage);

  // Función para calcular la edad en formato adecuado
  const getAgeDisplay = (years, months) => {
    const totalMonths = (years * 12) + months;
    return totalMonths < 12 ? `${months} mes(es)` : `${years} año(s)`;
  };

  // Función para generar el HTML de las mascotas
  const createPetHTML = (pet) => {
    const { years, months } = pet.facts.age;
    const ageDisplay = getAgeDisplay(years, months);

    return `
      <li class="tarjeta" itemscope itemtype="http://schema.org/Pet">
        <div itemprop="tarjeta-img">
          <img class="tarjeta-img" src="${pet.imageUrl}" alt="${pet.id}">
        </div>
        <div itemprop="name">${pet.name}</div>
        <div itemprop="description">${pet.shortDescription}</div>
        <div itemprop="age"><strong>Edad:</strong> ${ageDisplay}</div>
        <div itemprop="gender"><strong>Género:</strong> ${pet.facts.gender}</div>
        <div itemprop="breed"><strong>Raza:</strong> ${pet.facts.breed}</div>
        <div itemprop="size"><strong>Tamaño:</strong> ${pet.facts.size}</div>
        <div itemprop="temperament"><strong>Comportamiento:</strong> ${pet.facts.temperament}</div>
        <div class="content-tarjeta-button">
          <button class="tarjeta-button">Chatea conmigo</button>
        </div>
      </li>
    `;
  };

  // Función para manipular el DOM e insertar las mascotas
  const renderPets = () => {

    // Generar HTML de las mascotas
    const petsHTML = petsList.map(createPetHTML).join('');

    // Manipular el DOM
    const petsContainer = document.getElementById('pets-container');
    if (petsContainer) {
      petsContainer.innerHTML = '';
      
      const ul = document.createElement("ul");
      ul.className = "ul-tarjeta";

      // Calcular el rango de mascotas para la página actual
      const startIndex = (currentPage - 1) * petsPerPage;
      const endIndex = startIndex + petsPerPage;
      const petsToRender = petsList.slice(startIndex, endIndex);

      ul.innerHTML = petsToRender.map(createPetHTML).join('');

      petsContainer.appendChild(ul);

      // Añadir eventos a los botones de cada tarjeta
      document.querySelectorAll('.tarjeta-button').forEach(button => {
        button.addEventListener('click', (event) => {
          const petId = event.target.closest('.tarjeta').querySelector('img').alt; // Suponiendo que el alt es el ID
          if (petId) {
            navigateTo('/individualChat', { id: petId });
          } else {
            console.error('CARDS.JS: No se encontró el ID de la mascota.');
          }
        });
      });
    }

    renderPagination();

  };

  // Función para renderizar los controles de paginación
  const renderPagination = () => {
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
      paginationContainer.innerHTML = '';

      // Botón "Anterior"
      if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.addEventListener('click', () => {
          currentPage--;
          renderPets();
        });
        paginationContainer.appendChild(prevButton);
      }

      // Botones de número de página
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
          pageButton.classList.add('active'); // Marcar la página actual
        }
        pageButton.addEventListener('click', () => {
          currentPage = i;
          renderPets();
        });
        paginationContainer.appendChild(pageButton);
      }

      // Botón "Siguiente"
      if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.addEventListener('click', () => {
          currentPage++;
          renderPets();
        });
        paginationContainer.appendChild(nextButton);
      }
    }
  };

  // Retornar el HTML estático del componente de tarjetas
  const staticHTML = `
    <section class="mascotas-container" id="tarjetas-section">        
      <section class="mascotas-tarjetas">
        <h2 class="nuestras-mascotas">
          <span>Our pets</span>
          <p>All our pets come with a gift kit that includes: bath, bed, cookies, Wuf collar, ID tag, clothing, spa session, identification microchip, flea prevention, and much more!</p>
          <p class="numeroAdoptados"></p>
        </h2>
        <div class="mascotas-barra">
          <ul class="opciones-mascota">
            <li class="boton-filtros"><i class="fa-solid fa-bars" id="bars-2"></i>Filtros</li>
            <label id="orden"> Ordenar por:
              <input id="asc" type="radio" name="sort-order" value="asc" data-testid="select-sort">
              <i class="fa-solid fa-arrow-down-a-z" style="color: #ff7a00;"></i>
              <input id="desc" type="radio" name="sort-order" value="desc" data-testid="select-sort">
              <i class="fa-solid fa-arrow-up-a-z" style="color: #ff7a00;"></i>
            </label>
            <button id="btn-estadísticas">Estadísticas</button>
          </ul>
        </div>
        <div class="estadisticas-section">
          <div class="btn-close2">
            <li><i class="fa-solid fa-xmark"></i></li>
            <p class="adoptados"></p>
            <div class="graphics"></div>
          </div>
        </div>
        <div class="mascotas-filtros">
          <label for="tipo"></label>
          <select id="tipo" name="elegir" data-testid="select-filter">
            <option value="Tipo" disabled selected hidden>Tipo</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
          </select>
          <label for="edad"></label>
          <select id="edad" name="elegir">
            <option value="Edad" disabled selected hidden>Edad</option>
            <option value="Cachorro">Cachorro</option>
            <option value="Adulto">Adulto</option>
            <option value="Mayor">Mayor</option>
          </select>
          <label for="genero"></label>
          <select id="genero" name="elegir">
            <option value="Genero" disabled selected hidden>Género</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          <label for="tamaño"></label>
          <select id="tamaño" name="elegir">
            <option value="Tamaño" disabled selected hidden>Tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
          <div>
            <button id="btn-limpiar" data-testid="button-clear">Limpiar</button>
          </div>
        </div>
        <div id="pets-container">
        </div>

        <div id="pagination-container" class="pagination">
        </div>
      </section> 
    </section>
  `;

  // Usar requestAnimationFrame para asegurar que el DOM esté cargado
  requestAnimationFrame(() => {
    renderPets();
  });


  return staticHTML;
};


export default Cards;