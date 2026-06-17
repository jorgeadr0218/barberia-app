const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// Get Appointments
router.get("/", (req, res) => {

    const sql = `
        SELECT
            Appointments.ID,
            Appointments.AppointmentDate,
            Appointments.FinalPrice,
            Appointments.Status,
            Appointments.Notes,
            CONCAT(Clients.FirstName, ' ', Clients.LastName) AS client,
            CONCAT(Employees.FirstName, ' ', Employees.LastName) AS employee,
            Services.Name AS service
        FROM Appointments
        INNER JOIN Clients
            ON Appointments.ClientID = Clients.ID
        INNER JOIN Employees
            ON Appointments.EmployeeID = Employees.ID
        INNER JOIN Services
            ON Appointments.ServiceID = Services.ID
    `;

    conexion.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener citas"
            });
        }

        res.json(result);

    });

});


router.get("/client/:clientid", (req, res) => {

    const { clientid } = req.params;

    const sql = `
        SELECT
            Appointments.ID,
            Appointments.AppointmentDate,
            Appointments.Status,
            Services.Name AS service,
            CONCAT(Employees.FirstName, ' ', Employees.LastName) AS employee
        FROM Appointments
        INNER JOIN Services
            ON Appointments.ServiceID = Services.ID
        INNER JOIN Employees
            ON Appointments.EmployeeID = Employees.ID
        WHERE Appointments.ClientID = ?
        ORDER BY Appointments.AppointmentDate DESC
    `;

    conexion.query(sql, [clientid], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al obtener citas"
            });
        }

        res.json(result);

    });

});


// Get Appointment By ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            Appointments.ID,
            Appointments.AppointmentDate,
            Appointments.FinalPrice,
            Appointments.Status,
            Appointments.Notes,
            CONCAT(Clients.FirstName, ' ', Clients.LastName) AS client,
            CONCAT(Employees.FirstName, ' ', Employees.LastName) AS employee,
            Services.Name AS service
        FROM Appointments
        INNER JOIN Clients
            ON Appointments.ClientID = Clients.ID
        INNER JOIN Employees
            ON Appointments.EmployeeID = Employees.ID
        INNER JOIN Services
            ON Appointments.ServiceID = Services.ID
        WHERE Appointments.ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener la cita"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Cita no encontrada"
            });
        }

        res.json(result[0]);

    });

});


// Create Appointment
router.post("/", (req, res) => {

    const { appointmentDate, clientid, employeeid, serviceid } = req.body;

    // Validación
    if (!appointmentDate || !clientid || !employeeid || !serviceid) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

const sqlServicio = `
    SELECT BasePrice, DurationMinutes
    FROM Services
    WHERE ID = ?
`;

conexion.query(sqlServicio, [serviceid], (err, servicio) => {

    if (err) {
        console.log(err);

        return res.status(500).json({
            error: "Error al obtener el precio del servicio"
        });
    }

    if (servicio.length === 0) {
        return res.status(404).json({
            error: "Servicio no encontrado"
        });
    }

    const finalPrice = servicio[0].BasePrice;

    const duration = servicio[0].DurationMinutes;

    const sqlEmpleado = `
    SELECT StartTime, EndTime
    FROM Employees
    WHERE ID = ?
`;

    const startDate = new Date(appointmentDate);

const endDate = new Date(
    startDate.getTime() + duration * 60000
);

const sqlConflicto = `
    SELECT ID
    FROM Appointments
    WHERE EmployeeID = ?
    AND ? < EndDateTime
    AND ? > AppointmentDate
`;

const sql = `
    INSERT INTO Appointments
    (
        AppointmentDate,
        EndDateTime,
        FinalPrice,
        ClientID,
        EmployeeID,
        ServiceID
    )
    VALUES (?, ?, ?, ?, ?, ?)
`;

conexion.query(
    sqlEmpleado,
    [employeeid],
    (err, empleado) => {

        if (err) {
            return res.status(500).json({
                error: "Error al obtener empleado"
            });
        }

        const horaCita = appointmentDate.split(" ")[1];

        const horaInicioTrabajo = empleado[0].StartTime;
        const horaFinTrabajo = empleado[0].EndTime;

        if (
            horaCita < horaInicioTrabajo ||
            horaCita > horaFinTrabajo
        ) {
            return res.status(400).json({
                error: "Fuera del horario laboral del barbero"
            });
        }

        conexion.query(
            sqlConflicto,
            [employeeid, appointmentDate, endDate],
            (err, citas) => {

                if (err) {
                    return res.status(500).json({
                        error: "Error al validar disponibilidad"
                    });
                }

                if (citas.length > 0) {
                    return res.status(400).json({
                        error: "Ese horario ya está ocupado"
                    });
                }

                conexion.query(
                    sql,
                    [
                        appointmentDate,
                        endDate,
                        finalPrice,
                        clientid,
                        employeeid,
                        serviceid
                    ],
                    (err, result) => {

                        if (err) {
                            return res.status(500).json({
                                error: "Error al crear la cita"
                            });
                        }

                        res.status(201).json({
                            mensaje: "Cita creada correctamente",
                            id: result.insertId
                        });

                    }
                );

            }
        );

    }
);

});

});

// Put Appointment
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { appointmentDate, finalPrice, clientid, employeeid, serviceid } = req.body;

    // Validación
    if (!appointmentDate || !finalPrice || !clientid || !employeeid || !serviceid) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        UPDATE Appointments
        SET AppointmentDate = ?, FinalPrice = ?, ClientID = ?, EmployeeID = ?, ServiceID = ?
        WHERE ID = ?
    `;

    conexion.query(
        sql,
        [appointmentDate, finalPrice, clientid, employeeid, serviceid, id],
        (err, result) => {

            if (err) {
                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "El empleado ya tiene una cita en esa fecha y hora"
                    });
                }

                return res.status(500).json({
                    error: "Error al actualizar la cita"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Cita no encontrada"
                });
            }

            res.json({
                mensaje: "Cita actualizada correctamente",
                id,
                appointmentDate,
                finalPrice,
                clientid,
                employeeid,
                serviceid
            });

        }
    );

});

router.put("/status/:id", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE Appointments
        SET Status = ?
        WHERE ID = ?
    `;

    conexion.query(sql, [status, id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al actualizar estado"
            });

        }

        res.json({
            mensaje: "Estado actualizado correctamente"
        });

    });

});

// Delete Appointment
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM Appointments
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al eliminar la cita"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cita no encontrada"
            });
        }

        res.json({
            mensaje: "Cita eliminada correctamente",
            id
        });

    });

});

module.exports = router;