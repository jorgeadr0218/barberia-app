const obtenerClients = (req, res) => {
    res.json({
        mensaje: "lista de clientes"
    });
};

module.exports = {
    obtenerClientes
};