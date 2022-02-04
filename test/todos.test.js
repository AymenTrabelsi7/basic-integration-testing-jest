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
        todos = response.body
        expect(todos.length).toBe(1)
        todoToTest = todos[0]
        expect(todoToTest.title).toBe("TodoTest")
        expect(todoToTest.completed).toBe(false)
    })
})

describe("POST /todos", () => {
    test("happy path should respond with 200 status code", async () => {
        const db = getDB()
        const title_test = 'Todo Post Test'

        const response = await request(app.callback())
        .post(baseUrl)
        .send('title=' + title_test)

        var query = {title: title_test}
        const todos_list = await db.collection("todos").find(query).toArray()
        
        console.log(response.body)
        console.log(todos_list)

        todoResult = response.body

        expect(response.statusCode).toBe(200)
        expect(todoResult).toBeDefined()
        expect(todoResult.id).toBeDefined()
        expect(todoResult.id.length).toBeGreaterThan(0)
        
        expect(todos_list.length).toBe(1)
        expect(todos_list[0].title).toBe(title_test)
    })

    test("happy path should respond with 200 status code", async () => {
        const db = getDB()
        const title_test = 'Todo Post Test'

        const response = await request(app.callback())
        .post(baseUrl)
        .send('title=' + title_test)

        var query = {title: title_test}
        const todos_list = await db.collection("todos").find(query).toArray()
        
        console.log(response.body)
        console.log(todos_list)

        todoResult = response.body

        expect(response.statusCode).toBe(200)
        expect(todoResult).toBeDefined()
        expect(todoResult.id).toBeDefined()
        expect(todoResult.id.length).toBeGreaterThan(0)
        
        expect(todos_list.length).toBe(1)
        expect(todos_list[0].title).toBe(title_test)
    })

    test("no parameter 'title' should respond with 422 status code", async () => {
        const db = getDB()
        const title_test = 'Todo Post Test'
        errorMsgToCheck = "Missing parameter 'title'"

        const response = await request(app.callback())
        .post(baseUrl)

        const todos_list = await db.collection("todos").find().toArray()
        
        console.log(response.body)
        console.log(todos_list)

        todoResult = response.body

        expect(response.statusCode).toBe(422)
        expect(todoResult).toBeDefined()
        expect(todoResult.errorMsg).toBeDefined()
        expect(todoResult.errorMsg).toBe(errorMsgToCheck)
        
        expect(todos_list.length).toBe(0)
    })

    test("bad parameter 'title' should not respond with 200 status code", async () => {
    })
})
