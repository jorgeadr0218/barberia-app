const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    message.innerHTML = "";

    if (password !== confirmPassword) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Las contraseñas no coinciden.
            </div>
        `;
        return;
    }

    try {
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

        const data = await response.json();

        if (!response.ok) {
            message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.message || "Error al registrar usuario"}
                </div>
            `;
            return;
        }

        message.innerHTML = `
            <div class="alert alert-success">
                Registro exitoso. Redirigiendo...
            </div>
        `;

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión con el servidor.
            </div>
        `;
        console.error(error);
    }
});