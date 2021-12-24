import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepository: IUsersRepository;

let statementRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    statementRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      userRepository
    );
  });
  it("should succesfully get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(balance).toHaveProperty("balance");
    expect(balance.balance).toBe(0);
  });

  it("should get error if has no user", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "invalid-id" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
