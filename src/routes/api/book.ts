import  express, {Request, Response} from "express";
const router = express.Router();
import { Book } from '../../models/book'

router.post('/new', async(req: Request, res: Response)=>{
    try {
        const book = await Book.create({
            name: req.body.name,
            author: req.body.author,
            epc: false,
        }) 
        res.status(200).json(book);
    } catch (err) {
        res.send(err)
    }
});

router.get('/all', async(req: Request, res: Response) =>{
    try {
        const book = await Book.findAll();
        res.json(book);
    } catch (err) {
        res.send(err)
    }
})

module.exports = router;