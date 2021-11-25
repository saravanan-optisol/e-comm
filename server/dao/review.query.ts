import Review from "../models/review.model";

let reviewQuery = {
    getAllReview: async () =>{
        const review = await Review.findAll();
        return review;
    },

    getUserReview: async (user_id: any) =>{
        const review = await Review.findAll({ where: {user_id: user_id}})
        return review;
    },

    getReview: async (user_id: any, product_id: any) =>{
        const review = await Review.findOne({ where: {user_id, product_id}})
        return review;
    },

    getReviewById: async (review_id: any) =>{
        const review = await Review.findByPk(review_id)
        return review;
    },

    addReview: async (reviewData: object) =>{
        const review = await Review.create(reviewData);
    },

    getProductReviews: async (product_id: any) =>{
        const reviews = await Review.findAll({ where: {product_id}});
        return reviews;
    },

    deleteReview: async (review_id: any) =>{
        const review = await Review.destroy({where: {review_id}});
    }
}

export default reviewQuery;