import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

type Dot = { i: number; x: number; y: number }

type Props = {
	dots: Dot[]
	activeIndex: number
	rotationDeg: number
	total: number
	navDirRef: React.MutableRefObject<-1 | 1>
	onSelect: (i: number) => void
}

export function TimelineDots({
	dots,
	activeIndex,
	rotationDeg,
	total,
	navDirRef,
	onSelect,
}: Props) {
	const dotRefs = useRef<(HTMLButtonElement | null)[]>([])
	const prevActiveRef = useRef(0)

	useLayoutEffect(() => {
		if (dots.length !== total) return
		if (dotRefs.current.filter(Boolean).length !== total) return

		const small = 6 / 56
		const dur = 0.22

		const getEls = (i: number) => {
			const btn = dotRefs.current[i]
			if (!btn) return null
			const inner = btn.querySelector(
				'.timeline__dot-inner',
			) as HTMLSpanElement | null
			const pip = btn.querySelector(
				'.timeline__dot-pip',
			) as HTMLSpanElement | null
			const idx = btn.querySelector(
				'.timeline__dot-index',
			) as HTMLSpanElement | null
			return { btn, inner, pip, idx }
		}

		const applySmall = (i: number, immediate = false) => {
			const els = getEls(i)
			if (!els?.inner || !els.pip || !els.idx) return

			gsap.to(els.inner, {
				scale: small,
				backgroundColor: 'transparent',
				borderColor: 'transparent',
				boxShadow: 'none',
				duration: immediate ? 0 : dur,
				ease: 'power2.out',
				overwrite: 'auto',
			})

			gsap.to(els.pip, {
				autoAlpha: 1,
				scale: 1 / small,
				transformOrigin: '50% 50%',
				duration: immediate ? 0 : 0.18,
				ease: 'power2.out',
				overwrite: 'auto',
			})

			gsap.to(els.idx, {
				autoAlpha: 0,
				scale: 0.9,
				duration: immediate ? 0 : 0.18,
				ease: 'power2.out',
				overwrite: 'auto',
			})
		}

		const applyBig = (i: number, immediate = false) => {
			const els = getEls(i)
			if (!els?.inner || !els.pip || !els.idx) return

			gsap.to(els.inner, {
				scale: 1,
				backgroundColor: '#f4f5f9',
				borderColor: 'rgba(66, 86, 122, 1)',
				boxShadow: '0 6px 18px rgba(66, 86, 122, 0.12)',
				duration: immediate ? 0 : dur,
				ease: 'power2.out',
				overwrite: 'auto',
			})

			gsap.to(els.pip, {
				autoAlpha: 0,
				scale: 1,
				transformOrigin: '50% 50%',
				duration: immediate ? 0 : 0.18,
				ease: 'power2.out',
				overwrite: 'auto',
			})

			gsap.to(els.idx, {
				autoAlpha: 1,
				scale: 1,
				duration: immediate ? 0 : 0.18,
				ease: 'power2.out',
				overwrite: 'auto',
			})
		}

		dotRefs.current.forEach((_, i) => {
			if (i === activeIndex) applyBig(i, true)
			else applySmall(i, true)
		})

		const prev = prevActiveRef.current
		const next = activeIndex
		const dir = navDirRef.current

		if (prev !== next) {
			const prevEls = getEls(prev)
			const nextEls = getEls(next)

			if (prevEls?.inner) {
				gsap.fromTo(
					prevEls.inner,
					{ x: 0 },
					{
						x: dir * -10,
						duration: 0.14,
						ease: 'power2.out',
						overwrite: 'auto',
						onComplete: () => {
							gsap.set(prevEls.inner!, { x: 0 })
						},
					},
				)
				applySmall(prev, false)
			}

			if (nextEls?.inner) {
				gsap.fromTo(
					nextEls.inner,
					{ x: dir * 10, scale: 6 / 56 },
					{
						x: 0,
						scale: 1,
						duration: 0.22,
						ease: 'power2.out',
						overwrite: 'auto',
					},
				)
				applyBig(next, false)
			}

			prevActiveRef.current = next
		}

		const cleanups: Array<() => void> = []

		dotRefs.current.forEach((btn, i) => {
			if (!btn) return

			const onEnter = () => {
				if (i === activeIndex) return
				applyBig(i, false)
			}

			const onLeave = () => {
				if (i === activeIndex) return
				applySmall(i, false)
			}

			btn.addEventListener('pointerenter', onEnter)
			btn.addEventListener('pointerleave', onLeave)

			cleanups.push(() => {
				btn.removeEventListener('pointerenter', onEnter)
				btn.removeEventListener('pointerleave', onLeave)
			})
		})

		return () => cleanups.forEach(fn => fn())
	}, [activeIndex, dots, total, navDirRef])

	return (
		<>
			{dots.map(({ i, x, y }) => {
				const style: React.CSSProperties = {
					top: '50%',
					left: '50%',
					transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
				}

				return (
					<button
						key={i}
						type='button'
						ref={el => {
							dotRefs.current[i] = el
						}}
						className='timeline__dot'
						style={style}
						onClick={() => onSelect(i)}
						aria-label={`Select period ${i + 1}`}
						data-active={i === activeIndex ? 'true' : 'false'}
					>
						<span
							className='timeline__dot-rot'
							style={{ transform: `rotate(${-rotationDeg}deg)` }}
						>
							<span className='timeline__dot-inner'>
								<span className='timeline__dot-pip' />
								<span className='timeline__dot-index'>{i + 1}</span>
							</span>
						</span>
					</button>
				)
			})}
		</>
	)
}

export default TimelineDots