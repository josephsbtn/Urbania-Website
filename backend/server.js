const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");\

const multer = require('multer');

const server = http.createServer(app);
const WSserver = WebSocket.Server({ server });

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

