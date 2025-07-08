import express from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.controller.js';

const router = express.Router();

router.get('/', getContactsController);

router.get('/:contactId', getContactByIdController);

export default router;
