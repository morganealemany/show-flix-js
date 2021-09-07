const app = {

    appRoot: document.getElementById('app-root'),
    apiUrl: 'http://localhost:8080/api',

    /**
     * Initialisation de l'application
     */
    init: function() {
        // Page d'accueil
        app.homePage();

        app.handleRouteEventListerner();
    },

    handleRouteEventListerner: function() {
        let allRoutes = document.querySelectorAll("[data-page]");
        allRoutes.forEach((route) => {
            route.addEventListener('click', (event) => {
                let pageMethod = event.target.dataset.page;
                if (pageMethod) {
                    // On affiche la route (appel de la fonction)
                    eval(`${pageMethod}`)();
                } else {
                    alert("la route demandée n'existe pas");
                }
            });
        });
    },

    homePage: function() {
        let homepageTpl = `
            <div class="py-5 text-center container text-dark" style="height:100%">
                <div class="row py-lg-5">
                    <div class="col-lg-6 col-md-8 mx-auto">
                        <h1 class="display-4">Bienvenue sur O'flix</h1>
                        <p>Regardez des séries TV <br /> et des films en ligne</p>
                        <p>
                        <a class="btn btn-danger btn-lg" href="#" data-page="app.tvshowPage" role="button">Commencez-maintenant</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        app.render(homepageTpl);
    },

    tvshowPage: function() {
        let appToken = sessionStorage.getItem('appToken');
        if (appToken) {
            fetch(`${app.apiUrl}/v1/tvshows`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${appToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then((resp) => resp.json()) // On transforme la réponse en json
                .then(function(data) {
                    // On récupère les datas
                    console.log('tvshowPage', data);

                })
                .catch(function(error) {
                    // Une erreur s'est produite
                    console.log("ERROR !", error);
                    app.loginPage();
                });
        } else {
            app.loginPage();
        }

    },

    /**
     * Page de connexion permettant une récupération d'un token JWT
     */
    loginPage: function() {
        let loginTpl = `
        <div class="container">
            <form onsubmit="app.doLogin(event)" method="post">
                <div class="form-group">
                    <label for="inputEmail">Email</label>
                    <input type="email" class="form-control" id="inputEmail" name="email" aria-describedby="emailHelp">
                </div>
                <div class="form-group">
                    <label for="inputPassword">Password</label>
                    <input type="password" class="form-control" name="password" id="inputPassword">
                </div>
                <button type="submit" class="btn btn-danger btn-block">Connexion</button>
            </form>            
        </div>
    `;
        app.render(loginTpl);
    },


    doLogin: function(event) {
        let form = event.target;
        fetch(`${app.apiUrl}/login_check`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: form.email.value,
                    password: form.password.value
                })
            })
            .then((resp) => resp.json()) // On transforme la réponse en json
            .then(function(data) {
                // On récupère les datas
                console.log(data);
            })
            .catch(function(error) {
                // Une erreur s'est produite
                console.log(error);
            });

        event.preventDefault();
    },

    render: function(template) {
        app.appRoot.innerHTML = template;
    },
};

// Chargement de l'application
window.addEventListener("load", app.init);