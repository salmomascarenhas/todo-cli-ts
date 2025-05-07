import { ITaskRepository } from "../domain/task.repository";

export interface ChangeTaskTitleInput {
  id: string;
  newTitle: string;
}

export class ChangeTaskTitleUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(input: ChangeTaskTitleInput): Promise<void> {
    const task = await this.repo.findById(input.id);
    if (!task) throw new Error(`Tarefa com id "${input.id}" não encontrada.`);
    task.changeTitle(input.newTitle);
    await this.repo.update(task);
  }
}
