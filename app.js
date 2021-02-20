const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./view/index.html"));
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Require Range Header");
  }

  const videoPath = "developers.mp4";
  const videoSize = fs.statSync("developers.mp4").size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
