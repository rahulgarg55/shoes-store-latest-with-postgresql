const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { Sequelize, DataTypes } = require("sequelize");
const emailModule = require("./utils/email");
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

  const shoes = sequelize.define("shoes", {
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "createdat", // Add this line to specify the column name
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "updatedat", // Add this line to specify the column name
    },
  }, {
    tableName: "shoes",
  });
  

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  const pageNumber = req.query.page || 1;
  const pageSize = 5;

  shoes.findAndCountAll({
    attributes: ["id", "name", "image", "price", "createdat", "updatedat"], 
    offset: (pageNumber - 1) * pageSize,
    limit: pageSize,
  })
    .then((result) => {
      const { rows: shoes, count: total } = result;
      const pages = Math.ceil(total / pageSize); // Calculate the total number of pages
      const remainingItems = total % pageSize; // Calculate the remaining items
      const emailTo = "gargr0109@gmail.com";
      const emailSubject = "New Shoe Added";
      const emailText = JSON.stringify(shoes);
      emailModule.sendEmail(emailTo, emailSubject, emailText);
      res.render("index", { shoes, pages, remainingItems, pageNumber }); // Add pageNumber to the template variables
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.post("/add", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var newShoe = { name: name, image: image, price: price };
  shoes.create(newShoe)
    .then((data) => {
      console.log(data);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.get("/:id/edit", (req, res) => {
  shoes.findByPk(req.params.id) //find by primary key.
    .then((shoe) => {
      res.render("edit", { shoe: shoe });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.put("/:id/edit", (req, res) => {
  shoes.update(req.body, {
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

app.delete("/:id", (req, res) => {
  shoes.destroy({
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

const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
