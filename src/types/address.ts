export interface Province {
  name: string;
  id: number | string;
}

export interface District {
  name: string;
  id: number | string;
  provinceId: number | string;
}

export interface Ward {
  name: string;
  id: number | string;
  districtId: number | string;
}

export enum AddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  OTHER = "OTHER",
}

export interface Address {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  detail: string;
  userId: string;
  isDefault: boolean;
  type: AddressType;
  province: Province;
  district: District;
  ward: Ward;
}
