const { createLogger, format, config, transports } = require("winston");
const { combine, splat, json, timestamp, errors, cli, printf } = format;

const myFormat = printf(({ level, timestamp, message, ...v }) => {
    return `[${level}]: <${timestamp}> ${message}\n${
        Object.keys(v).length ? JSON.stringify(v, null, 2) : ""
    }`;
});

const logTransports = [];
try {
    const console = new transports.Console({
        format: combine(cli(), myFormat),
    });
    logTransports.push(console);
    exports.logger = createLogger({
        level: "debug",
        levels: config.npm.levels,
        format: combine(
            timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            errors({ stack: true }),
            splat(),
            json({ space: 2 })
        ),
        transports: logTransports,
    });
} catch (error) {
    console.error(error);
    exports.logger = console;
}
