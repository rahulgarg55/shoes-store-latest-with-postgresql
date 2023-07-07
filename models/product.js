const Sequelize = require('sequelize');
const sequelize = new Sequelize('shoesstore', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

const shoes = sequelize.define('shoes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,            
  },
  image: {         
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  createdat: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedat: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

sequelize.sync()
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
  });

module.exports = shoes;
