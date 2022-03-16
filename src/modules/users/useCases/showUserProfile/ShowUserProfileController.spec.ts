import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm';
import { createConnectionFin } from '../../../../database';
import { v4 } from 'uuid';

let connection: Connection;

describe("Show User Profile Controller", ()=>{

  beforeAll(async()=>{
    connection = await createConnectionFin();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })


  it('should be able to return a specific user profile',  async () => {

    await request(app).post("/api/v1/users")
      .send({
        name: "Felipe",
        email: "lipera@gmail.com",
        password: "123456"
      })

    const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "lipera@gmail.com",
        password: "123456"
      })

    const { token } = responseToken.body

    const responseProfile = await request(app).get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` })


    const profile = responseProfile.body

    expect(profile).toHaveProperty('id');
  })

  it('should not be able to return a user with a wrogn token',  async () => {

    const  token  = 'wrong token'

    const responseProfile = await request(app).get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` })

    expect(responseProfile.status).toBe(401);
  })

})
