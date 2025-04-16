// Seleccionando los elementos del DOM
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

// Cargar los eventos
cargarEventListeners();
function cargarEventListeners() {
	// Cuando se agrega un curso presionando "Agregar al carrito"
	listaCursos.addEventListener("click", agregarCurso);
	// Eliminar cursos del carrito
	carrito.addEventListener("click", eliminarCurso);

	document.addEventListener("DOMContentLoaded", () => {
		articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

		carritoHTML();
	})

	// Vaciar el carrito
	vaciarCarritoBtn.addEventListener("click", () => {
		articulosCarrito = []; // Reiniciar el arreglo
		limpiarHTML(); // Limpiar el HTML
	});
}

// Funciones:

// Eliminar curso del carrito
function eliminarCurso(e) {
	// Delegation para eliminar curso
	if (e.target.classList.contains("borrar-curso")) {
		const cursoId = e.target.getAttribute("data-id");

		// Eliminar del arreglo de articulosCarrito por el data-id
		articulosCarrito = articulosCarrito.filter(
			(curso) => curso.id !== cursoId
		);

		carritoHTML(); // Volver a renderizar el carrito
	}
}

// Agregar curso al carrito
function agregarCurso(e) {
	e.preventDefault();
	// Delegation para agregar carrito
	if (e.target.classList.contains("agregar-carrito")) {
		const cursoSeleccionado = e.target.parentElement.parentElement;
		leerDatosCurso(cursoSeleccionado);
	}
}

// Leer el contenido del HTML al que le dimos click y extraer la información del curso
function leerDatosCurso(curso) {
	// Crear un objeto con el contenido del curso actual
	const infoCurso = {
		imagen: curso.querySelector("img").src,
		titulo: curso.querySelector("h4").textContent,
		precio: curso.querySelector(".precio span").textContent,
		id: curso.querySelector("a").getAttribute("data-id"),
		cantidad: 1,
	};

	// Revisar si un elemento ya existe en el carrito
	const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);

	if (existe) {
		// Actualizar la cantidad
		const cursos = articulosCarrito.map((curso) => {
			if (curso.id === infoCurso.id) {
				curso.cantidad++;
				return curso; // Retorna el objeto actualizado
			} else {
				return curso; // Retorna el objeto sin cambios
			}
		});
		articulosCarrito = [...cursos];
	} else {
		// Agregar elementos al arreglo de carrito
		articulosCarrito = [...articulosCarrito, infoCurso];
	}

	carritoHTML(); // Mostrar el carrito de compras
}

// Mostrar el carrito de compras en el HTML
function carritoHTML() {
	// Limpiar el HTML
	limpiarHTML();

	// Recorre el carrito y genera el HTML
	articulosCarrito.forEach((curso) => {
		// Destructuring
		const { imagen, titulo, precio, id, cantidad } = curso;
		const row = document.createElement("tr");
		row.innerHTML = `
			<td><img src="${imagen}" width=100></td>
			<td>${titulo}</td>
			<td>${precio}</td>
			<td>${cantidad}</td>
			<td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
		`;

		// Agregar el HTML del carrito en el tbody
		contenedorCarrito.appendChild(row);
	});

	sincronizarStorage();
}

function sincronizarStorage() {
	localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Limpiar el HTML del carrito
function limpiarHTML() {
	// Forma lenta
	// contenedorCarrito.innerHTML = "";

	// Forma rápida
	while (contenedorCarrito.firstChild) {
		contenedorCarrito.removeChild(contenedorCarrito.firstChild);
	}
}
