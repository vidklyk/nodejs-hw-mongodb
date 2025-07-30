import mongoose from 'mongoose';
import createHttpError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact id format'));
  }

  next();
};

export default isValidId;
