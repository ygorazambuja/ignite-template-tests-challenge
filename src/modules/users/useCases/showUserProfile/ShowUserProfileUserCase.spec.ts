import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

let showUserProfileUseCase: ShowUserProfileUseCase;
describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);

    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
  });
  it("should show a user profile", async () => {
    const user = await createUserUseCase.execute({
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "123456",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id!);

    expect(userProfile.id).toBeDefined();
    expect(userProfile.name).toBe("John Doe");
    expect(userProfile.email).toBe("johndoe@gmail.com");
  });
  it("should throw an error if the user does not exist", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
