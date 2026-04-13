import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faBox,
  faScaleBalanced,
  faWeightHanging,
  faBottleDroplet,
  faFlask
} from "@fortawesome/free-solid-svg-icons"
import { UnitType } from "../entity/ShoppingListItem"
import { CustomSelectOption } from "@/components/ui/CustomSelect"

// Centralized unit theming: icon + color per unit type
export const UNIT_CONFIG: Record<UnitType, { label: string; icon: IconDefinition; color: string }> = {
  unit: { label: 'Unit', icon: faBox, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  g:    { label: 'g',    icon: faScaleBalanced, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  kg:   { label: 'kg',   icon: faWeightHanging, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  ml:   { label: 'ml',   icon: faBottleDroplet, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  l:    { label: 'L',    icon: faFlask, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
}

// Derive UNIT_OPTIONS for CustomSelect from UNIT_CONFIG
export const UNIT_OPTIONS: CustomSelectOption<UnitType>[] = Object.entries(UNIT_CONFIG).map(
  ([key, config]) => ({
    value: key as UnitType,
    label: config.label,
    icon: config.icon,
    color: config.color,
  })
)

// Helper: get translated unit label
export function getUnitLabel(unit: UnitType, t: (key: string, opts?: Record<string, string>) => string): string {
  const config = UNIT_CONFIG[unit]
  return t(`units.${unit}`, { defaultValue: config?.label ?? unit })
}
