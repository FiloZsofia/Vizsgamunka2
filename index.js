const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

//ebben a mappaban keresi a fileokat
app.use(express.static(path.join(__dirname, "Navigation")));

//itt kapocsol eleresi uthoz a fileokat. pl mate.com/login -> login.html
app.get("/Navigation", (req, res) => {
  res.sendFile(path.join(__dirname, "Navigation", "navigation.html"));
});

app.get("/Navigation/main-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Navigation", "main-dashboard.html"));
});

app.get("/Navigation/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Navigation", "admin-dashboard.html"));
});

app.get("/Navigation/user-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Navigation", "user-dashboard.html"));
});

// itt alitod be hol fusson -> localhost:3000 en fut
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
