const clientid = localStorage.getItem("clientId");

if (!clientid) {
window.location.href = "login.html";
}

const appointmentForm = document.getElementById("appointmentForm");
const message = document.getElementById("message");

async function cargarServicios() {
    try {
        const response = await fetch("http://localhost:3000/api/services");
        const services = await response.json();

        const select = document.getElementById("serviceid");

        services.forEach(service => {
            const option = document.createElement("option");
            option.value = service.ID;
            option.textContent = service.Name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error(error);
    }
}

cargarServicios();

async function cargarEmpleados() {
    try {
        const response = await fetch("http://localhost:3000/api/employees");
        const employees = await response.json();

        const select = document.getElementById("employeeid");

        employees.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.ID;
            option.textContent =
                employee.FirstName + " " + employee.LastName;

            select.appendChild(option);
        });

    } catch (error) {
        console.error(error);
    }
}

cargarEmpleados();

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

    console.log({
    appointmentDate,
    clientid,
    employeeid,
    serviceid
});

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

        message.innerHTML = `
            <div class="alert alert-success">
                Cita reservada exitosamente.
            </div>
        `;

        appointmentForm.reset();

    } catch (error) {

        console.error(error);

        message.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión con el servidor.
            </div>
        `;
    }
});