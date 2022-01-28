const { ObjectId } = require("mongodb")
const request = require("supertest")
const app = require("../src/app")
const { connectToDB, closeConnection, getDB } = require("../src/database")

const baseUrl = "/todos"

beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const MONGODB_DB = process.env.MONGODB_DB || 'mytodos-test'

    await connectToDB(MONGODB_URI, MONGODB_DB)
})

afterAll(async () => {
    closeConnection()
})

afterEach(async() => {
    const db = getDB()
    await db.dropCollection("todos")
})

beforeEach(async() => {
    const db = getDB()
    await db.createCollection("todos")
})

describe("GET /todos", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.statusCode).toBe(200)
    })

    test("should respond with JSON", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.type).toBe("application/json")
    })

    test("should respond with list of existing todos", async () => {
        const todoObj = {title: "TodoTest", completed: false, completedAt: "2022-01-20T09:54:48.139Z", updatedAt: "2022-01-20T09:54:48.139Z"}
        const db = getDB()
        await db.collection("todos").insertOne(todoObj)
        const response = await request(app.callback()).get(baseUrl)
        console.log(response.body)
        todos = response.body
        expect(todos.length).toBe(1)
        todoToTest = todos[0]
        expect(todoToTest.title).toBe("TodoTest")
        expect(todoToTest.completed).toBe(false)
    })
})
