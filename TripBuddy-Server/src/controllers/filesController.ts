import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

const uploadFile = (request: Request, response: Response) => {
  if (!request.file) {
    response.status(StatusCodes.BAD_REQUEST).send({error: 'No file uploaded'});
  }

  const baseUrl = `${request.protocol}://${request.get('host')}`;

  const file = request.file as Express.Multer.File;
  const fileUrl = `${baseUrl}/${file.filename}`;

  response.status(StatusCodes.CREATED).send({url: fileUrl});
};

export {uploadFile};
