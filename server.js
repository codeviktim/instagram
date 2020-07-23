const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

const db = require("./config/keys").mongoURI;

const users = require("./routes/api/users");

//express body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/users", users);

//connections
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
