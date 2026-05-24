const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// ====================
// EMPLEADOS
// ====================

// Obtener empleados
router.get("/", (req, res) => {

    const sql = "SELECT * FROM empleados";

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


// Crear empleado
router.post("/", (req, res) => {

    const { nombre } = req.body;

    // Validacion
    if (!nombre) {
        return res.status(400).json({
            error: "El nombre es requerido"
        });
    }

    const sql =
        "INSERT INTO empleados (nombre) VALUES (?)";

    conexion.query(sql, [nombre], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al crear empleado"
            });
        }

        res.status(201).json({
            mensaje: "Empleado creado correctamente",
            id: result.insertId,
            nombre
        });

    });

});


// Actualizar empleado
router.put("/:id", (req, res) => {
    
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({
            error: "Nombre es requerido"
        });
    }
    const sql = `
        UPDATE empleados
        SET nombre = ?
        WHERE id = ?
    `;

    conexion.query(sql, [nombre, id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al actualizar el empleado"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Empleado no encontrado"
            });
        }

        res.json({
            mensaje: "Empleado actualizado correctamente",
            id,
            nombre
        })

    })

});


// Eliminar empleado
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM empleados WHERE id = ?";

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