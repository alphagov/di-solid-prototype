import express from "express";
import { RequestHandler, ErrorRequestHandler } from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import nunjucks from "nunjucks";
import cookieSession from "cookie-session";

import { getPort, getSessionKeys } from "./config"

import { indexRouter } from "./routes/index";
import { loginRouter } from "./routes/login";
import { infoRouter } from "./routes/info";
import { accessRouter } from "./routes/access";
import { identityRouter } from "./routes/identity";
import { Environment } from "nunjucks";
import { accountRouter } from "./routes/account";

import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";

const app: express.Application = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use cookie-session to store session in a client side cookie
app.use(
  cookieSession({
    name: "session",
    keys: getSessionKeys(),
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/info', infoRouter);
app.use('/access-logs', accessRouter);
app.use('/identity', identityRouter);
app.use('/account', accountRouter);

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "en",
    // lng: "en",
    preload: ["en","cy"],
    supportedLngs: ["en", "cy"],
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json")
    },
    detection: {
      lookupCookie: "lng",
      lookupQuerystring: "lng",
      order: ["querystring", "header", "cookie"],
      caches: ["cookie"],
      ignoreCase: true,
      cookieSecure: true,
    },
  });

app.use(i18nextMiddleware.handle(i18next));

function configureNunjucks(
  app: express.Application,
): Environment {
  const nunjucksEnv: nunjucks.Environment = nunjucks.configure(
    ['dist/views', 'node_modules/govuk-frontend/'],
    {
      autoescape:  true,
      express:  app
    });
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    nunjucksEnv.addFilter("translate", function (key: string, options?: any) {
      const translate = i18next.getFixedT("en");
      return translate(key, options);
    });

    return nunjucksEnv;
  }

  configureNunjucks(app)

  app.set("view engine", "njk");

  app.use('/assets', express.static(path.resolve('node_modules/govuk-frontend/govuk/assets')))

  // Set up server

  // catch 404 and forward to error handler
  const notFoundHandler: RequestHandler = (req, res, next) => {
    next(createError(404));
  };
  app.use(notFoundHandler);

  // error handler
  const errorHandler: ErrorRequestHandler = (err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  };
  app.use(errorHandler);
  const port = getPort();
  app.set('port', port);
  const server = http.createServer(app);
  server.listen(port);
