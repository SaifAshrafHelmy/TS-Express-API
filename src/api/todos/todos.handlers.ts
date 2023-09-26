import { NextFunction, Request, Response } from 'express';
import { Todo, TodoWithId, Todos } from './todos.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { ObjectId } from 'mongodb';

export const findAll = async (
  req: Request,
  res: Response<TodoWithId[]>,
  next: NextFunction
) => {
  try {
    const todos = await Todos.find().toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const findOne = async (
  req: Request<ParamsWithId, TodoWithId, {}>,
  res: Response<TodoWithId>,
  next: NextFunction
) => {
  try {
    const result = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    });
    // const todos = await result.toArray();
    if (!result) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createOne = async (
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) => {
  try {
    // PLEASE NOTE: THE req.body is already validated and overridden with a middleware
    const insertedResult = await Todos.insertOne(req.body);
    if (!insertedResult.acknowledged) {
      throw new Error('Error, failed to insert todo.');
    }
    res.status(201);
    res.json({ _id: insertedResult.insertedId, ...req.body });
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (
  req: Request<ParamsWithId, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) => {
  try {
    const updatedResult = await Todos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      }
    );
    if (!updatedResult) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    console.log(updatedResult);
    res.status(200);
    res.json(updatedResult);
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (
  req: Request<ParamsWithId, Response, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await Todos.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    console.log(result);
    if (!result) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
