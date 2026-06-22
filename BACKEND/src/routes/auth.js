const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// ======================
// REGISTRAR CLIENTE
// ======================

router.post("/register", (req, res) => {

    const { firstName, lastName, phone, passwordHash } = req.body;

    // Validación de campos obligatorios
    if (!firstName || !phone || !passwordHash) {
        return res.status(400).json({
            error: "Nombre, teléfono y contraseña son requeridos"
        });
    }

    const sql = `
        INSERT INTO Clients
        (FirstName, LastName, Phone, PasswordHash)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [firstName, lastName || null, phone, passwordHash],
        (err, result) => {

            if (err) {

                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "El teléfono ya está registrado"
                    });
                }

                return res.status(500).json({
                    error: "Error al registrar cliente"
                });

            }

            res.status(201).json({
                mensaje: "Registro exitoso",
                id: result.insertId,
                firstName,
                lastName,
                phone
            });

        }
    );

});


// ======================
// INICIAR SESION DE CLIENTE
// ======================

router.post("/login", (req, res) => {

    const { phone, passwordHash } = req.body;

    // Validación de campos obligatorios
    if (!phone || !passwordHash) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        SELECT *
        FROM Clients
        WHERE Phone = ?
    `;

    conexion.query(
        sql,
        [phone],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error en el login"
                });

            }

            // Cliente no encontrado
            if (result.length === 0) {
                return res.status(401).json({
                    error: "Teléfono no registrado"
                });
            }

            // Cliente encontrado
            const client = result[0];

            // Verificar si la cuenta está bloqueada
            if (client.Attempts === 0) {
                return res.status(403).json({
                    error: "Cuenta bloqueada. Has agotado tus intentos"
                });
            }

   
if (passwordHash !== client.PasswordHash) {

    const attemptsLeft = client.Attempts - 1;

    const sqlUpdate = `
        UPDATE Clients
        SET Attempts = ?
        WHERE ID = ?
    `;

    return conexion.query(
        sqlUpdate,
        [attemptsLeft, client.ID],
        (err) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Error al actualizar intentos"
                });
            }

            if (attemptsLeft === 0) {
                return res.status(403).json({
                    error: "Cuenta bloqueada. Has agotado tus intentos"
                });
            }

            return res.status(401).json({
                error: `Contraseña incorrecta. Te quedan ${attemptsLeft} intentos`
            });

        }
    );
}           


const sqlReset = `
    UPDATE Clients
    SET Attempts = 3
    WHERE ID = ?
`;

conexion.query(
    sqlReset,
    [client.ID],
    (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Error al reiniciar intentos"
            });
        }

        // Login exitoso
        return res.json({
            mensaje: "Login exitoso",
            client: {
                id: client.ID,
                firstName: client.FirstName,
                lastName: client.LastName,
                phone: client.Phone
            }
        });

    }
);

        }
    );

});


// ======================
// RECUPERAR CONTRASEÑA
// ======================

router.post("/forgot-password", (req, res) => {

    const { phone, newPasswordHash } = req.body;

    // Validar campos
    if (!phone || !newPasswordHash) {
        return res.status(400).json({
            error: "Teléfono y nueva contraseña son requeridos"
        });
    }

    const sql = `
        UPDATE Clients
        SET PasswordHash = ?, Attempts = 3
        WHERE Phone = ?
    `;

    conexion.query(
        sql,
        [newPasswordHash, phone],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Error al recuperar contraseña"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Teléfono no encontrado"
                });
            }

            return res.json({
                mensaje: "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
            });

        }
    );

});


module.exports = router;