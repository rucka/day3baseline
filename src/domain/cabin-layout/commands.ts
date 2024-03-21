import { Row } from "../../model/cabin-layout";
import { Command } from "../core/commands";

export type CabinLayoutId = string;
export type CabinLayoutCommand =
  | InitCabinLayout
  | ActivateCabinLayout
  | DisableCabinLayout;

export type InitCabinLayout = Command<CabinLayoutId> & {
  type: "InitCabinLayout";
  expectedVersion: number;
  width: number;
  length: number;
  rows: Row[];
  //timestamp: Date;
};

export type ActivateCabinLayout = Command<CabinLayoutId> & {
  type: "ActivateCabinLayout";
  status: "Active";
  expectedVersion: number;
};

export type DisableCabinLayout = Command<CabinLayoutId> & {
  type: "DisableCabinLayout";
  status: "Disabled";
  expectedVersion: number;
};
