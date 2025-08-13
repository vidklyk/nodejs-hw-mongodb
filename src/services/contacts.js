import fs from 'fs/promises';
import Contact from '../models/contact.model.js';
import { uploadToCloudinary } from './cloudinary.js';

export const getAllContacts = async (userId, query = {}) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isFavourite,
    contactType,
    search,
  } = query;

  const filter = { userId };

  if (typeof isFavourite !== 'undefined') {
    if (isFavourite === 'true' || isFavourite === true)
      filter.isFavourite = true;
    if (isFavourite === 'false' || isFavourite === false)
      filter.isFavourite = false;
  }

  if (contactType) {
    filter.contactType = contactType;
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { phoneNumber: regex }, { email: regex }];
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limit = Math.max(Number(perPage) || 10, 1);
  const skip = (pageNum - 1) * limit;

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [items, total] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    perPage: limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId }).lean();
};

export const createContact = async (body, userId, file) => {
  let photoUrl;

  if (file) {
    const buffer = await resolveFileBuffer(file);
    if (buffer) {
      const result = await uploadToCloudinary(buffer, `users/${userId}`);
      photoUrl = result.secure_url;
    }
  }

  const doc = await Contact.create({
    ...body,
    userId,
    ...(photoUrl ? { photo: photoUrl } : {}),
  });

  return doc;
};

export const updateContact = async (contactId, body, userId, file) => {
  const update = { ...body };

  if (file) {
    const buffer = await resolveFileBuffer(file);
    if (buffer) {
      const result = await uploadToCloudinary(buffer, `users/${userId}`);
      update.photo = result.secure_url;
    }
  }

  const doc = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    update,
    { new: true },
  );

  return doc;
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};

const resolveFileBuffer = async (file) => {
  if (file.buffer) return file.buffer;

  if (file.path) {
    try {
      const buf = await fs.readFile(file.path);
      await fs.unlink(file.path).catch(() => {});
      return buf;
    } catch {
      return null;
    }
  }

  return null;
};
