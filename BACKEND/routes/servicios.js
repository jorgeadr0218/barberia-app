const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// ====================
// SERVICIOS
// ====================

// Obtener servicios
router.get("/", (req, res) => {

    const sql = "SELECT * FROM servicios";

    conexion.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al obtener servicios"
            });
        }

        res.json(result);

    });

});


// Crear servicio
router.post("/", (req, res) => {

    const { nombre } = req.body;

    // Validar campo
    if (!nombre) {
        return res.status(400).json({
            error: "El nombre es requerido"
        });
    }

    const sql = "INSERT INTO servicios (nombre) VALUES (?)";

    conexion.query(sql, [nombre], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al crear servicio"
            });
        }

        res.status(201).json({
            mensaje: "Servicio creado correctamente",
            id: result.insertId,
            nombre
        });

    });

});


// Actualizar servicios
router.put("/:id", (req, res) => {
    
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({
            error: "Nombre es requerido"
        });
    }
    const sql = `
        UPDATE servicios
        SET nombre = ?
        WHERE id = ?
    `;

    conexion.query(sql, [nombre, id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al actualizar el servicio"
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.json({
            mensaje: "Servicio actualizado correctamente",
            id,
            nombre
        })

    })

});


// Eliminar servicio
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM servicios WHERE id = ?";

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error al eliminar servicio"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.json({
            mensaje: "Servicio eliminado correctamente",
            id
        });

    });

});

module.exports = router;