import { Router } from "express";
const router=Router();

/** import controllers */
import * as controller from '../controllers/controller.js'


/** Questions routes API */
router.get('/questions', controller.getQuestion)
router.post('/questions', controller.insertQuestions)

router.route('/questions')
        .get(controller.getQuestion)  /** GET request */
        .post(controller.insertQuestions) /** POST request */
        .delete(controller.dropQuestions) /** DELETE request */
// since we have the same endpoint, we use chaining.
// The .route() method allows us to chain multiple HTTP methods(GET, POST, etc.) for the same route.

router.route('/result')
        .get(controller.getResult)
        .post(controller.storeResult)
        .delete(controller.dropResult)
        
export default router; // We want to use this file in server.js so we export it so that we can 
                       // import it in server.js
