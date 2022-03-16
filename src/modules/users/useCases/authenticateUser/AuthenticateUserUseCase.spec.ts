import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", ()=>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to login a", async ()=> {
    const user = {
      email: 'rafael@gmail.com',
      name: 'rafael',
      password: '123456'
    }

    await createUserUseCase.execute(user);

    const userLogged = await authenticateUserUseCase.execute({email: 'rafael@gmail.com', password: '123456'})

    expect(userLogged).toHaveProperty('token')
  })

   it("should not be able to login a user with a incorrect password", ()=> {

    expect(async()=>{
      const userLogged = await authenticateUserUseCase.execute({email: 'rafael@gmail.com', password: 'wrong password'})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  })

  it("should not be able to login a user with a email that does not exists", ()=> {

    expect(async()=>{
      const userLogged = await authenticateUserUseCase.execute({email: 'wordemail@gmail.com', password: '123456'})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  })

})
