import { ITaskRepository } from "../domain/task.repository";

export interface RemoveTaskInput {
  id: string;
}

export class RemoveTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(input: RemoveTaskInput): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing)
      throw new Error(`Tarefa com id "${input.id}" não encontrada.`);
    await this.repo.delete(input.id);
  }
}
