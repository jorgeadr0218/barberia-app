const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// ====================
// Citas
// ====================

// Obtener citas
router.get("/", (req, res) => {

    const sql = "SELECT * FROM citas";

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


// Crear cita
router.post("/", (req, res) => {

    const { cliente_id, empleado_id, servicio_id, fecha } = req.body;

    // Validación
    if (!cliente_id || !empleado_id || !servicio_id || !fecha) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        INSERT INTO citas (cliente_id, empleado_id, servicio_id, fecha)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(sql, [cliente_id, empleado_id, servicio_id, fecha], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al crear la cita"
            });
        }

        res.status(201).json({
            mensaje: "Cita creada correctamente",
            id: result.insertId,
            cliente_id,
            empleado_id,
            servicio_id,
            fecha
        });

    });

});


// Actualizar cita
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { cliente_id, empleado_id, servicio_id, fecha } = req.body;

    // Validación
    if (!cliente_id || !empleado_id || !servicio_id || !fecha) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        UPDATE citas
        SET cliente_id = ?, empleado_id = ?, servicio_id = ?, fecha = ?
        WHERE id = ?
    `;

    conexion.query(sql, [cliente_id, empleado_id, servicio_id, fecha, id], (err, result) => {

        if (err) {
            console.log(err);

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
            cliente_id,
            empleado_id,
            servicio_id,
            fecha
        });

    });

});


// Eliminar cita
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM citas WHERE id = ?";

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