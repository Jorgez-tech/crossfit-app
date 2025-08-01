const request = require("supertest");
const app = require("../../../app");

describe("API de CrossFit WOD", () => {
    it("debería obtener todos los workouts", async () => {
        const res = await request(app).get("/api/v1/workouts");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("status", "OK");
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
