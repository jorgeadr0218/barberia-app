const servicesContainer =
    document.getElementById("servicesContainer");

const images = {

    1: [
        "../assets/imagenes/corte1.png",
        "../assets/imagenes/corte2.png"
    ],

    2: [
        "../assets/imagenes/corte3.png",
        "../assets/imagenes/corte4.png"
    ],

    3: [
        "../assets/imagenes/corte5.png",
        "../assets/imagenes/corte6.png"
    ],

    4: [
        "../assets/imagenes/corte7.png",
        "../assets/imagenes/corte8.png"
    ],

    5: [
        "../assets/imagenes/corte9.png",
        "../assets/imagenes/corte10.png"
    ],

    6: [
        "../assets/imagenes/corte11.png",
        "../assets/imagenes/corte12.png"
    ],

    7: [
        "../assets/imagenes/corte13.png",
        "../assets/imagenes/corte14.png"
    ],

    8: [
        "../assets/imagenes/corte15.png",
        "../assets/imagenes/corte16.png"
    ],

    9: [
        "../assets/imagenes/corte17.png",
        "../assets/imagenes/corte18.png"
    ]

};

const defaultImages = [
    "../assets/imagenes/default-service.png",
    "../assets/imagenes/default-service.png"
];

async function loadServices() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/services"
        );

        const services = await response.json();

        servicesContainer.innerHTML = "";

        const activeServices =
            services.filter(service => service.IsActive);

        activeServices.forEach(service => {

            const serviceImages =
                images[service.ID] || defaultImages;

            servicesContainer.innerHTML += `

                <div class="barber-card">

                    <div class="barber-img-group">

                        <img src="${serviceImages[0]}">

                        <img src="${serviceImages[1]}">

                    </div>

                    <div class="barber-card-title">
                        ${service.Name}
                    </div>

                    <div class="barber-card-desc">
                        ${service.Description || ""}
                    </div>

                    <div class="barber-info">

                        <span class="barber-price">
                            $${Number(service.BasePrice).toLocaleString()}
                        </span>

                        <span class="barber-rating">
                            ⭐ 4.7
                        </span>

                    </div>

                    <a
                        href="reservar-cita.html?serviceid=${service.ID}#formulario"
                        class="barber-btn"
                    >
                        Reservar cita
                    </a>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Error al cargar servicios:",
            error
        );

    }

}

loadServices();