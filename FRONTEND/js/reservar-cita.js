// ==============================
// VALIDAR SESIÓN DEL CLIENTE
// ==============================

const clientid = localStorage.getItem("clientId");

if (!clientid) {
window.location.href = "login.html";
}


// ==============================
// ELEMENTOS DEL DOM Y PARÁMETROS
// ==============================

const appointmentForm = document.getElementById("appointmentForm");
const message = document.getElementById("message");
const params = new URLSearchParams(window.location.search);
const serviceidUrl = params.get("serviceid");


// ==============================
// CARGAR SERVICIOS
// ==============================

async function cargarServicios() {
    try {
        const response = await fetch("http://localhost:3000/api/services/active");
        const services = await response.json();

        const select = document.getElementById("serviceid");

        services.forEach(service => {
            const option = document.createElement("option");
            option.value = service.ID;
            option.textContent = service.Name;
            select.appendChild(option);
        });

        if (serviceidUrl) {

            select.value = serviceidUrl;

            mostrarPrecioServicio();

            cargarEmpleados();

        }

    } catch (error) {
        console.error(error);
    }
}

cargarServicios();


async function mostrarPrecioServicio() {

    const serviceId =
        document.getElementById("serviceid").value;

    if (!serviceId) {

        servicePrice.classList.add("d-none");
        servicePrice.innerHTML = "";

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/services/${serviceId}`
        );

        const service = await response.json();

        servicePrice.classList.remove("d-none");

        servicePrice.innerHTML = `
            Precio: $${Number(service.BasePrice).toLocaleString()}<br>
            Duración: ${service.DurationMinutes} minutos
        `;

    } catch (error) {

        console.error(error);

    }

}


async function cargarEmpleados() {
    try {

        const serviceid = document.getElementById("serviceid").value;

        console.log("Valor del servicio:", serviceid);

        const response = await fetch(
            `http://localhost:3000/api/employees/service/${serviceid}`
        );

        const employees = await response.json();

        const select = document.getElementById("employeeid");

        select.innerHTML =
            '<option value="">Seleccionar barbero</option>';

        employees.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.ID;
            option.textContent =
                employee.FirstName + " " + employee.LastName;

            select.appendChild(option);
        });

        if (employees.length === 1) {
            select.value = employees[0].ID;
            cargarHoras();
        }

    } catch (error) {
        console.error(error);
    }
}

const dateInput = document.getElementById("date");

const serviceSelect = document.getElementById("serviceid");

const servicePrice =
    document.getElementById("servicePrice");

serviceSelect.addEventListener("change", () => {

    document.getElementById("time").innerHTML = `
       <option value="">Seleccionar hora</option>
    `;

    mostrarPrecioServicio();

    cargarEmpleados();

});

const employeeSelect = document.getElementById("employeeid");

employeeSelect.addEventListener("change", cargarHoras);

dateInput.addEventListener("change", cargarHoras);

appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const serviceid = document.getElementById("serviceid").value;
    const employeeid = document.getElementById("employeeid").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;


    if (!serviceid || !employeeid || !date || !time) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Completa todos los campos.
            </div>
        `;
        return;
    }

    const appointmentDate = `${date} ${time}:00`;

    try {


        const response = await fetch("http://localhost:3000/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                appointmentDate,
                clientid,
                employeeid,
                serviceid
            })
        });

        const data = await response.json();

        if (!response.ok) {

            message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.error || "Error al reservar cita"}
                </div>
            `;

            return;
        }
console.log("Llegó al mensaje de éxito");
message.innerHTML = `
    <div class="alert alert-success">
        Cita reservada exitosamente.
    </div>
`;

const fechaSeleccionada = date;
const empleadoSeleccionado = employeeid;
const servicioSeleccionado = serviceid;

appointmentForm.reset();

document.getElementById("serviceid").value = servicioSeleccionado;
document.getElementById("employeeid").value = empleadoSeleccionado;
document.getElementById("date").value = fechaSeleccionada;

cargarHoras();

    } catch (error) {

        console.error(error);

        message.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión con el servidor.
            </div>
        `;
    }
});

async function cargarHoras() {

    const select = document.getElementById("time");
    const date = document.getElementById("date").value;
    const employeeId = document.getElementById("employeeid").value;
    const serviceId = document.getElementById("serviceid").value;

    select.innerHTML = `
        <option value="">Seleccionar hora</option>
    `;

    if (!date || !employeeId || !serviceId) {
        return;
    }

    const responseService = await fetch(
    `http://localhost:3000/api/services/${serviceId}`
);

const service = await responseService.json();

const duration = service.DurationMinutes;

    const responseSchedule = await fetch(
    `http://localhost:3000/api/employees/schedule/${employeeId}`
);

const schedule = await responseSchedule.json();

const horaInicio = schedule.StartTime.substring(0, 5);
const horaFin = schedule.EndTime.substring(0, 5);

console.log("Horario del barbero:", schedule);

const horas = [];

let horaActual = new Date(`2000-01-01 ${horaInicio}`);
const horaSalida = new Date(`2000-01-01 ${horaFin}`);

while (horaActual < horaSalida) {

    const finServicio = new Date(horaActual);

    finServicio.setMinutes(
        finServicio.getMinutes() + duration
    );

    if (finServicio <= horaSalida) {

        const h = String(horaActual.getHours()).padStart(2, "0");
        const m = String(horaActual.getMinutes()).padStart(2, "0");

        horas.push(`${h}:${m}`);
    }

    horaActual.setMinutes(
        horaActual.getMinutes() + 15
    );
}

    try {

        const response = await fetch(`http://localhost:3000/api/appointments/available-hours/${employeeId}/${date}`);

        const appointments = await response.json();

       const ocupadas = appointments.map(appointment => {

    return {
        inicio: new Date(appointment.AppointmentDate),
        fin: new Date(appointment.EndDateTime)
    };

});

const disponibles = horas.filter(hora => {

    const inicioCita = new Date(`${date} ${hora}`);

    const finCita = new Date(inicioCita);

    finCita.setMinutes(
        finCita.getMinutes() + duration
    );

    const hayCruce = ocupadas.some(cita => {

        return (
            inicioCita < cita.fin &&
            finCita > cita.inicio
        );

    });

    if (hayCruce) {
        return false;
    }


    const hoy = new Date();

    const fechaActual = hoy.toISOString().split("T")[0];

    if (date === fechaActual) {

        const [horaActual, minutoActual] = [
            hoy.getHours(),
            hoy.getMinutes()
        ];

        const [horaDisponible, minutoDisponible] = hora.split(":");

        if (
            Number(horaDisponible) < horaActual ||
            (
                Number(horaDisponible) === horaActual &&
                Number(minutoDisponible) <= minutoActual
            )
        ) {
            return false;
        }

    }

    return true;

});

if (disponibles.length === 0) {

    message.innerHTML = `
        <div class="alert alert-warning">
            Este barbero no tiene horarios disponibles para esta fecha.
        </div>
    `;

    return;
}


        disponibles.forEach(hora => {

            const option = document.createElement("option");

            option.value = hora;
            option.textContent = hora;

            select.appendChild(option);

        });

    } catch (error) {

        console.error("Error al cargar horas:", error);

    }

}