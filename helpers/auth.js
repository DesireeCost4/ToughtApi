const jwt = require("jsonwebtoken");

module.exports.checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "seuSegredoAqui");
    req.userId = decoded.userId;
    console.log("Token decodificado no middleware:", decoded);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
