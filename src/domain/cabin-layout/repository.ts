import { CabinLayout } from "./cabin-layout";
import { ValidateCabinLayoutDomainService } from "./domain-services";

export interface CabinLayoutRepository {
  validateService: ValidateCabinLayoutDomainService;
  save(cabinLayout: CabinLayout): Promise<void>;
  load(id: string): Promise<CabinLayout>;
  loadAll(): Promise<CabinLayout[]>;
}
