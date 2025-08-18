export function renderHeader() {
    // Obtener el usuario logueado antes de renderizar el header
    fetch('../../server/backend/modules/fetch-user.php')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verificar en la consola
            if (!data.success) {
                console.error(data.message);
                return;
            }

            let logoSrc = "../../assets/img/logo.jpeg"; // Imagen por defecto
            let logoSrc2 = "../../assets/img/nemer.jpg"; // Imagen por defecto
            // Construir el HTML del header con el logo correspondiente
            const header = `
                <nav class="navbar is-primary" role="navigation" aria-label="main navigation" 
                    style="box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); padding: 0rem">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="#" style="font-weight: bold; font-size: 1rem;" >
                            <img src="${logoSrc}" alt="Logo" style="max-height: 50px; border-radius: 10px;"id="gestionRemitosImg">
                        </a>
                    </div>  

                    <div class="navbar-brand is-hidden">
                        <a class="navbar-item" href="#" style="font-weight: bold; font-size: 1rem;" >
                            <img src="${logoSrc2}" alt="Logo" style="max-height: 50px; border-radius: 10px;"id="gestionRemitosImgNemer">
                        </a>
                    </div>  

                    <div id="navbarMenu" class="navbar-menu">
                        <div class="navbar-start">
                            <a href="#" class="navbar-item has-text-weight-bold" id="gestionRemitosLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Gestión Remitos
                            </a>
                            <a href="#" class="navbar-item has-text-weight-bold" id="remitosPendientesLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Remitos Pendientes
                            </a>
                            <a href="#" class="navbar-item has-text-weight-bold" id="deudasEmpresasLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Deudas Empresas
                            </a>
                            <a href="excel-empresa.html" class="navbar-item has-text-weight-bold" id="excelLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;" target="_blank">
                                Excel
                            </a>
                            <a href="https://admtpoil.com.ar/gestion/client/views/tablero.html" class="navbar-item has-text-weight-bold" id="tableroLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;" target="_blank">
                                Tablero
                            </a>
                        </div>
                    </div>

                    <div class="navbar-end">
                        <div class="navbar-item">
                            <button class="button is-danger has-text-weight-bold" id="logoutButton">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </nav>
            `;

            const container = document.querySelector('.header');
            if (container) {
                container.innerHTML = header;
            }
            console.log(data.tipo_usuario); // Verificar en la consola

            // Definir logos según el tipo de usuario
            if (data.tipo_usuario === "nemer") {
                logoSrc = "../../assets/img/nemer.jpg";

                // Construir el HTML del header con el logo correspondiente
                const header = `
            <nav class="navbar is-primary" role="navigation" aria-label="main navigation" 
                style="box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); padding: 0rem">
                <div class="navbar-brand">
                    <a class="navbar-item" href="#" style="font-weight: bold; font-size: 1rem;">
                        <img src="${logoSrc}" alt="Logo" style="max-height: 50px; border-radius: 10px;">
                    </a>
                </div>  

                <div id="navbarMenu" class="navbar-menu">
                    <div class="navbar-start">
                        <a href="#" class="navbar-item has-text-weight-bold" id="gestionRemitosLink" 
                            style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                            Gestión Remitos
                        </a>
                        <a href="#" class="navbar-item has-text-weight-bold" id="remitosPendientesLink" 
                            style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                            Remitos Pendientes
                        </a>
                       
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <button class="button is-danger has-text-weight-bold" id="logoutButton">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>
        `;

                const container = document.querySelector('.header');
                if (container) {
                    container.innerHTML = header;
                }
            } else if (data.tipo_usuario === "abasto") {
                logoSrc = "../../assets/img/abasto.jpg";
                const header = `
                <nav class="navbar is-primary" role="navigation" aria-label="main navigation" 
                    style="box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); padding: 0rem">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="#" style="font-weight: bold; font-size: 1rem;">
                            <img src="${logoSrc}" alt="Abasto" style="max-height: 50px; border-radius: 10px;">
                        </a>
                    </div>  
    
                    <div id="navbarMenu" class="navbar-menu">
                        <div class="navbar-start">
                            <a href="#" class="navbar-item has-text-weight-bold" id="gestionRemitosLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Gestión Remitos
                            </a>
                            <a href="#" class="navbar-item has-text-weight-bold" id="remitosPendientesLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Remitos Pendientes
                            </a>
                             <a href="https://admtpoil.com.ar/gestion/client/views/tablero.html" class="navbar-item has-text-weight-bold" id="tableroLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;" target="_blank">
                                Tablero
                        </a>
                        </div>
                    </div>

                    <div class="navbar-end">
                        <div class="navbar-item">
                            <button class="button is-danger has-text-weight-bold" id="logoutButton">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </nav>
            `;

                const container = document.querySelector('.header');
                if (container) {
                    container.innerHTML = header;
                }
            } else if (data.tipo_usuario === "transpetrone") {
                logoSrc = "../../assets/img/transpetronesa.jpeg";
                const header = `
                <nav class="navbar is-primary" role="navigation" aria-label="main navigation" 
                    style="box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); padding: 0rem">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="#" style="font-weight: bold; font-size: 1rem;">
                            <img src="${logoSrc}" alt="Logo" style="max-height: 50px; border-radius: 10px;">
                        </a>
                    </div>  
    
                    <div id="navbarMenu" class="navbar-menu">
                        <div class="navbar-start">
                            <a href="#" class="navbar-item has-text-weight-bold" id="gestionRemitosLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Gestión Remitos
                            </a>
                            <a href="#" class="navbar-item has-text-weight-bold" id="remitosPendientesLink" 
                                style="font-size: 1.3rem; padding: 1rem; transition: background-color 0.3s;">
                                Remitos Pendientes
                            </a>
                        </div>
                    </div>
    
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <button class="button is-danger has-text-weight-bold" id="logoutButton">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </nav>
            `;

                const container = document.querySelector('.header');
                if (container) {
                    container.innerHTML = header;
                }
            }


            // Evento para cerrar sesión sin que descargue el archivo PHP
            document.getElementById('logoutButton').addEventListener('click', () => {
                fetch('../../server/backend/logout.php', { method: 'GET' })
                    .then(() => window.location.href = '../../index.php')
                    .catch(error => console.error('Error al cerrar sesión:', error));
            });
        })
        .catch(error => console.error('Error al obtener el usuario:', error));
}

