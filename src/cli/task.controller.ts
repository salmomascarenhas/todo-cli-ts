import * as readline from "readline";
import { Task } from "../domain/task";
import { ChangeTaskTitleUseCase } from "../use-cases/change-task-title.use-case";
import { CompleteTaskUseCase } from "../use-cases/complete-task.use-cae";
import { CreateTaskUseCase } from "../use-cases/create-task.use-case";
import { ListTasksUseCase } from "../use-cases/list-tasks.use-case";
import { RemoveTaskUseCase } from "../use-cases/remove-task.use-case";
import { UndoCompleteTaskUseCase } from "../use-cases/undo-complete-task.use-case";
import {
  BLUE,
  BRIGHT,
  CYAN,
  DIM,
  GREEN,
  RED,
  RESET,
  WHITE,
  YELLOW,
} from "../utils/ansi-colors";

export class TaskController {
  constructor(
    private createUC: CreateTaskUseCase,
    private listUC: ListTasksUseCase,
    private removeUC: RemoveTaskUseCase,
    private completeUC: CompleteTaskUseCase,
    private undoCompleteUC: UndoCompleteTaskUseCase,
    private changeTitleUC: ChangeTaskTitleUseCase
  ) {}

  run(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${BRIGHT}${CYAN}> ${RESET}`,
    });

    this.printHelp();
    rl.prompt();

    rl.on("line", async (line) => {
      const { command, params } = this.parseLine(line);

      try {
        switch (command) {
          case "add":
            await this.handleAdd(params);
            break;
          case "list":
            await this.handleList();
            break;
          case "remove":
            await this.handleRemove(params);
            break;
          case "complete":
            await this.handleComplete(params);
            break;
          case "undo":
            await this.handleUndo(params);
            break;
          case "edit":
            await this.handleEdit(params);
            break;
          case "filter":
            await this.handleFilter(params);
            break;
          case "help":
            this.printHelp();
            break;
          case "exit":
          case "quit":
            rl.close();
            return;
          default:
            console.log(
              `${YELLOW}Comando não reconhecido:${RESET} ${WHITE}"${command}"${RESET}`
            );
            this.printHelp();
        }
      } catch (err: any) {
        console.error(`${RED}Erro:${RESET} ${WHITE}${err.message}${RESET}`);
      }

      rl.prompt();
    });

    rl.on("close", () => {
      console.log(`${DIM}Até a próxima! 👋${RESET}`);
      process.exit(0);
    });
  }

  /** Extrai comando e parâmetros de uma linha, suportando aspas */
  private parseLine(line: string): { command: string; params: string[] } {
    const tokens: string[] = [];
    const regex = /"([^"]+)"|(\S+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line.trim()))) {
      tokens.push(match[1] ?? match[2]);
    }
    const [command = "", ...params] = tokens;
    return { command, params };
  }

  private async handleAdd(params: string[]) {
    const title = params.join(" ").trim();
    if (!title) {
      console.log(
        `${YELLOW}Uso:${RESET} ${CYAN}add "Título da tarefa"${RESET}`
      );
      return;
    }
    const { task } = await this.createUC.execute({ title });
    const idStr = `${BRIGHT}${BLUE}[${task.id}]${RESET}`;
    const titleStr = `${WHITE}${task.title}${RESET}`;
    console.log(`${GREEN}➕ Tarefa criada:${RESET} ${idStr} ${titleStr}`);
  }

  private async handleList() {
    const { tasks } = await this.listUC.execute({});
    if (tasks.length === 0) {
      console.log(`${YELLOW}Nenhuma tarefa cadastrada.${RESET}`);
      return;
    }
    for (const t of tasks) {
      console.log(this.formatTask(t));
    }
  }

  private async handleRemove(params: string[]) {
    const [id] = params;
    if (!id) {
      console.log(`${YELLOW}Uso:${RESET} ${CYAN}remove <id>${RESET}`);
      return;
    }
    await this.removeUC.execute({ id });
    console.log(
      `${RED}❌ Tarefa removida:${RESET} ${BRIGHT}${BLUE}[${id}]${RESET}`
    );
  }

  private async handleComplete(params: string[]) {
    const [id] = params;
    if (!id) {
      console.log(`${YELLOW}Uso:${RESET} ${CYAN}complete <id>${RESET}`);
      return;
    }
    await this.completeUC.execute({ id });
    console.log(
      `${GREEN}✅ Tarefa concluída:${RESET} ${BRIGHT}${BLUE}[${id}]${RESET}`
    );
  }

  private async handleUndo(params: string[]) {
    const [id] = params;
    if (!id) {
      console.log(`${YELLOW}Uso:${RESET} ${CYAN}undo <id>${RESET}`);
      return;
    }
    await this.undoCompleteUC.execute({ id });
    console.log(
      `${GREEN}↩️ Tarefa pendente novamente:${RESET} ${BRIGHT}${BLUE}[${id}]${RESET}`
    );
  }

  private async handleEdit(params: string[]) {
    const [id, ...rest] = params;
    const newTitle = rest.join(" ").trim();
    if (!id || !newTitle) {
      console.log(
        `${YELLOW}Uso:${RESET} ${CYAN}edit <id> "Novo título da tarefa"${RESET}`
      );
      return;
    }
    await this.changeTitleUC.execute({ id, newTitle });
    console.log(
      `${GREEN}✏️ Tarefa renomeada:${RESET} ${BRIGHT}${BLUE}[${id}]${RESET} ${WHITE}${newTitle}${RESET}`
    );
  }

  private async handleFilter(params: string[]) {
    const keyword = params.join(" ").trim();
    if (!keyword) {
      console.log(
        `${YELLOW}Uso:${RESET} ${CYAN}filter <palavra-chave>${RESET}`
      );
      return;
    }
    const { tasks } = await this.listUC.execute({ keyword });
    if (tasks.length === 0) {
      console.log(
        `${YELLOW}Nenhuma tarefa encontrada com "${keyword}".${RESET}`
      );
      return;
    }
    for (const t of tasks) {
      console.log(this.formatTask(t));
    }
  }

  private formatTask(t: Task): string {
    const status = t.completed ? `${GREEN}✔${RESET}` : `${YELLOW}✖${RESET}`;
    const id = `${BRIGHT}${BLUE}[${t.id}]${RESET}`;
    const title = `${WHITE}${t.title}${RESET}`;
    const date = `${DIM}${CYAN}${t.createdAt.toISOString()}${RESET}`;
    return `${id} ${status} ${title} (${date})`;
  }

  private printHelp() {
    console.log(`
${BRIGHT}Comandos disponíveis:${RESET}
  ${CYAN}add "Título da tarefa"${RESET}          → Criar nova tarefa
  ${CYAN}list${RESET}                            → Listar todas as tarefas
  ${CYAN}remove <id>${RESET}                     → Remover tarefa pelo ID
  ${CYAN}complete <id>${RESET}                   → Marcar tarefa como concluída
  ${CYAN}undo <id>${RESET}                       → Desfazer conclusão da tarefa
  ${CYAN}edit <id> "Novo título da tarefa"${RESET} → Alterar título da tarefa
  ${CYAN}filter <palavra-chave>${RESET}          → Filtrar tarefas por palavra
  ${CYAN}help${RESET}                            → Mostrar esta ajuda
  ${CYAN}exit | quit${RESET}                     → Sair da aplicação
`);
  }
}
