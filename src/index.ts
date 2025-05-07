#!/usr/bin/env node

import * as readline from "readline";
import { TaskController } from "./cli/task.controller";
import { InMemoryTaskRepository } from "./infra/in-memory-task.repository";
import { JsonFileTaskRepository } from "./infra/json-file-task.repository";
import { UUIDGenerator } from "./infra/uuid-generator";
import { ChangeTaskTitleUseCase } from "./use-cases/change-task-title.use-case";
import { CompleteTaskUseCase } from "./use-cases/complete-task.use-cae";
import { CreateTaskUseCase } from "./use-cases/create-task.use-case";
import { ListTasksUseCase } from "./use-cases/list-tasks.use-case";
import { RemoveTaskUseCase } from "./use-cases/remove-task.use-case";
import { UndoCompleteTaskUseCase } from "./use-cases/undo-complete-task.use-case";

async function askPersist(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer: string = await new Promise((resolve) => {
    rl.question("Deseja persistir dados em arquivo JSON? (s/N) ", resolve);
  });
  rl.close();
  return ["s", "S", "y", "Y"].includes(answer.trim());
}

(async function main() {
  const useJson = await askPersist();
  const repo = useJson
    ? new JsonFileTaskRepository()
    : new InMemoryTaskRepository();

  const idGen = new UUIDGenerator();

  const createUC = new CreateTaskUseCase(repo, idGen);
  const listUC = new ListTasksUseCase(repo);
  const removeUC = new RemoveTaskUseCase(repo);
  const completeUC = new CompleteTaskUseCase(repo);
  const undoUC = new UndoCompleteTaskUseCase(repo);
  const changeTitleUC = new ChangeTaskTitleUseCase(repo);

  const controller = new TaskController(
    createUC,
    listUC,
    removeUC,
    completeUC,
    undoUC,
    changeTitleUC
  );

  controller.run();
})();
