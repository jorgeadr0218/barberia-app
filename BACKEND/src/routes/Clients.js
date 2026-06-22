const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");

// ======================
// OBTENER CLIENTES
// ======================

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


// =============================
// OBTENER CLIENTES POR ID
// =============================

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

        // Cliente no encontrado
        if (result.length === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json(result[0]);

    });

});


// ======================
// REGISTRAR CLIENTE
// ======================

router.post("/", (req, res) => {

    const { firstName, lastName, phone } = req.body;


    // Validación de campos obligatorios
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

            
            // Registro exitoso
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


// ======================
// ACTUALIZAR CLIENTE
// ======================

router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;

    // Validación de campos obligatorios
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

            // Cliente no encontrado
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Cliente no encontrado"
                });
            }

            // Actualización exitosa
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



// ======================
// ELIMINAR CLIENTE
// ======================

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

        // Cliente no encontrado
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        // Eliminación exitosa
        res.json({
            mensaje: "Cliente eliminado correctamente",
            id
        });

    });

});


// ======================
// RECUPERAR CONTRASEÑA
// ======================

router.put("/forgot-password", (req, res) => {

    const { phone, passwordHash } = req.body;

    const sql = `
        UPDATE Clients
        SET PasswordHash = ?
        WHERE Phone = ?
    `;

    conexion.query(
        sql,
        [passwordHash, phone],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error al actualizar contraseña"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    error: "Cliente no encontrado"
                });

            }

            res.json({
                mensaje: "Contraseña actualizada correctamente"
            });

        }
    );

});

module.exports = router;