// resultRoute.js
import { Router } from 'express';
import * as controller from '../controllers/resultController.js';

const router = Router();

router.route('/')
  .get(controller.getResult)
  .delete(controller.dropResult);
  
router.route('/:id').post(controller.storeResult);
export { router as resultRoutes };
