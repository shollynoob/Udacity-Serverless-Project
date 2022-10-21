import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';


const AWSXRay = require ('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)



const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const todoItemsIdIndex = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// TODO: Implement the dataLayer logic
export async function createTodo (todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
  }

  export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')

    const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  export async function getTodoById(todoId: string): Promise<TodoItem> {
    logger.info('Getting all todos', {todoId: todoId})
    const todo = await docClient.query({
      TableName: todosTable,
      IndexName: todoItemsIdIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }).promise()
    const items = todo.Items
    if (items.length !== 0) return items[0] as TodoItem
      return null
  }

export async function updateTodo (todo: TodoItem): Promise<TodoItem> {
    const result= await docClient
    .update({
      TableName: todosTable,
      Key: { todoId: todo.todoId, userId: todo.userId },
      UpdateExpression: 'set attachmentUrl= :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': todo.attachmentUrl
      },
    }).promise()

    return result.Attributes as TodoItem
  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  