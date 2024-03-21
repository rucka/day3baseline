import { SeatTypesDAL } from "../../data-access/seat-types-dal";
import { CabinLayout } from "./cabin-layout";

export class ValidateCabinLayoutDomainService {
  seatTypeDAL: SeatTypesDAL;
  constructor(seatTypeDAL: SeatTypesDAL) {
    this.seatTypeDAL = seatTypeDAL;
  }
  public async validate(cabinLayout: CabinLayout): Promise<void> {
    const data = cabinLayout.toDTO();
    if (data.status !== "Active") {
      return;
    }
  }
}
