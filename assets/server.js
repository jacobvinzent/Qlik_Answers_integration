import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from 'path';
import { auth as qlikAuth, users as qlikUsers } from "@qlik/api";
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();
app.use(express.static('src'));
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {

  res.sendFile(__dirname + "/src/assistant.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}! Go to http://localhost:${PORT}`);
});