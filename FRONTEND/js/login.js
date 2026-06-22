// ===============================
// REFERENCIAS DEL DOM
// ===============================

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

// ===============================
// INICIO DE SESIÓN DEL CLIENTE
// ===============================

loginForm.addEventListener("submit", async (e) => {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Obtener datos ingresados por el cliente
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    // Limpiar mensajes anteriores
    message.innerHTML = "";

    try {

        // Enviar credenciales al backend
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone,
                passwordHash: password
            })
        });

        // Convertir respuesta a JSON
        const data = await response.json();

        // Validar credenciales
        if (!response.ok) {

            message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.error || "Error al iniciar sesión"}
                </div>
            `;

            return;
        }

        // Guardar información del cliente
        // para mantener la sesión iniciada
        localStorage.setItem("clientId", data.client.id);
        localStorage.setItem("clientName", data.client.firstName);

        // Redirigir al inicio
        window.location.href = "../index.html";

        message.innerHTML = `
            <div class="alert alert-success">
                Login exitoso
            </div>
        `;

        console.log(data);

    } catch (error) {

        console.error(error);

        // Error de conexión con el servidor
        message.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión con el servidor
            </div>
        `;
    }
});