const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// ====================
// EMPLEADO_SERVICIO
// ====================

// Obtener relaciones
router.get("/", (req, res) => {

    const sql = "SELECT * FROM empleado_servicio";

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


// Asignar servicio a empleado
router.post("/", (req, res) => {

    const { empleado_id, servicio_id } = req.body;

    // Validación
    if (!empleado_id || !servicio_id) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        INSERT INTO empleado_servicio (empleado_id, servicio_id)
        VALUES (?, ?)
    `;

    conexion.query(sql, [empleado_id, servicio_id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al asignar servicio al empleado"
            });
        }

        res.status(201).json({
            mensaje: "Servicio asignado correctamente",
            id: result.insertId,
            empleado_id,
            servicio_id
        });

    });

});


// Actualizar relación
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { empleado_id, servicio_id } = req.body;

    // Validación
    if (!empleado_id || !servicio_id) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        UPDATE empleado_servicio
        SET empleado_id = ?, servicio_id = ?
        WHERE id = ?
    `;

    conexion.query(sql, [empleado_id, servicio_id, id], (err, result) => {

        if (err) {
            console.log(err);

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
            empleado_id,
            servicio_id
        });

    });

});


// Eliminar relación
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM empleado_servicio WHERE id = ?";

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