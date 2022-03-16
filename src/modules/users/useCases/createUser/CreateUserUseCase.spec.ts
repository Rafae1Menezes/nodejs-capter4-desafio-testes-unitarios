import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", ()=>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async ()=> {
    const user = {
      email: 'rafael@gmail.com',
      name: 'rafael',
      password: '123456'
    }

    const newUser = await createUserUseCase.execute(user);

    expect(newUser).toHaveProperty('id');
  })

  it("should not be able to create a new user with a email exists", ()=> {
    expect(async ()=>{
      const user = {
        email: 'rafael@gmail.com',
        name: 'Felipe',
        password: '123456'
      }

      const newUser = await createUserUseCase.execute(user);

      expect(newUser).toHaveProperty('id');
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
