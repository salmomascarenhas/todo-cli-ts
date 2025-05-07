export class Task {
  private _title: string;
  private _createdAt: Date;
  private _completed: boolean;

  constructor(
    public readonly id: string,
    title: string,
    createdAt?: Date,
    completed?: boolean
  ) {
    this.ensureTitleValid(title);
    this._title = title;
    this._createdAt = createdAt ?? new Date();
    this._completed = completed ?? false;
  }

  get title(): string {
    return this._title;
  }

  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }

  get completed(): boolean {
    return this._completed;
  }

  complete(): void {
    this._completed = true;
  }

  undoComplete(): void {
    this._completed = false;
  }

  changeTitle(newTitle: string): void {
    this.ensureTitleValid(newTitle);
    this._title = newTitle;
  }

  matchesKeyword(keyword: string): boolean {
    return this._title.toLowerCase().includes(keyword.toLowerCase());
  }

  private ensureTitleValid(title: string): void {
    if (!title || title.trim().length === 0)
      throw new Error("Título não pode ser vazio.");
    if (title.length > 255)
      throw new Error("Título deve ter no máximo 255 caracteres.");
  }
}
