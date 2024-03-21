import { type } from "os";
import { Pool } from "pg";

export type SeatType = {
  seat_type_id: string;
  type_name: string;
  width_cm: number;
  height_cm: number;
  pitch_cm: number;
  weight_kg: number;
  version: number;
};

export interface SeatTypesDAL {
  getSeatTypeById(seatTypeId: string): Promise<SeatType | null>;
}

export class PostgresSeatTypesDAL implements SeatTypesDAL {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
  async getSeatTypeById(seatTypeId: string): Promise<SeatType | null> {
    try {
      const res = await this.pool.query(
        "SELECT * FROM fleetops.seat_types WHERE seat_type_id = $1",
        [seatTypeId]
      );
      if (res.rows.length) {
        return this.map(res.rows[0], res.rows[0].__version);
      } else {
        return null;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private map(unitData: any, version: number): SeatType {
    return {
      seat_type_id: unitData.seat_type_id,
      type_name: unitData.type_name,
      width_cm: unitData.width_cm,
      height_cm: unitData.height_cm,
      pitch_cm: unitData.pitch_cm,
      weight_kg: unitData.weight_kg,
      version: version,
    };
  }
}
