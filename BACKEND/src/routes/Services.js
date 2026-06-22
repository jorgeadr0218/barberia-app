const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// ======================
// OBTENER SERVICIOS
// ======================

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM Services
    `;

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


// =============================
// OBTENER SERVICIOS ACTIVOS
// =============================

router.get("/active", (req, res) => {

    const sql = `
        SELECT *
        FROM Services
        WHERE IsActive = 1
    `;

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


// ============================
// OBTENER SERVICIO POR ID
// ============================

router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM Services
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al obtener servicio"
            });

        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.json(result[0]);

    });

});


// ======================
// CREAR SERVICIO
// ======================

router.post("/", (req, res) => {

    const {
        name,
        description,
        imageUrl,
        durationMinutes,
        basePrice
    } = req.body;

    // Validación
    if (!name || !durationMinutes || !basePrice) {
        return res.status(400).json({
            error: "Todos los campos requeridos deben estar completos"
        });
    }

    const sql = `
        INSERT INTO Services
        (
            Name,
            Description,
            ImageUrl,
            DurationMinutes,
            BasePrice
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [
            name,
            description,
            imageUrl,
            durationMinutes,
            basePrice
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error al crear servicio"
                });

            }

            res.status(201).json({
                mensaje: "Servicio creado correctamente",
                id: result.insertId,
                name,
                description,
                imageUrl,
                durationMinutes,
                basePrice
            });

        }
    );

});


// ======================
// DESACTIVAR SERVICIO
// ======================

router.put("/deactivate/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE Services
        SET IsActive = FALSE
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al desactivar servicio"
            });

        }

        res.json({
            mensaje: "Servicio desactivado correctamente"
        });

    });

});


// ======================
// REACTIVAR SERVICIO
// ======================

router.put("/reactivate/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE Services
        SET IsActive = TRUE
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Error al reactivar servicio"
            });

        }

        res.json({
            mensaje: "Servicio reactivado correctamente"
        });

    });

});


// ======================
// ACTUALIZAR SERVICIO
// ======================

router.put("/:id", (req, res) => {

    const { id } = req.params;

    const {
        name,
        description,
        imageUrl,
        durationMinutes,
        basePrice
    } = req.body;

    // Validación
    if (!name || !durationMinutes || !basePrice) {
        return res.status(400).json({
            error: "Todos los campos requeridos deben estar completos"
        });
    }

    const sql = `
        UPDATE Services
        SET
            Name = ?,
            Description = ?,
            ImageUrl = ?,
            DurationMinutes = ?,
            BasePrice = ?
        WHERE ID = ?
    `;

    conexion.query(
        sql,
        [
            name,
            description,
            imageUrl,
            durationMinutes,
            basePrice,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error al actualizar servicio"
                });

            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Servicio no encontrado"
                });
            }

            res.json({
                mensaje: "Servicio actualizado correctamente",
                id,
                name,
                description,
                imageUrl,
                durationMinutes,
                basePrice
            });

        }
    );

});


// ======================
// ELIMINAR SERVICIO
// ======================

router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE
        FROM Services
        WHERE ID = ?
    `;

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