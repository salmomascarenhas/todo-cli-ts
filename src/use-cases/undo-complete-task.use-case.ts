import { ITaskRepository } from "../domain/task.repository";

export interface UndoCompleteTaskInput {
  id: string;
}

export class UndoCompleteTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(input: UndoCompleteTaskInput): Promise<void> {
    const task = await this.repo.findById(input.id);
    if (!task) {
      throw new Error(`Tarefa com id "${input.id}" não encontrada.`);
    }
    task.undoComplete();
    await this.repo.update(task);
  }
}
