import { randomUUID } from "crypto";
import { IIdGenerator } from "../domain/id-generator.interface";

export class UUIDGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
