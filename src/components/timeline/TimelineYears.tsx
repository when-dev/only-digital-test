import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

type Props = {
	minYear: number
	maxYear: number
}

export function TimelineYears({ minYear, maxYear }: Props) {
	const fromRef = useRef<HTMLSpanElement | null>(null)
	const toRef = useRef<HTMLSpanElement | null>(null)
	const prevRef = useRef<{ a: number; b: number } | null>(null)

	useLayoutEffect(() => {
		const fromEl = fromRef.current
		const toEl = toRef.current
		if (!fromEl || !toEl) return

		const prev = prevRef.current ?? { a: minYear, b: maxYear }
		const obj = { a: prev.a, b: prev.b }

		gsap.to(obj, {
			a: minYear,
			b: maxYear,
			duration: 0.6,
			ease: 'power2.out',
			overwrite: 'auto',
			onUpdate: () => {
				fromEl.textContent = String(Math.round(obj.a))
				toEl.textContent = String(Math.round(obj.b))
			},
			onComplete: () => {
				prevRef.current = { a: minYear, b: maxYear }
			},
		})
	}, [minYear, maxYear])

	return (
		<div className='timeline__years' aria-hidden='true'>
			<span ref={fromRef} className='timeline__year timeline__year--from'>
				{minYear}
			</span>

			<span
				ref={toRef}
				className='timeline__year timeline__year--to timeline__year-right'
			>
				{maxYear}
			</span>
		</div>
	)
}
