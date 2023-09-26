import { Router } from 'express';

import * as TodoHandlers from './todos.handlers';
import { Todo } from './todos.model';
import { validateRequest } from '../../middlewares';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

router
  .route('/')
  .get(TodoHandlers.findAll)
  .post(
    validateRequest({
      body: Todo,
    }),

    TodoHandlers.createOne
  );
router
  .route('/:id')
  .get(
    validateRequest({
      params: ParamsWithId,
    }),
    TodoHandlers.findOne
  )
  .put(
    validateRequest({
      params: ParamsWithId,
      body: Todo,
    }),
    TodoHandlers.updateOne
  )
  .delete(
    validateRequest({
      params: ParamsWithId,
    }),
    TodoHandlers.deleteOne

  )

export default router;
