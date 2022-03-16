import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create User", ()=>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be get balance of a user", async ()=> {
    const user = await inMemoryUsersRepository.create({
      email: 'rafael444@gmail.com',
      name: 'rafael',
      password: '123456'
    });

    const deposit  = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 500,
      description: 'salario',
      type: 'deposit'
    } as ICreateStatementDTO)


    const statement = await getStatementOperationUseCase.execute({statement_id: deposit.id as string, user_id: user.id as string})

    expect(statement).toHaveProperty('id');
    expect(statement.amount).toBe(500);
  })

  it("should not be able to get a statement of a user that does not exists", ()=>{
    expect(async() => {
      const user = await inMemoryUsersRepository.create({
        email: 'rafael444@gmail.com',
        name: 'rafael',
        password: '123456'
      });

      const deposit  = await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 500,
        description: 'salario',
        type: 'deposit'
      } as ICreateStatementDTO)


      const statement = await getStatementOperationUseCase.execute({statement_id: deposit.id as string, user_id: 'word user id'})

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("should not be able to get a statement that does not exists", ()=>{
    expect(async() => {
      const user = await inMemoryUsersRepository.create({
        email: 'rafael444@gmail.com',
        name: 'rafael',
        password: '123456'
      });

      const deposit  = await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 500,
        description: 'salario',
        type: 'deposit'
      } as ICreateStatementDTO)


      const statement = await getStatementOperationUseCase.execute({statement_id: 'wrong statement id', user_id: user.id as string})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})
