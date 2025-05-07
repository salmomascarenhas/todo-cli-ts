import { ITaskRepository } from "../domain/task.repository";

export interface CompleteTaskInput {
  id: string;
}

export class CompleteTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(input: CompleteTaskInput): Promise<void> {
    const task = await this.repo.findById(input.id);
    if (!task) {
      throw new Error(`Tarefa com id "${input.id}" não encontrada.`);
    }
    task.complete();
    await this.repo.update(task);
  }
}
