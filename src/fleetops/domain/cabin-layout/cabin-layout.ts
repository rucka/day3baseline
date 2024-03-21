import { CabinLayout as CabinLayoutModel, Row } from "../../model/cabin-layout";
import { ValidateCabinLayoutDomainService } from "./domain-services";
import { CabinLayoutCommand, CabinLayoutId } from "./commands";

export type Status = "Active" | "Draft" | "Disabled";
export type CabinLayoutDTO = CabinLayoutModel & { status: Status };

export class CabinLayout {
  private readonly id: CabinLayoutId;
  private version: number = 0;
  private width: number = 0;
  private length: number = 0;
  private rows: Row[] = [];
  private status: Status = "Draft";

  private validateService: ValidateCabinLayoutDomainService;

  constructor(
    id: CabinLayoutId,
    version: number = 0,
    validateService: ValidateCabinLayoutDomainService
  ) {
    this.id = id;
    this.version = version;
    this.validateService = validateService;
  }

  public async execute(cmd: CabinLayoutCommand) {
    if (cmd.aggregateId !== this.id) {
      throw new Error("Invalid command");
    }

    switch (cmd.type) {
      case "InitCabinLayout":
        this.initCabinLayoutExecute(cmd.width, cmd.length, cmd.rows);
        break;
      case "ActivateCabinLayout":
      case "DisableCabinLayout":
        await this.changeCabinLayoutStatusExecute(cmd.status);
        break;
    }
  }
  initCabinLayoutExecute(width: number, length: number, rows: Row[]) {
    if (this.status !== "Draft") {
      throw new Error("Cannot init Cabin layout is not in draft status");
    }

    this.width = width;
    this.length = length;
    this.rows = rows;
  }
  async changeCabinLayoutStatusExecute(status: Status) {
    if (status === "Draft") {
      throw new Error("Cannot change status to draft");
    }
    this.status = status;
    this.validateService.validate(this);
  }

  public getVersion() {
    return this.version;
  }

  toDTO(): CabinLayoutDTO {
    return {
      layoutId: this.id,
      version: this.version,
      width: this.width,
      length: this.length,
      rows: this.rows,
      status: this.status,
    };
  }

  static fromDTO(
    dto: CabinLayoutDTO,
    validateService: ValidateCabinLayoutDomainService
  ): CabinLayout {
    const layout = new CabinLayout(dto.layoutId, dto.version, validateService);
    layout.width = dto.width;
    layout.length = dto.length;
    layout.rows = dto.rows;
    if (!dto.status) {
      dto.status = "Draft";
    } else {
      layout.status = dto.status;
    }
    validateService.validate(layout);
    return layout;
  }
}
