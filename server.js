const express = require('express');
require('dotenv').config()
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { engine } = require('express-handlebars');
const randomData = require('./faker');
const router = require('./routes/router');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const PORT = process.env.PORT || 8080;
const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_ATLAS_SRV,
        mongoOptions: advancedOptions,
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(router);
app.use(express.static('views'));
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');


io.on('connection', async socket => {
    console.log('Conexión establecida');

    const data = randomData();
    io.sockets.emit('products', data);
    socket.on('product', async data => {
        io.sockets.emit('products', data);
    })
});

const server = httpserver.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', () => console.log(`Error: ${err}`));