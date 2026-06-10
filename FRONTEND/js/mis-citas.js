const appointmentsTableBody = document.getElementById("appointmentsTableBody");

const idCliente = localStorage.getItem("clientId");

if (!idCliente) {
    window.location.href = "login.html";
} else {
    loadAppointments();
}

async function loadAppointments() {
    try {

        const response = await fetch(
            `http://localhost:3000/api/appointments/client/${idCliente}`
        );

        const data = await response.json();

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

        if (data.length === 0) {

            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
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
                    <td>${cita.employee}</td>
                    <td>${fechaFormateada}</td>
                    <td>${horaFormateada}</td>
                    <td>${cita.Status}</td>
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