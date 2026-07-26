// backend/services/messageService.js
import { MessageModel } from '../models/Message.js';

export const MessageService = {
  getAll: () => MessageModel.findAll(),

  create: async (data) => {
    const { lastID } = await MessageModel.create(data);
    return MessageModel.findById(lastID);
  },

  markRead: async (id) => {
    const msg = await MessageModel.findById(id);
    if (!msg) throw new Error('MESSAGE_NOT_FOUND');
    await MessageModel.markRead(id);
    return MessageModel.findById(id);
  },

  delete: async (id) => {
    const msg = await MessageModel.findById(id);
    if (!msg) throw new Error('MESSAGE_NOT_FOUND');
    await MessageModel.delete(id);
    return { success: true };
  },

  countUnread: () => MessageModel.countUnread()
};
