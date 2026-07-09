'use client'

interface FarmMapPinProps {
  selected?: boolean
}

export function FarmMapPin({ selected = false }: FarmMapPinProps): React.ReactElement {
  return (
    <div
      className={[
        'flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-md transition-transform duration-150',
        selected
          ? 'bg-green-700 border-white scale-125 z-10'
          : 'bg-white border-green-700 hover:scale-110',
      ].join(' ')}
      aria-label="Farm location"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-4 h-4 ${selected ? 'fill-white' : 'fill-green-700'}`}
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    </div>
  )
}
