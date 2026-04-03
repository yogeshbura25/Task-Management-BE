import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.userId!;

    const task = await prisma.task.create({
      data: { title, description, status, userId }
    });

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { page, limit, status, search } = req.query as {
      page: any;
      limit: any;
      status?: string;
      search?: string;
    };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = { userId };
    if (status) whereClause.status = status;
    if (search) {
      whereClause.title = { contains: search as string, mode: 'insensitive' };
    }

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({ where: whereClause, skip, take: limitNumber, orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where: whereClause })
    ]);

    res.status(200).json({
      status: 'success',
      data: tasks,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });

    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { title, description, status } = req.body;

    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) return res.status(404).json({ status: 'error', message: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status }
    });

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const toggleTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { status } = req.body;

    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) return res.status(404).json({ status: 'error', message: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) return res.status(404).json({ status: 'error', message: 'Task not found' });

    await prisma.task.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
