const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/addUser", async (req, res) => {
  try {
    const { username, dob, profession, userid } = req.body;
    console.log(username + " " + dob + " " + profession + " " + userid);
    if (!username || !dob || !profession || !userid) {
      throw new Error("All fields are required");
    }
    const userData = { name: username, dob, profession };
    let users = JSON.parse(await fs.promises.readFile("users.json", "utf-8"));
    users[userid] = userData;
    await fs.promises.writeFile("users.json", JSON.stringify(users));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/particularUser", async (req, res) => {
  try {
    let users = JSON.parse(await fs.promises.readFile("users.json", "utf-8"));
    const user = users[req.body.urid];
    console.log(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/deleteUser", async (req, res) => {
  try {
    let users = JSON.parse(await fs.promises.readFile("users.json", "utf-8"));
    delete users[req.body.uid];
    console.log(users);
    await fs.promises.writeFile("users.json", JSON.stringify(users));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/showAll', async (req, res) => {
  try {
    const data = await fs.promises.readFile("users.json", "utf-8");
    console.log(data);
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});