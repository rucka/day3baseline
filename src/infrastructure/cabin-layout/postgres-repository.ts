import {
  CabinLayout,
  CabinLayoutDTO,
} from "../../domain/cabin-layout/cabin-layout";
import { CabinLayoutRepository } from "../../domain/cabin-layout/repository";
import { Pool } from "pg";
import { CabinLayoutsDAL } from "../../data-access/cabin-layouts-dal";
import { ValidateCabinLayoutDomainService } from "../../domain/cabin-layout/domain-services";
import { PostgresSeatTypesDAL } from "../../data-access/seat-types-dal";

export class PostgresCabinLayoutRepository implements CabinLayoutRepository {
  public dal: CabinLayoutsDAL;
  public pool: Pool;
  public validateService: ValidateCabinLayoutDomainService;

  constructor(
    pool: Pool,
    dal: CabinLayoutsDAL,
    validateService: ValidateCabinLayoutDomainService
  ) {
    this.dal = dal;
    this.pool = pool;
    this.validateService = validateService;
  }

  async save(cabinLayout: CabinLayout): Promise<void> {
    const dto: CabinLayoutDTO = cabinLayout.toDTO();
    if (dto.version === 0) {
      await this.dal.createCabinLayout(dto);
    }
    {
      await this.dal.updateCabinLayout(dto);
    }
  }
  async load(id: string): Promise<CabinLayout> {
    const dto: CabinLayoutDTO | undefined = (await this.dal.getCabinLayoutById(
      id
    )) as CabinLayoutDTO | undefined;

    if (!dto) {
      throw new Error(`Cabin layout with id ${id} not found`);
    }
    return CabinLayout.fromDTO(dto, this.validateService);
  }
  async loadAll(): Promise<CabinLayout[]> {
    const toAggregate = (dto: CabinLayoutDTO): CabinLayout =>
      CabinLayout.fromDTO(dto, this.validateService);
    const dtos = (await this.dal.getCabinLayouts()) as CabinLayoutDTO[];
    return dtos.map((dto) => toAggregate(dto));
  }
}

export function createPostgresCabinLayoutRepository(pool: Pool) {
  const dal = new CabinLayoutsDAL(pool);
  const domainService = new ValidateCabinLayoutDomainService(
    new PostgresSeatTypesDAL(pool)
  );
  return new PostgresCabinLayoutRepository(pool, dal, domainService);
}
