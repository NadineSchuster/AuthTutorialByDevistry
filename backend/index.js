const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Tutorial by Devistry: https://www.youtube.com/watch?v=4_ZiJGY5F38&list=PLJM1tXwlGdaf57oUx0rIqSW668Rpo_7oU

// set up exress

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

app.use("/users", require("./routes/userRouter"));