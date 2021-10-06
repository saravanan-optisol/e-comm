module.exports = (sequelize: any, DataTypes: any) => {
    const Review = sequelize.define('Review', {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Review;
  };
