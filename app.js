const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();

// ================= MIDDLEWARE =================

app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use(expressLayouts);

// Layout setup
// Default layout for main site
app.set("layout", "layouts/main");

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ================= MONGODB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/beBuddyDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ================= ROUTES =================
app.use("/", require("./routes/index"));
app.use("/members", require("./routes/members"));
app.use("/about", require("./routes/about"));
app.use("/faq", require("./routes/faq"));

app.use("/products", require("./routes/products"));
app.use("/", require("./routes/order"));

// Admin routes
app.use("/admin", require("./routes/admin"));

// ================= SERVER =================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
