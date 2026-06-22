// ====================
// LOGIN ADMIN
// ====================

const adminUsername = localStorage.getItem("adminUsername");

if (!adminUsername) {
    window.location.href = "admin.html";
}

document.getElementById("adminName").textContent =
   `Bienvenido ${adminUsername}`;


// ====================
// ELEMENTOS DEL DOM
// ====================

const btnAppointments =
document.getElementById("btnAppointments");

const btnEmployees =
document.getElementById("btnEmployees");

const btnServices =
document.getElementById("btnServices");

const btnNewEmployee =
document.getElementById("btnNewEmployee");

const appointmentsTableBody =
document.getElementById("appointmentsTableBody");

const tableHeaders =
document.getElementById("tableHeaders");

const editEmployeeContainer =
document.getElementById("editEmployeeContainer");

const editEmployeeId =
document.getElementById("editEmployeeId");

const editFirstName =
document.getElementById("editFirstName");

const editLastName =
document.getElementById("editLastName");

const editPhone =
document.getElementById("editPhone");

const editSalary =
document.getElementById("editSalary");

const editStartTime =
document.getElementById("editStartTime");

const editEndTime =
document.getElementById("editEndTime");

const editHireDate =
document.getElementById("editHireDate");    

const employeeServicesContainer =
document.getElementById("employeeServicesContainer");

const saveEmployeeBtn =
document.getElementById("saveEmployeeBtn");

const employeeFormTitle =
document.getElementById("employeeFormTitle");

const btnNewService =
document.getElementById("btnNewService");

const editServiceContainer =
document.getElementById("editServiceContainer");

const serviceFormTitle =
document.getElementById("serviceFormTitle");

const editServiceId =
document.getElementById("editServiceId");

const editServiceName =
document.getElementById("editServiceName");

const editServiceDescription =
document.getElementById("editServiceDescription");

const editServiceDuration =
document.getElementById("editServiceDuration");

const editServicePrice =
document.getElementById("editServicePrice");

const saveServiceBtn =
document.getElementById("saveServiceBtn");


// ====================
// CARGAR SERVICIOS
// ====================

async function loadServices() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/services"
        );

        const services = await response.json();

        employeeServicesContainer.innerHTML = "";

        services.forEach(service => {

            employeeServicesContainer.innerHTML += `
                <div class="form-check">

                    <input
                        class="form-check-input serviceCheckbox"
                        type="checkbox"
                        value="${service.ID}"
                    >

                    <label class="form-check-label">
                        ${service.Name}
                    </label>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// ====================
// CARGAR SERVICIOS DEL EMPLEADO
// ====================

async function loadEmployeeServices(employeeId) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/employees/employee-services/${employeeId}`
        );

        const services = await response.json();

        services.forEach(service => {

            const checkbox = document.querySelector(
                `.serviceCheckbox[value="${service.ID}"]`
            );

            if (checkbox) {
                checkbox.checked = true;
            }

        });

    } catch (error) {

        console.error(error);

    }

}


// ====================
// NUEVO EMPLEADO
// ====================    

btnNewEmployee.addEventListener("click", () => {

editEmployeeContainer.style.display = "block";

employeeFormTitle.textContent = "Crear Empleado";

loadServices();

editEmployeeId.value = "";

    editFirstName.value = "";
    editLastName.value = "";
    editPhone.value = "";
    editSalary.value = "";
    editStartTime.value = "";
    editEndTime.value = "";
    editHireDate.value = "";

});


// ====================
// NUEVO SERVICIO
// ====================

btnNewService.addEventListener("click", () => {

editServiceContainer.style.display = "block";

serviceFormTitle.textContent = "Crear Servicio";

editServiceId.value = "";

    editServiceName.value = "";
    editServiceDescription.value = "";
    editServiceDuration.value = "";
    editServicePrice.value = "";

});


// ====================
// GESTIONAR CITAS
// ====================

