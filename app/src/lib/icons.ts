import { Brain, Heart, Leaf, Sparkles, Users, type LucideIcon } from 'lucide-react'
import type { IconName } from '../data/content'

/** Maps the data layer's abstract icon names to their Lucide components. */
export const ICONS: Record<IconName, LucideIcon> = {
  heart: Heart,
  brain: Brain,
  users: Users,
  leaf: Leaf,
  sparkles: Sparkles,
}
