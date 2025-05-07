import { promises as fs } from "fs";
import * as path from "path";
import { Task } from "../domain/task";
import { ITaskRepository } from "../domain/task.repository";

export class JsonFileTaskRepository implements ITaskRepository {
  private filePath: string;

  constructor(filePath?: string) {
    // Usa tasks.json na raiz do projeto por default
    this.filePath = filePath ?? path.resolve(process.cwd(), "tasks.json");
  }

  private async ensureFile(): Promise<void> {
    try {
      await fs.access(this.filePath);
    } catch {
      // Se não existe, cria com array vazio
      await fs.writeFile(this.filePath, "[]", "utf-8");
    }
  }

  private async readTasks(): Promise<Task[]> {
    await this.ensureFile();
    const content = await fs.readFile(this.filePath, "utf-8");
    const objs = JSON.parse(content) as Array<{
      id: string;
      title: string;
      createdAt: string;
      completed: boolean;
    }>;
    return objs.map(
      (o) => new Task(o.id, o.title, new Date(o.createdAt), o.completed)
    );
  }

  private async writeTasks(tasks: Task[]): Promise<void> {
    const objs = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt.toISOString(),
      completed: t.completed,
    }));
    await fs.writeFile(this.filePath, JSON.stringify(objs, null, 2), "utf-8");
  }

  async save(task: Task): Promise<void> {
    const tasks = await this.readTasks();
    tasks.push(task);
    await this.writeTasks(tasks);
  }

  async findAll(): Promise<Task[]> {
    return this.readTasks();
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.readTasks();
    const found = tasks.find((t) => t.id === id) ?? null;
    return found;
  }

  async delete(id: string): Promise<void> {
    let tasks = await this.readTasks();
    tasks = tasks.filter((t) => t.id !== id);
    await this.writeTasks(tasks);
  }

  async update(task: Task): Promise<void> {
    const tasks = await this.readTasks();
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx === -1) {
      throw new Error(`Task com id "${task.id}" não encontrada.`);
    }
    tasks[idx] = task;
    await this.writeTasks(tasks);
  }
}
