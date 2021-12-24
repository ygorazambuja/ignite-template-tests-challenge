import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let userRepository: IUsersRepository;
let statementRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementRepository
    );
  });

  it("should Create a Statement succesfully", async () => {
    const user = await createUserUseCase.execute({
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 100,
      description: "description",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(100);
  });

  it("should not create a Statement if the user does not exist", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "invalid-id",
        amount: 100,
        description: "description",
        type: OperationType.DEPOSIT,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not create a Statement if the user has insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      email: "",
      name: "",
      password: "",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id!,
        amount: 100,
        description: "description",
        type: OperationType.WITHDRAW,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
