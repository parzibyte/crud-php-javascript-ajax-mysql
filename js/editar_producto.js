const $nombre = document.querySelector("#nombre"),
    $descripcion = document.querySelector("#descripcion"),
    $precio = document.querySelector("#precio"),
    $btnGuardar = document.querySelector("#btnGuardar");

// Una global para establecerla al rellenar el formulario y leerla al enviarlo
let idProducto;

const rellenarFormulario = async () => {

    // https://parzibyte.me/blog/2020/08/14/extraer-parametros-url-javascript/
    const urlSearchParams = new URLSearchParams(window.location.search);
    idProducto = urlSearchParams.get("id"); // <-- Actualizar el ID global
    // Obtener el producto desde PHP
    const respuestaRaw = await fetch(`./obtener_producto_por_id.php?id=${idProducto}`);
    const producto = await respuestaRaw.json();
    // Rellenar formulario
    $nombre.value = producto.nombre;
    $descripcion.value = producto.descripcion;
    $precio.value = producto.precio;
};

// Al incluir este script, llamar a la función inmediatamente
rellenarFormulario();

$btnGuardar.onclick = async () => {
    // Se comporta igual que cuando guardamos uno nuevo
    const nombre = $nombre.value,
        descripcion = $descripcion.value,
        precio = parseFloat($precio.value);
    // Pequeña validación, aunque debería hacerse del lado del servidor igualmente, aquí es pura estética
    if (!nombre) {
        return Swal.fire({
            icon: "error",
            text: "Escribe el nombre",
        });
    }
    if (!descripcion) {
        return Swal.fire({
            icon: "error",
            text: "Escribe la descripción",
        });
    }

    if (!precio) {
        return Swal.fire({
            icon: "error",
            text: "Escribe el precio",
        });
    }
    // Lo que vamos a enviar a PHP. También incluimos el ID
    const cargaUtil = {
        id: idProducto,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
    };
    // Codificamos...
    const cargaUtilCodificada = JSON.stringify(cargaUtil);
    // Enviamos
    try {
        const respuestaRaw = await fetch("actualizar_producto.php", {
            method: "PUT",
            body: cargaUtilCodificada,
        });
        // El servidor nos responderá con JSON
        const respuesta = await respuestaRaw.json();
        if (respuesta) {
            // Y si llegamos hasta aquí, todo ha ido bien
            // Esperamos a que la alerta se muestre
            await Swal.fire({
                icon: "success",
                text: "Producto actualizado",
                timer: 700, // <- Ocultar dentro de 0.7 segundos
            });
            // Redireccionamos a todos los productos
            window.location.href = "./productos.php";
        } else {
            Swal.fire({
                icon: "error",
                text: "El servidor no envió una respuesta exitosa",
            });
        }
    } catch (e) {
        // En caso de que haya un error
        Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "Inténtalo de nuevo. El error es: " + e,
        });
    }
};