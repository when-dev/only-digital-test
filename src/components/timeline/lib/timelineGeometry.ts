export type TimelineDotPoint = { i: number; x: number; y: number }

export function getTimelineDots(params: {
	size: number
	total: number
	startRad?: number
}): TimelineDotPoint[] {
	const { size, total, startRad = -Math.PI / 3 } = params
	if (!size || total <= 0) return []

	const r = size / 2
	const radius = r

	return Array.from({ length: total }, (_, i) => {
		const angle = startRad + (2 * Math.PI * i) / total
		const x = Math.cos(angle) * radius
		const y = Math.sin(angle) * radius
		return { i, x, y }
	})
}

export function getTimelineAnchor(params: {
	size: number
	startRad?: number
}): { x: number; y: number } | null {
	const { size, startRad = -Math.PI / 3 } = params
	if (!size) return null

	const r = size / 2
	return {
		x: Math.cos(startRad) * r,
		y: Math.sin(startRad) * r,
	}
}