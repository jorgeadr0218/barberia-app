// ===============================
// REFERENCIAS DEL DOM
// =============================

const appointmentsTableBody = document.getElementById("appointmentsTableBody");


// ===============================
// VALIDAR SESIÓN DEL CLIENTE
// ===============================

const idCliente = localStorage.getItem("clientId");

if (!idCliente) {
    window.location.href = "login.html";
} else {
    loadAppointments();
}



// ===============================
// CANCELAR CITA
// ===============================

async function cancelarCita(id) {

    const confirmar = confirm(
        "¿Deseas cancelar esta cita?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/appointments/status/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Cancelled"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        // Recargar listado de citas
        loadAppointments();

    } catch (error) {

        console.error(error);

        alert("Error al cancelar la cita");

    }

}


// ===============================
// CARGAR CITAS DEL CLIENTE
// ===============================

async function loadAppointments() {
    try {

        const response = await fetch(
            `http://localhost:3000/api/appointments/client/${idCliente}`
        );

        const data = await response.json();

        // Validar respuesta del servidor
        if (!response.ok) {

            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        ${data.error}
                    </td>
                </tr>
            `;

            return;
        }

        // Validar si existen citas
        if (data.length === 0) {

            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No tienes citas registradas.
                    </td>
                </tr>
            `;

            return;
        }

        let html = "";

        data.forEach(cita => {

            const fecha = new Date(cita.AppointmentDate);

            const fechaFormateada = fecha.toLocaleDateString("es-CO");

            const horaFormateada = fecha.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit"
            });

            html += `
                <tr>
                    <td>${cita.service}</td>
                    <td>$${Number(cita.BasePrice).toLocaleString()}</td>
                    <td>${cita.employee}</td>
                    <td>${fechaFormateada}</td>
                    <td>${horaFormateada}</td>
                    <td>${cita.Status}</td>
                    <td>
                        ${
                            cita.Status === "Cancelled"
                                ? "Cancelada"
                                : cita.Status === "Completed"
                                    ? "Finalizada"
                                    : `
                                       <button
                                          class="btn btn-danger btn-sm"
                                          onclick="cancelarCita(${cita.ID})">
                                          Cancelar
                                        </button>
                                    `
                        }
                                  
                    </td>
                </tr>
            `;
        });

        appointmentsTableBody.innerHTML = html;

    } catch (error) {

        console.error(error);

        appointmentsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Error al cargar las citas.
                </td>
            </tr>
        `;
    }
}