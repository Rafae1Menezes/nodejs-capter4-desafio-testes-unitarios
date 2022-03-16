import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("GetBalance Use Case", ()=>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be get balance of a user", async ()=> {
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
})
