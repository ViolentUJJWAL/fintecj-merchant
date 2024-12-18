const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./dataBase/db");
const path = require("path")
const cookieParser = require("cookie-parser");
require("dotenv").config();

const URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["*", "http://localhost:5173"],
    credentials: true,
  })
);


// Routes
const authRoutes = require("./src/routes/authRoutes")
const profileRoutes = require("./src/routes/profileRoutes")
const productRoutes = require("./src/routes/productRoutes")
const shopRoutes = require("./src/routes/shopRoutes")
const orderRoutes = require("./src/routes/orderRoutes")
const ratingRoutes = require("./src/routes/ratingRoutes")
const statisticsRoutes = require("./src/routes/statisticsRoutes")
const customerRoutes = require("./src/routes/customerRoutes")
const walletTransactionRoutres = require("./src/routes/walletTransactionRoutres")




app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/product", productRoutes)
app.use("/api/shop", shopRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/dashboard", statisticsRoutes)
app.use("/api/customer", customerRoutes)
app.use("/api/wallet", walletTransactionRoutres)




// Starting the server
app.listen(PORT, async () => {
  const db = await connectDB(URL);
  if(db){
    console.log(`Server running on Port- ${PORT}`.bgBlue.black);
  }else{
    console.log(`Server Not run due to DataBase not connected properly`.bgRed.black)
  }
});
