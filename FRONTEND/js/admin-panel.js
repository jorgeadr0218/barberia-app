const adminUsername = localStorage.getItem("adminUsername");

if (!adminUsername) {
    window.location.href = "admin.html";
}

document.getElementById("adminName").textContent =
   `Bienvenido ${adminUsername}`;

    const btnAppointments =
    document.getElementById("btnAppointments");

    const btnEmployees =
    document.getElementById("btnEmployees");

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

const saveEmployeeBtn =
    document.getElementById("saveEmployeeBtn");

    const employeeFormTitle =
    document.getElementById("employeeFormTitle");

    btnNewEmployee.addEventListener("click", () => {

    editEmployeeContainer.style.display = "block";

    employeeFormTitle.textContent = "Crear Empleado";

    editEmployeeId.value = "";

    editFirstName.value = "";
    editLastName.value = "";
    editPhone.value = "";
    editSalary.value = "";
    editStartTime.value = "";
    editEndTime.value = "";
    editHireDate.value = "";

});


btnAppointments.addEventListener("click", async () => {

    btnNewEmployee.style.display = "none";

    try {

        tableHeaders.innerHTML = `
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Barbero</th>
            <th>Fecha</th>
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

            appointmentsTableBody.innerHTML += `
                <tr>
                    <td>${appointment.client}</td>
                    <td>${appointment.service}</td>
                    <td>${appointment.employee}</td>
                    <td>${appointment.AppointmentDate}</td>
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

logoutAdminBtn.addEventListener("click", () => {

    localStorage.removeItem("adminUsername");

    window.location.href = "admin.html";

});

btnEmployees.addEventListener("click", async () => {

      btnNewEmployee.style.display = "inline-block";

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

editButtons.forEach(button => {

    button.addEventListener("click", () => {

        const employeeId = button.dataset.id;

        const employee = employees.find(
            emp => emp.ID == employeeId
        );

        editEmployeeContainer.style.display = "block";

        employeeFormTitle.textContent = "Editar Empleado";
    

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

saveEmployeeBtn.addEventListener("click", async () => {

    const employeeId = editEmployeeId.value;

    const isNewEmployee = employeeId === "";

    try {

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
                    hireDate: editHireDate.value
                })
            }
        );

        const data = await response.json();

        alert(data.mensaje);

        editEmployeeContainer.style.display = "none";

        btnEmployees.click();

    } catch (error) {

        console.error(error);

    }

});
