import { api } from "@/lib/api";
import { AuthUser } from "@/types/AuthUser";
import { UserType } from "@/types/Common";
import {
  FarmerBackResponse,
  InstitutionBackResponse,
  JWTPayLoad,
  LoginDTO,
  RegisterUserDTO,
} from "@/types/Backend";
import { jwtDecode } from "jwt-decode";

export interface RegisterData {
  userType: UserType;
  name: string;
  email: string;
  phone: string;
  password: string;
  cpfCnpj: string;
  caf?: string;
  studentsAmount?: number;
}

class AuthService {
  async login(email: string, password: string): Promise<{user: AuthUser, token: string}> {
    const normalizedEmail = email.trim().toLocaleLowerCase();

    const data: LoginDTO = {
      email: normalizedEmail,
      senha: password,
    };

    const response = await api.post<ResponseData>("/auth/login", data);
    return convertResponse(response.data);
  }

  async signup(data: RegisterData): Promise<{user: AuthUser, token: string}> {
    const convertedData: RegisterUserDTO = {
      nome: data.name,
      cpfCnpj: data.cpfCnpj,
      caf: data.caf,
      telefone: data.phone,
      email: data.email,
      senha: data.password,
      role: data.userType === "farmer" ? "agricultor" : "instituicao",
      numeroAlunos: data.studentsAmount,
    };
    
    const response = await api.post<ResponseData>(
      "/auth/register",
      convertedData
    );

    return convertResponse(response.data);
  }
}

type ResponseData = {
  perfil: FarmerBackResponse | InstitutionBackResponse;
  accessToken: string;
};

const convertResponse = ({
  perfil,
  accessToken,
}: ResponseData): { user: AuthUser; token: string } => {
  const decodedToken = jwtDecode<JWTPayLoad>(accessToken);

  return {
    user: {
      id: decodedToken.perfilId,
      email: decodedToken.email,
      name: perfil.nome,
      type: decodedToken.role == "agricultor" ? "farmer" : "institution",
    },
    token: accessToken,
  };
};

export const authService = new AuthService();
