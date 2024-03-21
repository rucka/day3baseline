import {
  CabinLayoutCommand,
  CabinLayoutId,
} from "../domain/cabin-layout/commands";
import { CabinLayoutRepository } from "../domain/cabin-layout/repository";
import { CabinLayout } from "../domain/cabin-layout/cabin-layout";
import {
  ExecutionResults,
  ExucutionResult,
  Failure,
  Success,
} from "./execution-results";

export class CabinLayoutApplicationService {
  public readonly repository: CabinLayoutRepository;

  constructor(repository: CabinLayoutRepository) {
    this.repository = repository;
  }

  public async Execute(
    command: CabinLayoutCommand
  ): Promise<ExucutionResult<CabinLayoutId>> {
    try {
      let cabinLayout = await this.getCabinLayout(command);
      await cabinLayout.execute(command);
      await this.repository.save(cabinLayout);
      return {
        aggregateId: command.aggregateId,
        result: ExecutionResults.Success,
        newVersion: cabinLayout.getVersion(),
      } as Success<CabinLayoutId>;
    } catch (error: any) {
      return {
        aggregateId: command.aggregateId,
        result: ExecutionResults.Failure,
        error: error.message,
      } as Failure<CabinLayoutId>;
    }
  }

  private async getCabinLayout(
    command: CabinLayoutCommand
  ): Promise<CabinLayout> {
    if (command.type === "InitCabinLayout") {
      return new CabinLayout(
        command.aggregateId,
        0,
        this.repository.validateService
      );
    } else {
      const loaded = await this.repository.load(command.aggregateId);
      if (command.expectedVersion !== loaded.getVersion()) {
        throw new Error(
          `Cabin layout with id ${command.aggregateId} has already been modified`
        );
      }
      return loaded;
    }
  }
}
