const clientid = localStorage.getItem("clientId");

if (!clientid) {
window.location.href = "login.html";
}

const appointmentForm = document.getElementById("appointmentForm");
const message = document.getElementById("message");

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

    let finalPrice = 0;

    if (serviceid == 1) finalPrice = 20000;
    if (serviceid == 2) finalPrice = 30000;
    if (serviceid == 3) finalPrice = 15000;

    try {

        console.log({
    appointmentDate,
    finalPrice,
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
                finalPrice,
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