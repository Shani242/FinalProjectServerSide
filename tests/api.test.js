/**
 * @file Unit tests for Cost Manager API
 * @description This file contains Jest tests to validate the API endpoints.
 */

const request = require("supertest");
const { app, connectDB } = require("../server");
const mongoose = require("mongoose");

const testUserId = 123123; // Predefined test user ID
const testCostItem = {
    userid: testUserId,
    description: "Test Expense",
    category: "food",
    sum: 100,
    date: "2025-02-09"
};

beforeAll(async () => {
    await connectDB(); // Ensure MongoDB is connected before running tests
});

afterAll(async () => {
    await mongoose.connection.close(); // Ensure MongoDB connection is closed after tests
});

describe("Cost Manager API Tests", () => {

    /**
     * Test: Add a new cost item
     */
    test("POST /api/add - should add a new cost item", async () => {
        const res = await request(app)
            .post("/api/add")
            .send(testCostItem);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("description", testCostItem.description);
        expect(res.body).toHaveProperty("category", testCostItem.category);
        expect(res.body).toHaveProperty("userid", testCostItem.userid);
        expect(res.body).toHaveProperty("sum", testCostItem.sum);
    });

    /**
     * Test: Retrieve a monthly report for a user
     */
    test("GET /api/report - should retrieve the monthly report for a user", async () => {
        const res = await request(app)
            .get(`/api/report?id=${testUserId}&year=2025&month=2`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("userid", testUserId);
        expect(res.body).toHaveProperty("year", 2025);
        expect(res.body).toHaveProperty("month", 2);
        expect(res.body).toHaveProperty("costs");
        expect(Array.isArray(res.body.costs)).toBe(true);
    });

    /**
     * Test: Retrieve user details
     */
    test("GET /api/users/:id - should retrieve the details of a specific user", async () => {
        const res = await request(app)
            .get(`/api/users/${testUserId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", testUserId);
        expect(res.body).toHaveProperty("first_name");
        expect(res.body).toHaveProperty("last_name");
        expect(res.body).toHaveProperty("total");
        expect(typeof res.body.total).toBe("number");
    });

    /**
     * Test: Retrieve the development team members
     */
    test("GET /api/about - should retrieve the list of developers", async () => {
        const res = await request(app)
            .get("/api/about");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((member) => {
            expect(member).toHaveProperty("first_name");
            expect(member).toHaveProperty("last_name");
        });
    });

});
