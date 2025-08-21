import { HttpParams } from "@angular/common/http";

export type AcMap = {
  code: AcControl;
  desc: AcControl;
  addons?: AcControl[];
}

export type AcControl = {
  key: string;
  setValue?: (value: any | null) => void;
  getValue?: () => any | null;
  title: string;
}

export type ActionPerformed = {
  type: 'autocomplete' | 'lov';
  data: any;
  status: Status.EMPTY | Status.FAIL | Status.SUCCESS;
}

export enum Status {
  FAIL = -1,
  EMPTY = 0,
  SUCCESS = 1
}

export interface AutoCompleteConfig {
  url: string;
  code?: string | number;
  map: AcMap;
  searchName?: string;
  desc?: string | null;
  type: 'autocomplete' | 'lov';
}