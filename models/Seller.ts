module.exports = (sequelize: any, DataTypes: any) => {
    const Seller = sequelize.define('Seller', {
      seller_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.INTEGER,
      },
      company: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      pincode: {
        type: DataTypes.INTEGER,
      }
    });
    return Seller;
  };
