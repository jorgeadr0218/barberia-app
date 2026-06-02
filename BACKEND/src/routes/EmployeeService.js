const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// Get Relations
router.get("/", (req, res) => {

    const sql = `
        SELECT
            EmployeeService.ID,
            CONCAT(Employees.FirstName, ' ', Employees.LastName) AS employee,
            Services.Name AS service
        FROM EmployeeService
        INNER JOIN Employees
            ON EmployeeService.EmployeeID = Employees.ID
        INNER JOIN Services
            ON EmployeeService.ServiceID = Services.ID
    `;

    conexion.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener relaciones"
            });
        }

        res.json(result);

    });

});


// Get Relation By ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            EmployeeService.ID,
            CONCAT(Employees.FirstName, ' ', Employees.LastName) AS employee,
            Services.Name AS service
        FROM EmployeeService
        INNER JOIN Employees
            ON EmployeeService.EmployeeID = Employees.ID
        INNER JOIN Services
            ON EmployeeService.ServiceID = Services.ID
        WHERE EmployeeService.ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener relación"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Relación no encontrada"
            });
        }

        res.json(result[0]);

    });

});


// Assign Service To Employee
router.post("/", (req, res) => {

    const { employeeid, serviceid } = req.body;

    // Validación
    if (!employeeid || !serviceid) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        INSERT INTO EmployeeService
        (EmployeeID, ServiceID)
        VALUES (?, ?)
    `;

    conexion.query(
        sql,
        [employeeid, serviceid],
        (err, result) => {

            if (err) {
                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "Este servicio ya está asignado a este empleado"
                    });
                }

                return res.status(500).json({
                    error: "Error al asignar servicio al empleado"
                });
            }

            res.status(201).json({
                mensaje: "Servicio asignado correctamente",
                id: result.insertId,
                employeeid,
                serviceid
            });

        }
    );

});


// Update Relation
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { employeeid, serviceid } = req.body;

    // Validación
    if (!employeeid || !serviceid) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        UPDATE EmployeeService
        SET EmployeeID = ?, ServiceID = ?
        WHERE ID = ?
    `;

    conexion.query(
        sql,
        [employeeid, serviceid, id],
        (err, result) => {

            if (err) {
                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "Este servicio ya está asignado a este empleado"
                    });
                }

                return res.status(500).json({
                    error: "Error al actualizar relación"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Relación no encontrada"
                });
            }

            res.json({
                mensaje: "Relación actualizada correctamente",
                id,
                employeeid,
                serviceid
            });

        }
    );

});


// Delete Relation
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM EmployeeService
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al eliminar relación"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Relación no encontrada"
            });
        }

        res.json({
            mensaje: "Relación eliminada correctamente",
            id
        });

    });

});

module.exports = router;