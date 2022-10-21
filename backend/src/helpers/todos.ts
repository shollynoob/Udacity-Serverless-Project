import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';


// TODO: Implement businessLogic
export function todoBuilder(
    todoRequest: CreateTodoRequest, 
    event: APIGatewayProxyEvent)
{
  const todoId = uuid.v4()
  const todo = {
    todoId: todoId,
    userId: getUserId(event),
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: '',
    ...todoRequest
  }
    return todo
}
