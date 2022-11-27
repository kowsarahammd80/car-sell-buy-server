const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Name:
// password:YeURBu8BP9KfOdz2



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_SECTERE}@cluster0.df9nipl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

  try {
    const userLoginCollection = client.db("Car-sell-buy").collection("registerData")
    const categoryLoginCollection = client.db("Car-sell-buy").collection("category")
    const productsDataCollection = client.db("Car-sell-buy").collection("productCollection");
    const bookingDataCollection = client.db('Car-sell-buy').collection('bookingData')
    const reportDataCollection = client.db('Car-sell-buy').collection('reportData')

  // register time post 
    app.post('/registerData', async (req, res) => {
      const userData = req.body;
      const result = await userLoginCollection.insertOne(userData)
      res.send(result)
    });

    app.get('/userData/:id', async(req, res) => {
       const id = req.params.id;
       const query ={_id: ObjectId(id)};
       const result = await userLoginCollection.find(query).toArray();
       res.send(result)

    })
     
    //social
    app.get("/socialLogin/:email", async (req, res) => {
      const email = req.params.email;
      //   console.log(email);
      const query = { email: email };
      const curser = userLoginCollection.find(query);
      const result = await curser.toArray();
      const arraysLength = result;
      if (arraysLength.length > 0) {
        return res.send("old user");
      }
      const newUser = {
        email: email,
        name: email,
        accountType: "Buyer",
      };
      //   console.log(email)
      const createUser = await userLoginCollection.insertOne(newUser);
      res.send(createUser);
      //   console.log(createUser);
    });


    //category get

    app.get('/category', async (req, res) => {
      const query = {}
      const result = await categoryLoginCollection.find(query).toArray()
      res.send(result)
    });


    app.get("/CarCategory", async (req, res) => {
      const queryData = req.query.model;
      if (queryData == null) {
        const query = { model: 'Porsche' };
        const data = await categoryLoginCollection.find(query).toArray();
        return res.send(data);
      }

      const query = { model: queryData };
      const curser = categoryLoginCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // car post
    app.post("/products", async (req, res) => {
      const productsData = req.body;
      const result = await productsDataCollection.insertOne(productsData);
      res.send(result);
    });

    //get my product list

    app.get('/products/:email', async(req, res) => {
       const productEmail = req.params.email;
      //  console.log(productEmail)
       const query = {seller: productEmail}
       const result = productsDataCollection.find(query);
       const curser = await result.toArray()
       res.send(curser)
    })

    // product delete
    app.delete('/productsData/:id', async(req, res) => {
       const ID = req.params.id;
       const query = {_id: ObjectId(ID)}
       const result = await productsDataCollection.deleteOne(query)
       res.send(result)
    })

    // car category wise get
    app.get("/allCars", async (req, res) => {

      const queryData = req.query.model;
      if (queryData == null) {
        const query = { carType: 'Porsche' };
        const data = await productsDataCollection.find(query).toArray();
        return res.send(data);

      }

      const query = { carType: queryData };
      const curser = productsDataCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });


    //booking data post
    app.post('/bookingData', async(req, res) => {
       const bookingData = req.body; 
       const result = await bookingDataCollection.insertOne(bookingData)
       res.send(result)
    })

    // get myOrder 
    app.get('/bookingData/:email', async(req, res) => {
        
      const bookingEmail = req.params.email
      const query = {email: bookingEmail}
      const result = bookingDataCollection.find(query)
      const curser = await result.toArray()
      res.send(curser)

    }) 

    //report post
    app.post('/reportData', async (req, res) => {
       const reportData = req.body
       const result = await reportDataCollection.insertOne(reportData)
       res.send(result)
    })

    //admin
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
       const query = { email };
       const user = await userLoginCollection.findOne(query);
       res.send({ isAdmin: user?.accountType === 'admin' });
     });

    //seller
    app.get('/usersSeller/:email', async (req, res) => {
      const email = req.params.email;
       const query = { email };
       const user = await userLoginCollection.findOne(query);
       res.send({ isSeller: user?.accountType === 'Seller' });
     });

    //buyer
    app.get('/usersBuyer/:email', async (req, res) => {
      const email = req.params.email;
       const query = { email };
       const user = await userLoginCollection.findOne(query);
       res.send({ isBuyer: user?.accountType === 'Buyer' });
     });

     


  }
  finally {

  }

}
run().catch(error => console.log(error))


app.get('/', async (req, res) => {
  res.send('car sell and buy server running');
})

app.listen(port, () => console.log(`car sell and buy server running ${port}`))
