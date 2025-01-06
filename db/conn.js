const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://desiree:lKoGgmYxWZBsfZjP@cluster0.tpwg7.mongodb.net/thoughts?retryWrites=true&w=majority"; // Insira sua senha do MongoDB

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectamos com sucesso ao MongoDB Atlas!");
  } catch (err) {
    console.log(`Não foi possível conectar ao MongoDB: ${err}`);
  }
}

connectDB();

module.exports = mongoose;
