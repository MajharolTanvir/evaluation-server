const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// ? middle wear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x0uyaf2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const studentData = client.db("StudentInfo").collection("Students");

    // *  All students by get
    app.get("/getStudents", async (req, res) => {
      const result = await studentData.find().toArray();
      res.send(result);
    });

    // *  Single student by get
    app.get("/getSingleStudent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await studentData.findOne(filter);
      res.send(result);
    });

    //   * Add student by post
    app.post("/addStudent", async (req, res) => {
      const data = req.body;
      const result = await studentData.insertOne(data);
      res.send(result);
    });

    //   * Edit student by put
    app.put("/editStudent/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await studentData.updateMany(filter, updateDoc, options);
      res.send(result);
    });

    //   * Delete student by delete
    app.delete("/deleteStudent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await studentData.deleteOne(filter);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World assignment!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
