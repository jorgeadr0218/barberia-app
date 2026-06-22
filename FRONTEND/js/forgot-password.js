// =========================
// RECUPERAR CONTRASEÑA
// =========================

const form = document.getElementById("forgotPasswordForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const phone = document.getElementById("phone").value;
    const newPasswordHash = document.getElementById("newPassword").value;

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/forgot-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone,
                    newPasswordHash
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            message.innerHTML = data.mensaje;
        } else {
            message.innerHTML = data.error;
        }

    } catch (error) {

        console.log(error);

        message.innerHTML = "Error de conexión con el servidor";

    }

});