btnAppointments.addEventListener("click", async () => {

    btnAppointments.classList.remove("btn-dark");
    btnAppointments.classList.add("btn-secondary");

    btnEmployees.classList.remove("btn-secondary");
    btnEmployees.classList.add("btn-dark");

    btnServices.classList.remove("btn-secondary");
    btnServices.classList.add("btn-dark");

    editEmployeeContainer.style.display = "none";
    editServiceContainer.style.display = "none";

    btnNewEmployee.style.display = "none";
    btnNewService.style.display = "none";

    try {

        tableHeaders.innerHTML = `
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Barbero</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
        `;

        const response = await fetch(
            "http://localhost:3000/api/appointments"
        );

        const appointments = await response.json();

        appointmentsTableBody.innerHTML = "";
 
        console.log(appointments);

        appointments.forEach(appointment => {

            const fecha = new Date(appointment.AppointmentDate);

            const fechaFormateada = fecha.toLocaleDateString("es-CO");

            const horaFormateada = fecha.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit"
            });

            appointmentsTableBody.innerHTML += `
                <tr>
                    <td>${appointment.client}</td>
                    <td>${appointment.service}</td>
                    <td>${appointment.employee}</td>
                    <td>${fechaFormateada}</td>
                    <td>${horaFormateada}</td>
                    <td>${appointment.Status}</td>
                    <td>
                        ${
                           appointment.Status === "Pending"
                           ?
                           `
                           <button
                               class="btn btn-success btn-sm btnConfirmAppointment"
                               data-id="${appointment.ID}">
                               Confirmar
                            </button>

                            <button
                                class="btn btn-danger btn-sm btnCancelAppointment"
                                data-id="${appointment.ID}">
                                Cancelar
                            </button>
                            `
                            :
                            
                          appointment.Status === "Confirmed"
    ?
    `
    <button
        class="btn btn-primary btn-sm btnCompleteAppointment"
        data-id="${appointment.ID}">
        Completar
    </button>

    <button
        class="btn btn-danger btn-sm btnCancelAppointment"
        data-id="${appointment.ID}">
        Cancelar
    </button>
    `
    :
    ""
}  
                        
             </td>

        </tr>
    `;
 });


    const confirmButtons =
    document.querySelectorAll(".btnConfirmAppointment");

    const completeButtons =
    document.querySelectorAll(".btnCompleteAppointment");

    const cancelButtons =
    document.querySelectorAll(".btnCancelAppointment");

confirmButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const appointmentId = button.dataset.id;

        try {

            const response = await fetch(
                `http://localhost:3000/api/appointments/status/${appointmentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "Confirmed"
                    })
                }
            );

            const data = await response.json();

            alert(data.mensaje);

            btnAppointments.click();

        } catch (error) {

            console.error(error);

        }

    });

});


completeButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const appointmentId = button.dataset.id;

        try {

            const response = await fetch(
                `http://localhost:3000/api/appointments/status/${appointmentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "Completed"
                    })
                }
            );

            const data = await response.json();

            alert(data.mensaje);

            btnAppointments.click();

        } catch (error) {

            console.error(error);

        }

    });

});

cancelButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const appointmentId = button.dataset.id;

        const confirmCancel = confirm(
            `¿Deseas cancelar la cita ${appointmentId}?`
        );

        if (!confirmCancel) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:3000/api/appointments/status/${appointmentId}`,
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

            alert(data.mensaje);

            btnAppointments.click();

        } catch (error) {

            console.error(error);

        }

    });

});

    } catch (error) {
        console.error(error);
    }
});

const logoutAdminBtn = document.getElementById("logoutAdminBtn");

// ====================
// CERRAR SESIÓN
// ====================

logoutAdminBtn.addEventListener("click", () => {

    localStorage.removeItem("adminUsername");

    window.location.href = "admin.html";

});


// ====================
// GESTIONAR EMPLEADOS
// ====================

btnEmployees.addEventListener("click", async () => {

    btnEmployees.classList.remove("btn-dark");
    btnEmployees.classList.add("btn-secondary");

    btnAppointments.classList.remove("btn-secondary");
    btnAppointments.classList.add("btn-dark");

    btnServices.classList.remove("btn-secondary");
    btnServices.classList.add("btn-dark");

    // Ocultar formulario de servicios
    editServiceContainer.style.display = "none";

    btnNewEmployee.style.display = "inline-block";
    btnNewService.style.display = "none";

    console.log("Botón empleados pulsado");

    try {

        tableHeaders.innerHTML = `
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Salario</th>
            <th>Horario</th>
            <th>Estado</th>
            <th>Acciones</th>
        `;

        const response = await fetch(
            "http://localhost:3000/api/employees"
        );

        console.log("Response:", response);

        const employees = await response.json();

        console.log("Employees:", employees);

        appointmentsTableBody.innerHTML = "";

        employees.forEach(employee => {

            appointmentsTableBody.innerHTML += `
                <tr>
                    <td>${employee.ID}</td>
                    <td>${employee.FirstName}</td>
                    <td>${employee.LastName}</td>
                    <td>${employee.Phone}</td>
                    <td>$${employee.Salary}</td>
                    <td>${employee.StartTime} - ${employee.EndTime}</td>
                    <td>${employee.IsActive ? "Activo" : "Inactivo"}</td>
                    
                    <td>

                        <button
                            class="btn btn-warning btn-sm btnEditEmployee"
                            data-id="${employee.ID}">
                            Editar
                            </button>

                        ${
                           employee.IsActive
                           ?
                            `<button
                                class="btn btn-danger btn-sm btnDeleteEmployee"
                                data-id="${employee.ID}">
                                Desactivar
                            </button>`
                            :
                            `<button
                                class="btn btn-success btn-sm btnReactivateEmployee"
                                data-id="${employee.ID}">
                                Reactivar
                            </button>`
                        }

                    </td>

                </tr>
            `;

        });

const deleteButtons =
    document.querySelectorAll(".btnDeleteEmployee");

const editButtons =
    document.querySelectorAll(".btnEditEmployee");

const serviceButtons =
    document.querySelectorAll(".btnEmployeeServices");    

editButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const employeeId = button.dataset.id;

        const employee = employees.find(
            emp => emp.ID == employeeId
        );

        editEmployeeContainer.style.display = "block";

        employeeFormTitle.textContent = "Editar Empleado";
    
        await loadServices();
        await loadEmployeeServices(employee.ID);

        editEmployeeId.value = employee.ID;
        editFirstName.value = employee.FirstName;
        editLastName.value = employee.LastName;
        editPhone.value = employee.Phone;
        editSalary.value = employee.Salary;
        editStartTime.value = employee.StartTime;
        editEndTime.value = employee.EndTime;
        editHireDate.value = employee.HireDate.split("T")[0];

    });

});


const reactivateButtons =
    document.querySelectorAll(".btnReactivateEmployee");

reactivateButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const employeeId = button.dataset.id;

        try {

            const response = await fetch(
                `http://localhost:3000/api/employees/reactivate/${employeeId}`,
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            alert(data.mensaje);

            btnEmployees.click();

        } catch (error) {

            console.error(error);

        }

    });

});

deleteButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const employeeId = button.dataset.id;

        const confirmDelete = confirm(
            `¿Deseas desactivar el empleado ${employeeId}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:3000/api/employees/deactivate/${employeeId}`,
                {
                    method: "PUT"
                }
            );


            const data = await response.json();

            console.log(data);

            alert(data.mensaje);

            editEmployeeContainer.style.display = "none";

            btnEmployees.click();
            
            btnEmployees.click();

        } catch (error) {

            console.error(error);

        }

    });

});

 } catch (error) {

        console.error(error);

    }

});


// ====================
// GUARDAR EMPLEADO
// ====================

