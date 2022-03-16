import { app } from '../../../../app'
import request from 'supertest'
import { Connection } from 'typeorm';
import { createConnectionFin } from '../../../../database';
import { v4 } from 'uuid';

let connection: Connection;
let token: string

describe("Get Statement Operation Controller", ()=>{

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


  it('should be get balance of a user',  async () => {

    const responseDeposit = await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: "moto"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    const responseStatement = await request(app).get("/api/v1/statements/"+responseDeposit.body.id)
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(responseStatement.status).toBe(200)
    expect(responseStatement.body).toHaveProperty('id')

  })

  it('should not be get balance of a user with a wron token',  async () => {

    const responseDeposit = await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: "moto"
      })
      .set({
        Authorization: `Bearer ${token}`
      })



    const responseStatement = await request(app).get("/api/v1/statements/"+responseDeposit.body.id)
      .set({
        Authorization: `Bearer wrongToken`
      })

    expect(responseStatement.status).toBe(401)

  })

  it('should not be able to get a statement that does not exists',  async () => {

    const responseDeposit = await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: "moto"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    const wrognToken = v4()

    const responseStatement = await request(app).get("/api/v1/statements/"+wrognToken)
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(responseStatement.status).toBe(404)

  })

})
