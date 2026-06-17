const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    message.innerHTML = "";

    try {

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

        const data = await response.json();

        if (!response.ok) {

            message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.error || "Error al iniciar sesión"}
                </div>
            `;

            return;
        }

        localStorage.setItem("adminId", data.admin.id);
        localStorage.setItem("adminUsername", data.admin.username);

        window.location.href = "admin-panel.html";

    } catch (error) {

        console.error(error);

        message.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión con el servidor
            </div>
        `;
    }
});