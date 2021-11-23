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

    addReview: async (reviewData: object) =>{
        const review = await Review.create(reviewData);
    }
}

export default reviewQuery;