import { MongoManager } from "./mongo.manager.js";
import { messageModel } from "../models/messages.models.js";

class MessagesManager extends MongoManager {}

export const messagesManager = new MessagesManager(messageModel);
