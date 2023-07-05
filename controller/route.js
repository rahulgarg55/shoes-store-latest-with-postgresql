app.get("/shoesstore", (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1;
  const pageSize = 3;
  
  shoes.findAndCountAll({
    offset: (pageNumber - 1) * pageSize,
    limit: pageSize,
  })
    .then((result) => {
      const { rows: shoes, count: total } = result;
      const pages = Math.ceil(total / pageSize); // Calculate the total number of pages
      res.render("index.ejs", { shoes: shoes, pages: pages, page: pageNumber }); // Render the index.ejs file and pass the variables
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'An error occurred while fetching shoes' });
    });
});
