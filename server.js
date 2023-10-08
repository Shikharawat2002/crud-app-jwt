
const express = require('express')
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
  console.log("middleware added successfully")
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb+srv://admin:Shikh%40rawat2002@cluster1.eyjvepu.mongodb.net/jwtauthentication?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


  async function initial() {
    try {
      const count = await Role.estimatedDocumentCount();
  
      if (count === 0) {
        await new Role({ name: "user" }).save();
        await new Role({ name: "moderator" }).save();
        await new Role({ name: "admin" }).save();
        console.log("Roles added to the roles collection.");
      }
    } catch (err) {
      console.error("Error initializing roles:", err);
    }
  }
  
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});