saveEmployeeBtn.addEventListener("click", async () => {

    const employeeId = editEmployeeId.value;

    const selectedServices = [
       ...document.querySelectorAll(".serviceCheckbox:checked")
    ].map(checkbox => checkbox.value);

    const isNewEmployee = employeeId === "";

    try {

        console.log("Servicios seleccionados:", selectedServices);
        const response = await fetch(
            isNewEmployee
            ? "http://localhost:3000/api/employees"
            : `http://localhost:3000/api/employees/${employeeId}`,
            {
                method: isNewEmployee ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: editFirstName.value,
                    lastName: editLastName.value,
                    phone: editPhone.value,
                    salary: editSalary.value,
                    startTime: editStartTime.value,
                    endTime: editEndTime.value,
                    hireDate: editHireDate.value,
                    services: selectedServices
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert(data.mensaje);

        editEmployeeContainer.style.display = "none";

        btnEmployees.click();

    } catch (error) {

        console.error(error);

    }

});


// ====================
// GUARDAR SERVICIO
// ====================

saveServiceBtn.addEventListener("click", async () => {
    
    const serviceId = editServiceId.value;

const isNewService = serviceId === "";

    try {

 const response = await fetch(
    isNewService
    ? "http://localhost:3000/api/services"
    : `http://localhost:3000/api/services/${serviceId}`,
    {
        method: isNewService ? "POST" : "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: editServiceName.value,
            description: editServiceDescription.value,
            imageUrl: "",
            durationMinutes: editServiceDuration.value,
            basePrice: editServicePrice.value
        })
    }
);

        const data = await response.json();

        alert(data.mensaje);

        editServiceContainer.style.display = "none";

        btnServices.click();

    } catch (error) {

        console.error(error);

    }

});


// ====================
// GESTIONAR SERVICIOS
// ====================

btnServices.addEventListener("click", async () => {

    btnServices.classList.remove("btn-dark");
    btnServices.classList.add("btn-secondary");

    btnAppointments.classList.remove("btn-secondary");
    btnAppointments.classList.add("btn-dark");

    btnEmployees.classList.remove("btn-secondary");
    btnEmployees.classList.add("btn-dark");

    // Ocultar formulario de empleados
    editEmployeeContainer.style.display = "none";

    btnNewService.style.display = "inline-block";
    btnNewEmployee.style.display = "none";

    try {

        tableHeaders.innerHTML = `
            <th>ID</th>
            <th>Servicio</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
        `;

        const response = await fetch(
            "http://localhost:3000/api/services"
        );

        const services = await response.json();

        console.log("Services:", services);

        appointmentsTableBody.innerHTML = "";

services.forEach(service => {

    appointmentsTableBody.innerHTML += `
        <tr>
            <td>${service.ID}</td>
            <td>${service.Name}</td>
            <td>$${Number(service.BasePrice).toLocaleString()}</td>
            <td>${service.IsActive ? "Activo" : "Inactivo"}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm btnEditService"
                    data-id="${service.ID}">
                    Editar
                </button>

                ${
                    service.IsActive
                    ?
                    `<button
                        class="btn btn-danger btn-sm btnDeleteService"
                        data-id="${service.ID}">
                        Desactivar
                    </button>`
                    :
                    `<button
                        class="btn btn-success btn-sm btnReactivateService"
                        data-id="${service.ID}">
                        Reactivar
                    </button>`
                }

            </td>

        </tr>
    `;

});

const editServiceButtons =
    document.querySelectorAll(".btnEditService");

editServiceButtons.forEach(button => {

    button.addEventListener("click", () => {

        const serviceId = button.dataset.id;

        const service = services.find(
            serv => serv.ID == serviceId
        );

        editServiceContainer.style.display = "block";

        serviceFormTitle.textContent =
            "Editar Servicio";

        editServiceId.value =
            service.ID;

        editServiceName.value =
            service.Name;

        editServiceDescription.value =
            service.Description || "";

        editServiceDuration.value =
            service.DurationMinutes;

        editServicePrice.value =
            service.BasePrice;

    });

});

const deleteServiceButtons =
    document.querySelectorAll(".btnDeleteService");

deleteServiceButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const serviceId = button.dataset.id;

        try {

            const response = await fetch(
                `http://localhost:3000/api/services/deactivate/${serviceId}`,
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            alert(data.mensaje);

            btnServices.click();

        } catch (error) {

            console.error(error);

        }

    });

});

const reactivateServiceButtons =
    document.querySelectorAll(".btnReactivateService");

reactivateServiceButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const serviceId = button.dataset.id;

        try {

            const response = await fetch(
                `http://localhost:3000/api/services/reactivate/${serviceId}`,
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            alert(data.mensaje);

            btnServices.click();

        } catch (error) {

            console.error(error);

        }

    });

});

    } catch (error) {

        console.error(error);

    }

});