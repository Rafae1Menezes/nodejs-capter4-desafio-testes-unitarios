import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", ()=>{

  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able to return a specific user profile", async ()=> {
    const user = {
      email: 'rafael@gmail.com',
      name: 'rafael',
      password: '123456'
    }

    const newUser = await inMemoryUsersRepository.create(user);

    const returnedUser = await showUserProfileUseCase.execute(newUser.id as string);

    expect(returnedUser).toHaveProperty('id');
  })

  it("should not be able to return a user with a non exists id", ()=> {

    expect(async ()=>{
      await showUserProfileUseCase.execute("wrong id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  })

})
