import { UserType } from "./Common";

export interface AuthUser {
    id: number,
    type: UserType,
    name: string,
    email: string,
}