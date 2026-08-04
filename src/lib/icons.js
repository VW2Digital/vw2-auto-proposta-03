import {
  Palette,
  Share2,
  Megaphone,
  Layout,
  Lightbulb,
  Database,
  Users,
  Clapperboard,
  Bot,
  MapPin,
  Compass,
  Rocket,
  Briefcase,
  GraduationCap,
  HeartPulse,
} from 'lucide-react'

const ICONS = {
  Palette,
  Share2,
  Megaphone,
  Layout,
  Lightbulb,
  Database,
  Users,
  Clapperboard,
  Bot,
  MapPin,
  Compass,
  Rocket,
  Briefcase,
  GraduationCap,
  HeartPulse,
}

export function resolveIcon(name, fallback = Layout) {
  if (typeof name === 'function') return name
  return ICONS[name] || fallback
}
