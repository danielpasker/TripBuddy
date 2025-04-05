import {Request, Response} from 'express';
import {Model} from 'mongoose';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';

export class BaseController<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(request: Request, response: Response) {
    const body = request.body;

    try {
      const item = await this.model.create(body);
      response.status(StatusCodes.CREATED).send(item);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed creating item', JSON.stringify(error));
    }
  }

  async getById(request: Request, response: Response) {
    const id = request.params.id;

    try {
      const item = await this.model.findById(id);

      if (item) return response.send(item);
      response.status(StatusCodes.NOT_FOUND).send('Not found');
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed getting item by id', JSON.stringify(error));
    }
  }

  async updateItem(request: Request, response: Response) {
    const id = request.params.id;
    const newValue = request.body;

    if (!newValue) {
      response.status(StatusCodes.BAD_REQUEST).send('New value is required');
    } else {
      try {
        const updatedItem = await this.model.findByIdAndUpdate(id, newValue, {
          new: true,
        });

        if (updatedItem) response.status(StatusCodes.OK).json(updatedItem);
        else response.status(StatusCodes.NOT_FOUND).send('Item not found');
      } catch (error) {
        sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed updating item', JSON.stringify(error));
      }
    }
  }

  async deleteItem(request: Request, response: Response) {
    const id = request.params.id;

    try {
      const deletedItem = await this.model.findByIdAndDelete(id);

      if (deletedItem) response.status(StatusCodes.OK).send('Item deleted successfully');
      else response.status(StatusCodes.NOT_FOUND).send('Item not found');
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed deleting item', JSON.stringify(error));
    }
  }
}
