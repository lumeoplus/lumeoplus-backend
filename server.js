const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));
app.use(express.static("./"));

const MOVIES_FILE = path.join(__dirname, "movies.json");
const SERIES_FILE = path.join(__dirname, "series.json");
const TRAILERS_FILE = path.join(__dirname, "trailers.json");

function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading file:", filePath, err);
    return [];
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// MOVIES ENDPOINTS
app.get("/api/movies", (req, res) => {
  const movies = readJsonFile(MOVIES_FILE);
  res.json(movies);
});

app.get("/api/movies/:id", (req, res) => {
  const movies = readJsonFile(MOVIES_FILE);
  const movie = movies.find(m => String(m.id) === String(req.params.id));
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Film nebyl nalezen" });
  }
});

app.post("/api/movies", (req, res) => {
  const movies = readJsonFile(MOVIES_FILE);
  const movie = req.body;
  movie.id = movie.id || Date.now();
  movies.push(movie);
  writeJsonFile(MOVIES_FILE, movies);
  res.json({ success: true, movie: movie });
});

app.put("/api/movies/:id", (req, res) => {
  const movies = readJsonFile(MOVIES_FILE);
  const index = movies.findIndex(m => String(m.id) === String(req.params.id));
  if (index !== -1) {
    movies[index] = { ...movies[index], ...req.body };
    writeJsonFile(MOVIES_FILE, movies);
    res.json({ success: true, movie: movies[index] });
  } else {
    res.status(404).json({ error: "Film nebyl nalezen" });
  }
});

app.delete("/api/movies/:id", (req, res) => {
  let movies = readJsonFile(MOVIES_FILE);
  const initialLength = movies.length;
  movies = movies.filter(m => String(m.id) !== String(req.params.id));
  if (movies.length < initialLength) {
    writeJsonFile(MOVIES_FILE, movies);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Film nebyl nalezen" });
  }
});

// SERIES ENDPOINTS
app.get("/api/series", (req, res) => {
  const series = readJsonFile(SERIES_FILE);
  res.json(series);
});

app.get("/api/series/:id", (req, res) => {
  const series = readJsonFile(SERIES_FILE);
  const show = series.find(s => String(s.id) === String(req.params.id));
  if (show) {
    res.json(show);
  } else {
    res.status(404).json({ error: "Serial nebyl nalezen" });
  }
});

app.post("/api/series", (req, res) => {
  const series = readJsonFile(SERIES_FILE);
  const show = req.body;
  show.id = show.id || Date.now();
  series.push(show);
  writeJsonFile(SERIES_FILE, series);
  res.json({ success: true, series: show });
});

app.put("/api/series/:id", (req, res) => {
  const series = readJsonFile(SERIES_FILE);
  const index = series.findIndex(s => String(s.id) === String(req.params.id));
  if (index !== -1) {
    series[index] = { ...series[index], ...req.body };
    writeJsonFile(SERIES_FILE, series);
    res.json({ success: true, series: series[index] });
  } else {
    res.status(404).json({ error: "Serial nebyl nalezen" });
  }
});

app.delete("/api/series/:id", (req, res) => {
  let series = readJsonFile(SERIES_FILE);
  const initialLength = series.length;
  series = series.filter(s => String(s.id) !== String(req.params.id));
  if (series.length < initialLength) {
    writeJsonFile(SERIES_FILE, series);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Serial nebyl nalezen" });
  }
});

// TRAILERS ENDPOINTS
app.get("/api/trailers", (req, res) => {
  const trailers = readJsonFile(TRAILERS_FILE);
  res.json(trailers);
});

app.post("/api/trailers", (req, res) => {
  const trailers = readJsonFile(TRAILERS_FILE);
  const trailer = req.body;
  trailer.id = trailer.id || Date.now();
  trailers.push(trailer);
  writeJsonFile(TRAILERS_FILE, trailers);
  res.json({ success: true, trailer: trailer });
});

app.delete("/api/trailers/:id", (req, res) => {
  let trailers = readJsonFile(TRAILERS_FILE);
  const initialLength = trailers.length;
  trailers = trailers.filter(t => String(t.id) !== String(req.params.id));
  if (trailers.length < initialLength) {
    writeJsonFile(TRAILERS_FILE, trailers);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Trailer nebyl nalezen" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});;

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Lumeo+ server bezi na portu " + PORT);

});

