import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm';
import { createConnectionFin } from '../../../../database';
import { v4 } from 'uuid';

let connection: Connection;
let token: string

describe("Create Statement Controller", ()=>{

  beforeAll(async()=>{
    connection = await createConnectionFin();
    await connection.runMigrations();

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

    token = responseToken.body.token
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })


  it('should be able to do deposits',  async () => {
    const response = await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: "moto"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('user_id')
  })

  it('should be able to do withdraws',  async () => {
    const response = await request(app).post('/api/v1/statements/withdraw')
      .send({
        amount: 10,
        description: "colher"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('user_id')
  })

  it('should not be able to do withdraws with insufficient balance',  async () => {

    await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: "moto"
      })
      .set({
        Authorization: `Bearer ${token}`
      })


    const response = await request(app).post('/api/v1/statements/withdraw')
      .send({
        amount: 200,
        description: "colher"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

     expect(response.status).toBe(400)
  })

})
