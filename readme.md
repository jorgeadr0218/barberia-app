# Barbería App

Aplicación web desarrollada para la gestión de citas de una barbería. Permite a los clientes registrarse, reservar citas con sus barberos y consultar el estado de sus reservas. Además, cuenta con un panel de administración para gestionar empleados, servicios y citas.

## Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript
* Bootstrap 5
* Node.js
* Express.js
* MySQL

## Funcionalidades

### Cliente

* Registro de clientes.
* Inicio de sesión.
* Consulta de servicios disponibles.
* Reserva de citas.
* Visualización de citas realizadas.
* Cancelación de citas pendientes o confirmadas.

### Administrador

* Inicio de sesión de administrador.
* Gestión de empleados:

  * Crear empleados.
  * Editar información del empleado.
  * Asignar o modificar los servicios que realiza.
  * Activar o desactivar empleados.
* Gestión de servicios:

  * Crear servicios.
  * Editar servicios.
  * Activar o desactivar servicios.
* Gestión de citas:

  * Confirmar citas.
  * Completar citas.
  * Cancelar citas.

## Base de datos

Importar el archivo:

```
backend/Proyecto.sql
```

## Instalación

### Backend

1. Entrar a la carpeta backend:

```
cd backend
```

2. Instalar las dependencias:

```
npm install
```

3. Iniciar el servidor:

```
node src/app.js
```

## Variables de entorno

El backend utiliza un archivo `.env` para configurar las variables de entorno necesarias para la conexión con la base de datos MySQL.

Ejemplo de configuración:

DB_HOST=localhost  
DB_USER=tu_usuario  
DB_PASSWORD=tu_contraseña  
DB_NAME=BarberiaApp  
DB_PORT=3306

## Estado del proyecto

Proyecto en desarrollo y actualmente funcional.

La aplicación cuenta con las funcionalidades principales para la gestión de una barbería, incluyendo registro e inicio de sesión de clientes, reserva y administración de citas, gestión de empleados y servicios.

Próximas mejoras planificadas:

* Mejoras en el panel administrativo.
* Optimización de la experiencia del usuario y la interfaz gráfica.
* Implementación de nuevas funcionalidades según las necesidades del negocio.


### Frontend

Abrir el archivo:

```
frontend/index.html
```

## Estructura del proyecto

```
Barberia-App/
│
├── backend/
│
├── frontend/
│
└── README.md
```

## Autor

Andrés Rodríguez
Proyecto desarrollado como evidencia de aprendizaje del SENA.
