import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let userRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepository,
      statementRepository
    );
  });

  it("should succesfully get statement operation use case ", async () => {
    const user = await userRepository.create({
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "123456",
    });

    const statement = await statementRepository.create({
      amount: 100,
      description: "description",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should get error if has no user", async () => {
    expect(async () => {
      getStatementOperationUseCase.execute({
        user_id: "invalid-id",
        statement_id: "",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should statement not found", async () => {
    const user = await userRepository.create({
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "123456",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "invalid-id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
