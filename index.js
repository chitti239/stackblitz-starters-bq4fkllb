const express = require('express');
const { resolve } = require('path');

const dotenv = require("dotenv");
const menuSchema = require('./schema');
const { default: mongoose } = require('mongoose');
dotenv.config();

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post("/postmenu",async(req,res)=>{
  try {
    const {name,description,price} = req.body;
    if(!name || !price){
      return res.status(404).send({msg:"Name and price are required"});
    }
    const data = await menuSchema({name,description,price});
    await data.save();

    res.status(201).send({msg:"Menu item created successfully",data});
    
  } catch (error) {
     res.status(500).send({msg:"Error creating menu items",error});
  }
})

app.get("/menuget",async(req,res)=>{
  try {
    const allItems = await menuSchema.find();
    res.status(200).send(allItems);
  } catch (error) {
    res.status(500).send({msg:"Error creating menu items",error});
  }
})

app.listen(port, async() => {
  await mongoose.connect(process.env.MONGO_URL)
  console.log("Server Connected successfully!");
  console.log(`Example app listening at http://localhost:${port}`);
});
