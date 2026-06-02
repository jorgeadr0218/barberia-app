const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// Register client
router.post("/register", (req, res) => {

    const { firstName, lastName, phone, passwordHash } = req.body;

    // Validación
    if (!firstName || !lastName || !phone || !passwordHash) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        INSERT INTO Clients
        (FirstName, LastName, Phone, PasswordHash)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [firstName, lastName, phone, passwordHash],
        (err, result) => {

            if (err) {

                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "El teléfono ya existe"
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


// Login client
router.post("/login", (req, res) => {

    const { phone, passwordHash } = req.body;

    // Validación
    if (!phone || !passwordHash) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        SELECT * FROM Clients
        WHERE Phone = ? AND PasswordHash = ?
    `;

    conexion.query(
        sql,
        [phone, passwordHash],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error en el login"
                });

            }

            if (result.length === 0) {
                return res.status(401).json({
                    error: "Teléfono o contraseña incorrectos"
                });
            }

            res.json({
                mensaje: "Login exitoso",
                client: {
                    id: result[0].ID,
                    firstName: result[0].FirstName,
                    lastName: result[0].LastName,
                    phone: result[0].Phone
                }
            });

        }
    );

});

module.exports = router;