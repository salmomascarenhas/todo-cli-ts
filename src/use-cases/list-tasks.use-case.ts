import { Task } from "../domain/task";
import { ITaskRepository } from "../domain/task.repository";

export interface ListTasksInput {
  keyword?: string;
}

export interface ListTasksOutput {
  tasks: Task[];
}

export class ListTasksUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(input: ListTasksInput): Promise<ListTasksOutput> {
    let tasks = await this.repo.findAll();
    if (input.keyword)
      tasks = tasks.filter((t) => t.matchesKeyword(input.keyword!));
    return { tasks };
  }
}
