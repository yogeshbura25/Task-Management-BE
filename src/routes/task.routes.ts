import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, toggleTaskStatus, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, getTasksQuerySchema, updateTaskSchema, taskIdParamSchema, toggleTaskSchema } from '../validations/task.validation';

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', validate(getTasksQuerySchema), getTasks);
router.get('/:id', validate(taskIdParamSchema), getTaskById);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.patch('/:id/toggle', validate(toggleTaskSchema), toggleTaskStatus);
router.delete('/:id', validate(taskIdParamSchema), deleteTask);

export default router;
