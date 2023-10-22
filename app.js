const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");

const catchAsync = require("./controllers/services/catchAsync");
const genError = require("./controllers/errors/errorHandler");
const { logger } = require("./controllers/services/logger");

const app = express();

app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this ip, please try again in an hour",
});
app.use("/", limiter);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use((req, res, next) => {
    logger.info(
        "Incoming request \nmethod %o, \npath %o, \nbody %o, \nparams %o, \nquery %o, \nheaders %o",
        req.method,
        req.originalUrl,
        req.body,
        req.params,
        req.query,
        req.headers
    );
    next();
});

app.all("*", (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(genError);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ACCESS_KEY}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then((result) => {
        app.listen(process.env.PORT || 3000);
        logger.info("connected");
    })
    .catch((err) => logger.error(err));
