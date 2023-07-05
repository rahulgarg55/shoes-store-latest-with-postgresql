const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { Sequelize, DataTypes } = require("sequelize");
const emailModule = require("./utils/email");
const session = require("express-session");
const crypto = require("crypto");

const app = express();
const sequelize = new Sequelize("shoesstore", "postgres", "1234", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

const Shoe = sequelize.define(
  "Shoe",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "createdat",
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updatedat",
    },
  },
  {
    tableName: "shoes",
  }
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const secretKey = crypto.randomBytes(32).toString("hex");

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to initialize cartItems array
app.use((req, res, next) => {
  req.session.cartItems = req.session.cartItems || [];
  next();
});

app.post("/:id/add-to-cart", (req, res) => {
  const shoeId = req.params.id;
  Shoe.findByPk(shoeId)
    .then((shoe) => {
      if (shoe) {
        const cartItems = req.session.cartItems || [];
        cartItems.push(shoe);
        req.session.cartItems = cartItems;
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});


// Render the cart page
app.get("/cart", (req, res) => {
  console.log(req.session.cartItems); // Log the cartItems array
  res.render("cart", { cartItems: req.session.cartItems || [] });
});

// Remove an item from the cart
app.delete("/cart/:id", (req, res) => {
  const shoeId = req.params.id;
  const cartItems = req.session.cartItems || [];
  const index = cartItems.findIndex((shoe) => shoe.id === shoeId);

  if (index !== -1) {
    cartItems.splice(index, 1);
    req.session.cartItems = cartItems;
  }

  res.redirect("/cart");
});

// Render the edit page
app.get("/:id/edit", (req, res) => {
  Shoe.findByPk(req.params.id)
    .then((shoe) => {
      res.render("edit", { shoe: shoe });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

// Update a shoe
app.put("/:id/edit", (req, res) => {
  Shoe.update(req.body, {
    where: { id: req.params.id },
  })
    .then((updatedRows) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

// Delete a shoe
app.delete("/:id", (req, res) => {
  Shoe.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

// Render the home page
app.get("/", (req, res) => {
  const pageNumber = req.query.page || 1;
  const pageSize = 3;

  Shoe.findAndCountAll({
    attributes: ["id", "name", "image", "price", "createdat", "updatedat"],
    offset: (pageNumber - 1) * pageSize,
    limit: pageSize,
  })
    .then((result) => {
      const { rows: shoes, count: total } = result;
      const pages = Math.ceil(total / pageSize);
      const remainingItems = total % pageSize;
      const emailTo = "gargr0109@gmail.com";
      const emailSubject = "New Shoe Added";
      const emailText = JSON.stringify(shoes);
      emailModule.sendEmail(emailTo, emailSubject, emailText);
      res.render("index", {
        shoes,
        pages,
        remainingItems,
        pageNumber,
        cartItems: req.session.cartItems || [],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
