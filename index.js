const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const jwt = require('jsonwebtoken'); 
const User = require('./models/user'); 


const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());


app.get("/", (req, res) => {
app.use(express.static(path.resolve(__dirname,"frontend", "build")));
res.sendFile(path.resolve(__dirname,  "frontend", "build", "index.html"));
});

app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "http://localhost:3000");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});


app.post('/register', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isPasswordValid = await User.findOne({password: req.body.password});
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '24h' }); 
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId; 
    next(); 
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/protected-data', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data, only accessible with valid JWT' });
});


app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }, 
      { new: true } // Get the modified document if a match is found
    );

    if (!entry) {
      return res.status(404).json('Short URL not found');
    }

    console.log(entry); // Log the full result for investigation 
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Something went wrong' });  
  } 
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
