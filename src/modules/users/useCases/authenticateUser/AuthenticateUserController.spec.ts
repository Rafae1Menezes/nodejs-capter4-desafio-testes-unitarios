import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm';
import { createConnectionFin } from '../../../../database';

let connection: Connection;

describe("Authenticate User Controller", ()=>{

  beforeAll(async()=>{
    connection = await createConnectionFin();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })


  it('should be able to login a user',  async () => {

    await request(app).post("/api/v1/users")
      .send({
        name: "Felipe",
        email: "lipera@gmail.com",
        password: "123456"
      })

    const response = await request(app).post("/api/v1/sessions")
      .send({
        email: "lipera@gmail.com",
        password: "123456"
      })

    expect(response.body).toHaveProperty('token');
  })

  it('should not be able to login a user with a incorrect password',  async () => {

    const response = await request(app).post("/api/v1/sessions")
      .send({
        email: "lipera@gmail.com",
        password: "wrong password"
      })

    expect(response.status).toBe(401);
  })

  it('should not be able to login a user with a incorrect password',  async () => {

    const response = await request(app).post("/api/v1/sessions")
      .send({
        email: "wrongemail@gmail.com",
        password: "123456"
      })

    expect(response.status).toBe(401);
  })


})
