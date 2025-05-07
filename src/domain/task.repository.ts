import { Task } from "./task";

export interface ITaskRepository {
  save(task: Task): Promise<void>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  delete(id: string): Promise<void>;
  update(task: Task): Promise<void>;
}
