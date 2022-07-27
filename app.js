const express = require("express");
const { create } = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/User");
const csrf = require("csurf");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

require("dotenv").config();
const clientDb = require("./database/conecction");
const MongoStore = require("connect-mongo");
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.HEROKUPATH || "*",
    methods: ["GET", "POST"],
  })
);

app.set("trust proxy", 1)
app.use(
  session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: "secret-name-blabla",
    store: MongoStore.create({
      clientPromise: clientDb,
      dbName: process.env.DBNAME,
    }),
    cookie: {
      secure: process.env.MODE === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session({}));

// Crea la sesión
passport.serializeUser((user, done) =>
  done(null, { id: user._id, userName: user.userName })
);

//
passport.deserializeUser(async (user, done) => {
  const userDb = await User.findById(user.id);

  return done(null, { id: userDb._id, userName: userDb.userName });
});

// Confiración para hacer funcionar .hbs
const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

// Más Confiración para hacer funcionar .hbs
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

// Routes

// Middle wares, estos interceptan la petición
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use(csrf());
app.use(mongoSanitize());
app.use((req, res, next) => {
  // Cada vezz que se genere una vista, se pasará una clave
  res.locals.csrfToken = req.csrfToken();
  res.locals.messages = req.flash("messages");
  res.locals.isAuth = req.isAuthenticated();
  next();
});

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Servidor arrancado 🚀🚀🚀");
});
