import { Gender } from "./gender";
import { Role } from "./role";

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  role: Role;
}
