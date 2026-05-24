const express = require("express");
const cors = require("cors");

const clientesRoutes = require("./routes/clientes");
const empleadosRoutes = require("./routes/empleados");
const serviciosRoutes = require("./routes/servicios");
const empleado_servicioRoutes = require("./routes/empleado_servicio");
const citasRoutes = require("./routes/citas");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/clientes", clientesRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/empleado_servicio", empleado_servicioRoutes);
app.use("/api/citas", citasRoutes);

// Iniciar servidor
app.listen(3000, () => {
    console.log("servidor backend corriendo en http://localhost:3000");
});