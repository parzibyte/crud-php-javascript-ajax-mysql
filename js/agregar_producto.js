const $nombre = document.querySelector("#nombre"),
    $descripcion = document.querySelector("#descripcion"),
    $precio = document.querySelector("#precio"),
    $btnGuardar = document.querySelector("#btnGuardar");

$btnGuardar.onclick = async () => {
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
    // Lo que vamos a enviar a PHP
    const cargaUtil = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        // Nota: podríamos hacerlo más simple, y escribir:
        // nombre,
        // En lugar de:
        // nombre: nombre
        // Pero eso podría confundir al principiante
    };
    // Codificamos...
    const cargaUtilCodificada = JSON.stringify(cargaUtil);
    // Enviamos
    try {
        const respuestaRaw = await fetch("guardar_producto.php", {
            method: "POST",
            body: cargaUtilCodificada,
        });
        // El servidor nos responderá con JSON
        const respuesta = await respuestaRaw.json();
        if (respuesta) {

            // Y si llegamos hasta aquí, todo ha ido bien
            Swal.fire({
                icon: "success",
                text: "Producto guardado",
            });
            // Limpiamos el formulario
            $nombre.value = $descripcion.value = $precio.value = "";
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