// ==============================
// ELEMENTOS DEL DOM
// ==============================

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");


// ==============================
// REGISTRO DEL CLIENTE
// ==============================

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    message.innerHTML = "";


    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Las contraseñas no coinciden.
            </div>
        `;
        return;
    }



    try {

        // Enviar datos al backend
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phone,
                passwordHash: password
            })
        });


        // Obtener respuesta del servidor
        const data = await response.json();

        // Validar respuesta del servidor
        if (!response.ok) {
            message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.error || data.message || "Error al registrar usuario"}
                </div>
            `;
            return;
        }

        // Mostrar mensaje de registro exitoso
        message.innerHTML = `
            <div class="alert alert-success">
                Registro exitoso. Redirigiendo...
            </div>
        `;

        // Redireccionar al login
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {

        // Error de conexión con el servidor
        message.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión con el servidor.
            </div>
        `;
        console.error(error);
    }
});