import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("should authenticate a user", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const { user, token } = await new AuthenticateUserUseCase(
      userRepository
    ).execute({
      email: createdUser.email,
      password: "123456",
    });

    expect(token).toBeDefined();
  });
  it("should throw an error if the user does not exist", async () => {
    expect(async () => {
      await new AuthenticateUserUseCase(userRepository).execute({
        email: "johndoe@gmail.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
  it("should throw an error if the password is incorrect", async () => {
    const user = await createUserUseCase.execute({
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "123456",
    });

    expect(async () => {
      await new AuthenticateUserUseCase(userRepository).execute({
        email: user.email,
        password: "654321",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
