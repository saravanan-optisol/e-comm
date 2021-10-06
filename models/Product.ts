module.exports = (sequelize: any, DataTypes: any) => {
    const Product = sequelize.define('Product', {
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seller_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Product;
  };
