// ===============================
// REFERENCIAS DEL DOM
// ===============================

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");


// ===============================
// INICIO DE SESIÓN ADMINISTRADOR
// ===============================

loginForm.addEventListener("submit", async (e) => {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Obtener datos ingresados por el administrador
    const username = 
        document.getElementById("username").value.trim();


    const password = 
        document.getElementById("password").value;

    // Limpiar mensajes anteriores    
    message.innerHTML = "";

    try {

        // Enviar credenciales al backend
        const response = await fetch("http://localhost:3000/api/admins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                passwordHash: password
            })
        });

        // Convertir respuesta a JSON
        const data = await response.json();

        // Validar si hubo error de autenticación
        if (!response.ok) {

            message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.error || "Error al iniciar sesión"}
                </div>
            `;

            return;
        }

        // Guardar información del administrador
        // en Local Storage para mantener la sesión
        localStorage.setItem("adminId", data.admin.id);
        localStorage.setItem("adminUsername", data.admin.username);

        // Redirigir al panel administrativo
        window.location.href = "admin-panel.html";

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