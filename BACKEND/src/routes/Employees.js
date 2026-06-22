const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// =======================
// OBTENER EMPLEADOS
// =======================

router.get("/", (req, res) => {

    const sql = `
        SELECT * FROM Employees
    `;

    conexion.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener empleados"
            });
        }

        res.json(result);

    });

});


// ================================================
// OBTENER EMPLEADOS QUE REALIZAN UN SERVICIO
// ================================================

router.get("/service/:serviceid", (req, res) => {

    const { serviceid } = req.params;

    const sql = `
        SELECT
            Employees.ID,
            Employees.FirstName,
            Employees.LastName
        FROM EmployeeService
        INNER JOIN Employees
            ON EmployeeService.EmployeeID = Employees.ID
        WHERE EmployeeService.ServiceID = ?
        AND Employees.IsActive = 1
    `;

    conexion.query(sql, [serviceid], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener empleados"
            });
        }

        res.json(result);

    });

});


// ==============================================
// OBTENER HORARIO DE TRABAJO DE UN EMPLEADO
// ==============================================

router.get("/schedule/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            StartTime,
            EndTime
        FROM Employees
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener horario del empleado"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Empleado no encontrado"
            });
        }

        res.json(result[0]);

    });

});


// =====================================
// OBTENER SERVICIOS DE UN EMPLEADO
// =====================================

router.get("/employee-services/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            Services.ID,
            Services.Name
        FROM EmployeeService
        INNER JOIN Services
            ON EmployeeService.ServiceID = Services.ID
        WHERE EmployeeService.EmployeeID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al obtener servicios del empleado"
            });

        }

        res.json(result);

    });

});


// =============================
// OBTENER EMPLEADO POR ID
// =============================

router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT * FROM Employees
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener empleado"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Empleado no encontrado"
            });
        }

        res.json(result[0]);

    });

});


// =======================
// CREAR EMPLEADO
// =======================

router.post("/", (req, res) => {

    const { firstName, lastName, phone, salary, startTime, endTime, hireDate, services } = req.body;

    // Validación
    if (!firstName || !lastName || !phone || !salary || !startTime || !endTime || !hireDate) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    // Validar horario
    if (startTime >= endTime) {
        return res.status(400).json({
            error: "La hora de inicio debe ser menor que la hora de fin"
        });
    }

    const sql = `
        INSERT INTO Employees
        (FirstName, LastName, Phone, Salary, StartTime, EndTime, HireDate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [firstName, lastName, phone, salary, startTime, endTime, hireDate],
        (err, result) => {

            if (err) {
                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "El teléfono ya existe"
                    });
                }

                return res.status(500).json({
                    error: "Error al crear empleado"
                });
            }

            const employeeId = result.insertId;

            // Si no seleccionó servicios, finalizar
            if (!services || services.length === 0) {

                return res.status(201).json({
                   mensaje: "Empleado creado correctamente",
                   id: employeeId
                });

            }

            // Preparar los valores para EmployeeServices
            const values = services.map(serviceId => [
                employeeId,
                serviceId
            ]);

            const sqlServices = `
                INSERT INTO EmployeeService
                (EmployeeID, ServiceID)
                VALUES ?
            `;

            conexion.query(
                sqlServices,
                [values],
                (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            error: "Error al guardar los servicios del empleado"
                        });
                    }

                    return res.status(201).json({
                        mensaje: "Empleado creado correctamente",
                        id: employeeId
                    });

                }
            );

        }
    );

});


// =======================
// ACTUALIZAR EMPLEADO
// =======================

router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { firstName, lastName, phone, salary, startTime, endTime, hireDate, services } = req.body;

    console.log("Servicios recibidos:", services);

    console.log(req.body);

    // Validación
    if (!firstName || !lastName || !phone || !salary || !startTime || !endTime || !hireDate) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    // Validar horario
    if (startTime >= endTime) {
        return res.status(400).json({
            error: "La hora de inicio debe ser menor que la hora de fin"
        });
    }

    const sql = `
        UPDATE Employees
        SET FirstName = ?, LastName = ?, Phone = ?, Salary = ?, StartTime = ?, EndTime = ?, HireDate = ?
        WHERE ID = ?
    `;

    conexion.query(
        sql,
        [firstName, lastName, phone, salary, startTime, endTime, hireDate, id],
        (err, result) => {

            if (err) {
                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "El teléfono ya existe"
                    });
                }

                return res.status(500).json({
                    error: "Error al actualizar empleado"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Empleado no encontrado"
                });
            }

            const sqlDeleteServices = `
                DELETE FROM EmployeeService
                WHERE EmployeeID = ?
            `;

            conexion.query(
                sqlDeleteServices,
                [id],
                (err) => {

                    if (err) {
                       console.log(err);

                        return res.status(500).json({
                           error: "Error al actualizar los servicios del empleado"
                        });
                    }

                    // Si no seleccionó servicios, terminar
                    if (!services || services.length === 0) {

                        return res.json({
                        mensaje: "Empleado actualizado correctamente"
                        });

                    }

                    const values = services.map(serviceId => [
                        id,
                        serviceId
                    ]);

                    const sqlInsertServices = `
                        INSERT INTO EmployeeService
                        (EmployeeID, ServiceID)
                        VALUES ?
                    `;

                    conexion.query(
                        sqlInsertServices,
                        [values],
                        (err) => {

                            if (err) {
                                console.log(err);

                                return res.status(500).json({
                                    error: "Error al guardar los nuevos servicios"
                                 });
                            }

                             return res.json({
                                mensaje: "Empleado actualizado correctamente"
                            });

                        }
                    );

                }
            );

        }
    );

});


// =======================
// DESACTIVAR EMPLEADO
// =======================

router.put("/deactivate/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE Employees
        SET IsActive = FALSE
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al desactivar empleado"
            });
        }

        res.json({
            mensaje: "Empleado desactivado correctamente"
        });

    });

});


// =======================
// REACTIVAR EMPLEADO
// =======================

router.put("/reactivate/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE Employees
        SET IsActive = TRUE
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al reactivar empleado"
            });

        }

        res.json({
            mensaje: "Empleado reactivado correctamente"
        });

    });

});


// =======================
// ELIMINAR EMPLEADO
// =======================

router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM Employees
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al eliminar empleado"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Empleado no encontrado"
            });
        }

        res.json({
            mensaje: "Empleado eliminado correctamente",
            id
        });

    });

});

module.exports = router;