const express = require("express");
const router = express.Router();

const conexion = require("../database/conexion");


// Login admin
router.post("/", (req, res) => {

    const { username, passwordHash } = req.body;

    // Validación
    if (!username || !passwordHash) {
        return res.status(400).json({
            error: "Todos los campos son requeridos"
        });
    }

    const sql = `
        SELECT * FROM Admins
        WHERE Username = ? AND PasswordHash = ?
    `;

    conexion.query(
        sql,
        [username, passwordHash],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error en el login"
                });

            }

            if (result.length === 0) {
                return res.status(401).json({
                    error: "Credenciales incorrectas"
                });
            }

            res.json({
                mensaje: "Login exitoso",
                admin: {
                    id: result[0].ID,
                    username: result[0].Username
                }
            });

        }
    );

});

module.exports = router;