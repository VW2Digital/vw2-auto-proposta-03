import { Link } from 'react-router-dom'

export default function Logo({ className = '', to = '/', invert = false }) {
  return (
    <Link to={to} className={`inline-flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Nexo Studio"
        className={`h-7 w-auto sm:h-8 ${invert ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  )
}
