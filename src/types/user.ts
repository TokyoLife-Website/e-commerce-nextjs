import { Gender } from "./gender";
import { Image } from "./image";
import { Role } from "./role";

export interface User {
  id: string | number;
  avatar: Image;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  role: Role;
}
