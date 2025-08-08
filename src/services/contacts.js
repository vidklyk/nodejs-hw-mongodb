import fs from 'fs/promises';
import Contact from '../models/contact.model.js';
import cloudinary from '../services/cloudinary.js';

export const getAllContacts = async (userId, query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(Number(perPage));

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = (id, userId) =>
  Contact.findOne({ _id: id, userId });

export const createContact = async (data, userId, file) => {
  let photo;

  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
      folder: 'contacts',
    });
    photo = result.secure_url;

    await fs.unlink(file.path);
  }

  return Contact.create({ ...data, userId, photo });
};

export const updateContact = async (id, data, userId, file) => {
  let photo;

  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
      folder: 'contacts',
    });
    photo = result.secure_url;

    await fs.unlink(file.path);
  }

  const updateData = { ...data };
  if (photo) updateData.photo = photo;

  return Contact.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
  });
};

export const deleteContact = (id, userId) =>
  Contact.findOneAndDelete({ _id: id, userId });
