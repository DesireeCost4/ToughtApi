const express = require("express");
const handlebars = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const app = express();
const conn = require("./db/conn");
const bodyParser = require("body-parser");
const cors = require("cors");

//models
const Tought = require("./models/Tought");
const User = require("./models/User");
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");
const ToughtController = require("./controllers/ToughtsController");
const { checkAuth } = require("./helpers/auth");

app.use(
  cors({
    origin: ["http://localhost:4200", "https://thought-front-end.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos aceitos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
    credentials: true, // Para cookies ou autenticação de sessão, se necessário
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200); // Responde OK
});

app.use(bodyParser.json()); // Para parsear o corpo das requisições

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
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      path: "/",
    },
  })
);

//msg flash
app.use(flash());
//public
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Pensamentos");
});

app.use("/toughts", checkAuth, toughtsRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
