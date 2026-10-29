const API = window.HUERTAVIVA_CONFIG.API_BASE;

const listado = document.getElementById('productos');
const selector = document.getElementById('producto');
const aviso = document.getElementById('aviso');
const formulario = document.getElementById('formulario-pedido');
const resultado = document.getElementById('resultado-pedido');

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

function mostrar(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `aviso aviso-${tipo}`;
  elemento.hidden = false;
}

function pintarProductos(productos) {
  listado.replaceChildren();
  selector.replaceChildren();

  if (productos.length === 0) {
    listado.textContent = 'Ahora mismo no hay productos disponibles.';
    return;
  }

  for (const producto of productos) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'producto';

    const nombre = document.createElement('h3');
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement('p');
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = `${euros.format(producto.precio)} / ${producto.unidad}`;

    tarjeta.append(nombre, descripcion, precio);
    listado.append(tarjeta);

    const opcion = document.createElement('option');
    opcion.value = producto.id;
    opcion.textContent = `${producto.nombre} (${euros.format(producto.precio)} / ${producto.unidad})`;
    selector.append(opcion);
  }
}

async function cargarProductos() {
  try {
    const respuesta = await fetch(`${API}/productos`);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    pintarProductos(await respuesta.json());
  } catch (err) {
    listado.replaceChildren();
    mostrar(aviso, 'No se ha podido conectar con la API. Inténtalo más tarde.', 'error');
    console.error('Error al cargar productos:', err);
  }
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(formulario));

  try {
    const respuesta = await fetch(`${API}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const cuerpo = await respuesta.json();

    if (respuesta.ok) {
      mostrar(resultado, `Pedido n.º ${cuerpo.id} registrado. ¡Gracias!`, 'ok');
      formulario.reset();
    } else {
      mostrar(resultado, cuerpo.error || 'No se ha podido registrar el pedido.', 'error');
    }
  } catch (err) {
    mostrar(resultado, 'No se ha podido conectar con la API. Inténtalo más tarde.', 'error');
    console.error('Error al enviar el pedido:', err);
  }
});

cargarProductos();
