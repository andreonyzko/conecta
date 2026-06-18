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