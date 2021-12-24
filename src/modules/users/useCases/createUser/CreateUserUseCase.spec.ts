import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";

let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User UseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user.password).not.toBe("123456");
  });

  it("should not create a user if userAlreadyExists", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "123456",
      });
      const repeatedUser = await createUserUseCase.execute({
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
