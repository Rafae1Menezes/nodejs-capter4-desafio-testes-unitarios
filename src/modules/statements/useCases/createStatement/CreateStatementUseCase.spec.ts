import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", ()=>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to do deposits", async ()=> {
    const user = await inMemoryUsersRepository.create({
      email: 'rafael444@gmail.com',
      name: 'rafael',
      password: '123456'
    });

    const deposit = {
      user_id: user.id as string,
      amount: 500,
      description: 'salario',
      type: 'deposit'
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(deposit)

    const deposit2 = {
      user_id: user.id as string,
      amount: 200,
      description: 'salario2',
      type: 'deposit'
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(deposit2)

    const balance = await getBalanceUseCase.execute({user_id: user.id as string})

    expect(balance.balance).toBe(700);
  })

  it("should be able to do withdraws", async ()=> {
    const user = await inMemoryUsersRepository.create({
      email: 'rafael444@gmail.com',
      name: 'rafael',
      password: '123456'
    });

    const deposit = {
      user_id: user.id as string,
      amount: 500,
      description: 'salario',
      type: 'deposit'
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(deposit)

    const withdraw = {
      user_id: user.id as string,
      amount: 200,
      description: 'supermercado',
      type: 'withdraw'
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(withdraw)

    const balance = await getBalanceUseCase.execute({user_id: user.id as string})

    expect(balance.balance).toBe(300);
  })

  it("should not be able to do withdraws with insufficient balance", ()=> {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: 'rafael444@gmail.com',
        name: 'rafael',
        password: '123456'
      });

      const deposit = {
        user_id: user.id as string,
        amount: 500,
        description: 'salario',
        type: 'deposit'
      } as ICreateStatementDTO;

      await createStatementUseCase.execute(deposit)

      const withdraw = {
        user_id: user.id as string,
        amount: 700,
        description: 'supermercado',
        type: 'withdraw'
      } as ICreateStatementDTO;

      await createStatementUseCase.execute(withdraw)

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })

})
