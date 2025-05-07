import { Task } from "../domain/task";
import { ITaskRepository } from "../domain/task.repository";

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id);
  }

  async update(task: Task): Promise<void> {
    if (!this.tasks.has(task.id))
      throw new Error(`Task com id "${task.id}" não encontrada.`);
    this.tasks.set(task.id, task);
  }
}
