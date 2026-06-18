import { UserType } from "./Common";

export interface AuthUser {
    id: string,
    type: UserType,
    name: string,
    email: string,
}