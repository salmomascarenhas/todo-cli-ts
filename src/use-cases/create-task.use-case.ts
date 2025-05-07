import { IIdGenerator } from "../domain/id-generator.interface";
import { Task } from "../domain/task";
import { ITaskRepository } from "../domain/task.repository";

interface Input {
  title: string;
}
interface Output {
  task: Task;
}

export class CreateTaskUseCase {
  constructor(private repo: ITaskRepository, private idGen: IIdGenerator) {}

  async execute(input: Input): Promise<Output> {
    const id = this.idGen.generate();
    const task = new Task(id, input.title);
    await this.repo.save(task);
    return { task };
  }
}
