import { useEffect, useState } from 'react'
import { services as fallbackServices } from '../data/services'
import { cms } from '../lib/cms'
import { resolveIcon } from '../lib/icons'

export function useServices() {
  const [services, setServices] = useState(fallbackServices)

  useEffect(() => {
    let active = true
    cms.getServices().then((remote) => {
      if (active && remote?.length) {
        setServices(
          remote.map((s) => ({
            ...s,
            icon: resolveIcon(s.icon),
          })),
        )
      }
    })
    return () => {
      active = false
    }
  }, [])

  return services
}
