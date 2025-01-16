const express = require("express");
const handlebars = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const app = express();
const conn = require("./db/conn");
const bodyParser = require("body-parser");
const cors = require("cors");

const Tought = require("./models/Tought");
const User = require("./models/User");
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");
const ToughtController = require("./controllers/ToughtsController");
const { checkAuth } = require("./helpers/auth");

app.use(
  cors({
    origin: "https://thought-front-end.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(bodyParser.json());

app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".handlebars",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);

app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: true,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: true,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      sameSite: "none",
      path: "/",
    },
  })
);

app.use(flash());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Pensamentos");
});

app.use("/toughts", checkAuth, toughtsRoutes);
app.use("/auth", authRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
