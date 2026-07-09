import { create } from 'zustand'

interface MapStore {
  lat: number | null
  lng: number | null
  locationStatus: 'idle' | 'loading' | 'granted' | 'denied'
  setLocation: (lat: number, lng: number) => void
  setLocationStatus: (status: MapStore['locationStatus']) => void

  radiusKm: number
  filterTypes: string[]
  openToPublicOnly: boolean
  setRadiusKm: (km: number) => void
  toggleFilterType: (type: string) => void
  setOpenToPublicOnly: (value: boolean) => void
  clearFilters: () => void

  selectedFarmId: string | null
  setSelectedFarmId: (id: string | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  lat: null,
  lng: null,
  locationStatus: 'idle',
  setLocation: (lat, lng) => set({ lat, lng }),
  setLocationStatus: (locationStatus) => set({ locationStatus }),

  radiusKm: 50,
  filterTypes: [],
  openToPublicOnly: false,
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  toggleFilterType: (type) =>
    set((state) => ({
      filterTypes: state.filterTypes.includes(type)
        ? state.filterTypes.filter((t) => t !== type)
        : [...state.filterTypes, type],
    })),
  setOpenToPublicOnly: (openToPublicOnly) => set({ openToPublicOnly }),
  clearFilters: () => set({ radiusKm: 50, filterTypes: [], openToPublicOnly: false }),

  selectedFarmId: null,
  setSelectedFarmId: (selectedFarmId) => set({ selectedFarmId }),
}))
