const userBar = document.getElementById("userBar");

const clientName = localStorage.getItem("clientName");

if (clientName) {

    userBar.innerHTML = `
        <span class="me-3">
            Hola, ${clientName}
        </span>

        <button id="logoutBtn" class="btn btn-sm btn-outline-dark">
            Cerrar sesión
        </button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {

        localStorage.removeItem("clientId");
        localStorage.removeItem("clientName");

        window.location.reload();

    });

}

const clientId = localStorage.getItem("clientId");

const menuMisCitas = document.getElementById("menuMisCitas");

if (!clientId) {

    if (menuMisCitas) {
        menuMisCitas.style.display = "none";
    }

}

