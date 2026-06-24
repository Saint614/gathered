import { useEffect } from 'react'
import { useMapStore } from '@/lib/store/useMapStore'

export function useLocation() {
  const lat = useMapStore((s) => s.lat)
  const lng = useMapStore((s) => s.lng)
  const locationStatus = useMapStore((s) => s.locationStatus)
  const setLocation = useMapStore((s) => s.setLocation)
  const setLocationStatus = useMapStore((s) => s.setLocationStatus)

  useEffect(() => {
    if (locationStatus !== 'idle') return

    setLocationStatus('loading')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude)
        setLocationStatus('granted')
      },
      () => {
        setLocationStatus('denied')
      }
    )
  }, [locationStatus, setLocation, setLocationStatus])

  return { lat, lng, locationStatus }
}
