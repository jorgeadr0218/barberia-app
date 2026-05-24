const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// ====================
// CLIENTES
// ====================

// Obtener clientes
router.get("/", (req, res) => {

    const sql = "SELECT * FROM clientes";

    conexion.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al obtener clientes"
            });
        }

        res.json(result);

    });

});


// Crear cliente
router.post("/", (req, res) => {

    const { nombre, telefono } = req.body;

    // Validacion
    if (!nombre || !telefono) {
        return res.status(400).json({
            error: "Nombre y teléfono son requeridos"
        });
    }

    const sql =
        "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)";

    conexion.query(sql, [nombre, telefono], (err, result) => {

        if (err) {
            console.log(err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    error: "El teléfono ya existe"
                });
            }

            return res.status(500).json({
                error: "Error al crear cliente"
            });
        }

        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            id: result.insertId,
            nombre,
            telefono
        });

    });

});


// Actualizar cliente
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { nombre, telefono } = req.body;

    if (!nombre || !telefono) {
        return res.status(400).json({
            error: "Nombre y teléfono son requeridos"
        });
    }

    const sql = `
        UPDATE clientes 
        SET nombre = ?, telefono = ?
        WHERE id = ?
    `;

    conexion.query(sql, [nombre, telefono, id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al actualizar cliente"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json({
            mensaje: "Cliente actualizado correctamente",
            id,
            nombre,
            telefono
        });

    });

});


// Eliminar cliente
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM clientes WHERE id = ?";

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al eliminar cliente"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json({
            mensaje: "Cliente eliminado correctamente",
            id
        });

    });

});

module.exports = router;