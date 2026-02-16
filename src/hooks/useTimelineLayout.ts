import { useEffect, useState } from 'react'

export function useTimelineLayout(
	circleRef: React.RefObject<HTMLDivElement | null>,
) {
	const [circleSize, setCircleSize] = useState(0)

	useEffect(() => {
		const update = () => {
			const el = circleRef.current
			if (!el) return

			const rect = el.getBoundingClientRect()
			setCircleSize(rect.width)

			const centerY = rect.top + rect.height / 2
			document.documentElement.style.setProperty(
				'--timeline-cross-y',
				`${centerY}px`,
			)
		}

		update()

		window.addEventListener('resize', update)
		window.addEventListener('scroll', update, { passive: true })

		return () => {
			window.removeEventListener('resize', update)
			window.removeEventListener('scroll', update)
		}
	}, [circleRef])

	return circleSize
}
