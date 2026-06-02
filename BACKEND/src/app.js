require("dotenv").config();

const express = require("express");
const cors = require("cors");

const clientsRoutes = require("./routes/clients");
const adminsRoutes = require("./routes/admins");
const employeesRoutes = require("./routes/employees");
const servicesRoutes = require("./routes/Services");
const employeeServiceRoutes = require("./routes/EmployeeService");
const appointmentsRoutes = require("./routes/appointments");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/clients", clientsRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/employeeService", employeeServiceRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/auth", authRoutes);

// Iniciar servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${process.env.PORT}`);
});