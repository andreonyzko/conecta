import { mockFarmers, mockInstitutions } from "@/data/mock";
import { AuthUser } from "@/types/AuthUser";
import { UserType } from "@/types/Common";

interface RegisterData {
  userType: UserType;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  caf?: string;
  studentsAmount?: number;
}

export function loginUser(email: string): AuthUser {
  const normalizedEmail = email.trim().toLocaleLowerCase();

  const users = [
    ...mockFarmers.map((f) => ({ ...f, type: "farmer" as const })),
    ...mockInstitutions.map((i) => ({ ...i, type: "institution" as const })),
  ];

  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) throw new Error("Credenciais inválidas.");

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type,
  };
}

export function register(data: RegisterData): AuthUser {
  const id = Date.now();

  if (data.userType === "farmer") {
    if (data.caf === undefined) throw new Error("Informe o CAF");
    mockFarmers.push({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpfCnpj,
      caf: data.caf,
      products: [],
      bidswon: [],
      reviews: [],
    });

    return {
      id,
      name: data.name,
      email: data.email,
      type: "farmer",
    };
  }

  if (data.studentsAmount === undefined)
    throw new Error("Informe o número de alunos");
  mockInstitutions.push({
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    cnpj: data.cpfCnpj,
    studentsAmount: data.studentsAmount,
  });
  return {
    id,
    name: data.name,
    email: data.email,
    type: "farmer",
  };
}
