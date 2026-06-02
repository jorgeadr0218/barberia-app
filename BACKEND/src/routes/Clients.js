const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// Get Clients
router.get("/", (req, res) => {

    const sql = `
        SELECT * FROM Clients
    `;

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


// Get Client by ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT * FROM Clients
        WHERE ID = ?
    `;

    conexion.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al obtener cliente"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json(result[0]);

    });

});


// Post Client
router.post("/", (req, res) => {

    const { firstName, lastName, phone } = req.body;

    if (!firstName) {
        return res.status(400).json({
            error: "El nombre es requerido"
        });
    }

    const sql = `
        INSERT INTO Clients
        (FirstName, LastName, Phone)
        VALUES (?, ?, ?)
    `;

    conexion.query(
        sql,
        [firstName, lastName || null, phone || null],
        (err, result) => {

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
                firstName,
                lastName,
                phone
            });

        }
    );

});


// Put Client
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;

    if (!firstName) {
        return res.status(400).json({
            error: "El nombre es requerido"
        });
    }

    const sql = `
        UPDATE Clients
        SET FirstName = ?, LastName = ?, Phone = ?
        WHERE ID = ?
    `;

    conexion.query(
        sql,
        [firstName, lastName || null, phone || null, id],
        (err, result) => {

            if (err) {

                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "El teléfono ya existe"
                    });
                }

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
                firstName,
                lastName,
                phone
            });

        }
    );

});


// Delete Client
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM Clients
        WHERE ID = ?
    `;

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