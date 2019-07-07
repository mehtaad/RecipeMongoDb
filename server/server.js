const express       = require('express'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    errorhandler    = require('errorhandler'),
    csrf            = require('csurf'),
    morgan          = require('morgan'),
    favicon         = require('serve-favicon'),
    path            = require('path');
    router          = require('./routes/router'),
    database        = require('./lib/database'),
    seeder          = require('./lib/dbSeeder'),
    app             = express(),
    port            = 3000;

class Server {

    constructor() {
        this.initExpressMiddleWare();
        this.initDbSeeder();
        this.initRoutes();
        this.start();
    }

    start() {
        app.listen(port, (err) => {
            console.log('[%s] Listening on http://localhost:%d', process.env.NODE_ENV, port);
        });
    }

    

    initExpressMiddleWare() {
        var rootPath = path.normalize(__dirname + '/../');
        app.use(express.static(rootPath + '/dist'));
        
        app.use(morgan('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(errorhandler());
        app.use(cookieParser());
        app.use(csrf({ cookie: true }));

        app.use((req, res, next) => {
            let csrfToken = req.csrfToken();
            res.locals._csrf = csrfToken;
            res.cookie('XSRF-TOKEN', csrfToken);
            next();
        });

        process.on('uncaughtException', (err) => {
            if (err) console.log(err, err.stack);
        });
    }

    
    initDbSeeder() {
        database.open(() => {
            //Set NODE_ENV to 'development' and uncomment the following if to only run
            //the seeder when in dev mode
            //if (process.env.NODE_ENV === 'development') {
            //  seeder.init();
            //} 
            seeder.init();
        });
    }

    initRoutes() {
        router.load(app, './controllers');

        // redirect all others to the index (HTML5 history)
        app.all('/*', (req, res) => {
            res.sendFile(__dirname + '/../dist/index.html');
        });
    }

}

let server = new Server();