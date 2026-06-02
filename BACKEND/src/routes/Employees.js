const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// Get Employees
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


// Get Employee By ID
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


// Post Employee
router.post("/", (req, res) => {

    const { firstName, lastName, phone, salary, startTime, endTime, hireDate } = req.body;

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

            res.status(201).json({
                mensaje: "Empleado creado correctamente",
                id: result.insertId,
                firstName,
                lastName,
                phone,
                salary,
                startTime,
                endTime,
                hireDate
            });

        }
    );

});


// Put Employee
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { firstName, lastName, phone, salary, startTime, endTime, hireDate } = req.body;

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

            res.json({
                mensaje: "Empleado actualizado correctamente",
                id,
                firstName,
                lastName,
                phone,
                salary,
                startTime,
                endTime,
                hireDate
            });

        }
    );

});


// Delete Employee
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