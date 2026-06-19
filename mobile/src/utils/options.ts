import { Frequency, Unities } from "@/types/Common";

type UnitOptionType = {
    value: Unities,
    label: string
}

type FrequencyOptionType = {
    value: Frequency,
    label: string
}

export const UNITS_OPTIONS: UnitOptionType[] = [
    {value: "kilograms", label: "kg"},
    {value: "units", label: "un"},
    {value: "boxes", label: "cx"},
    {value: "liters", label: "lt"}
]

export const FREQUENCY_OPTIONS: FrequencyOptionType[] = [
    {value: "weekly", label: "Semanal"},
    {value: "biweekly", label: "Quinzenal"},
    {value: "monthly", label: "Mensal"},
    {value: "bimonthly", label: "Bimestral"}
]

export const MONTHS_OPTIONS = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
] as const;

// Converte o "value" das opcoes para o label legivel (envia ao backend de forma consistente
// com os dados de seed). Se ja for um label conhecido, retorna inalterado.
export const unitLabel = (value: string) =>
    UNITS_OPTIONS.find((o) => o.value === value)?.label ?? value;

export const frequencyLabel = (value: string) =>
    FREQUENCY_OPTIONS.find((o) => o.value === value)?.label ?? value;