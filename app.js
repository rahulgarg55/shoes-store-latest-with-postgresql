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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "createdat",
    },
    updatedAt: {
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
app.use((req, res, next) => {
  req.session.cartItems = req.session.cartItems || [];
  next();
});
app.get("/search", (req, res) => {
  const query = req.query.query;
  Shoe.findAll({
    where: {
      name: {
        [Sequelize.Op.like]: `%${query}%`,
      },
    },
  })
    .then((results) => {
      res.render("search", {
        results,
        query,
        cartItems: req.session.cartItems || [],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.post("/:id/add-to-cart", (req, res) => {
  const shoeId = req.params.id;
  Shoe.findByPk(shoeId)
    .then((shoe) => {
      if (shoe) {
        const cartItems = req.session.cartItems || [];
        cartItems.push(shoe);
        req.session.cartItems = cartItems;
      }
      res.redirect("/cart"); // Redirect to the cart page
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.get("/cart", (req, res) => {
  console.log(req.session.cartItems);
  res.render("cart", { cartItems: req.session.cartItems || [] });
  // res.redirect("/");
});

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
app.delete("/delete-item", (req, res) => {
  const itemId = req.body.itemId;
  const cartItems = req.session.cartItems || [];
  const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
  req.session.cartItems = updatedCartItems;
  res.sendStatus(200);
});


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

app.delete("/:id/delete", (req, res) => {
  const shoeId = req.params.id;
  Shoe.destroy({
    where: { id: shoeId },
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.get("/checkout-page", (req, res) => {
  const cartItems = req.session.cartItems || [];
  let totalAmount = 0;
  cartItems.forEach((item) => {
    totalAmount += item.price;
  });
  res.render("checkout", { cartItems, totalAmount });
});
app.get("/", (req, res) => {
  const pageNumber = req.query.page || 1;
  const pageSize = 3;

  Shoe.findAndCountAll({
    attributes: ["id", "name", "image", "price", "createdAt", "updatedAt"],
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
