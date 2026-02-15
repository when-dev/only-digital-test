import gsap from 'gsap'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Slider from '../slider/Slider'
import './Timeline.scss'
import { timelinePeriods } from './timelineData'

export function Timeline() {
	const circleRef = useRef<HTMLDivElement | null>(null)
	const dotRefs = useRef<(HTMLButtonElement | null)[]>([])
	const yearsFromRef = useRef<HTMLSpanElement | null>(null)
	const yearsToRef = useRef<HTMLSpanElement | null>(null)
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const prevActiveRef = useRef(0)
	const navDirRef = useRef<-1 | 1>(1)
	const yearsPrevRef = useRef<{ a: number; b: number } | null>(null)

	const [circleSize, setCircleSize] = useState(0)
	const [activeIndex, setActiveIndex] = useState(0)

	const total = timelinePeriods.length
	if (total < 2) {
		console.warn('timelinePeriods should contain 2..6 periods')
	}

	const activePeriod = timelinePeriods[activeIndex]

	const { minYear, maxYear } = useMemo(() => {
		const years = activePeriod.events.map(e => e.year)
		return {
			minYear: Math.min(...years),
			maxYear: Math.max(...years),
		}
	}, [activePeriod])

	const counterText = `${String(activeIndex + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`

	const goPrev = () => {
		navDirRef.current = -1
		setActiveIndex(i => (i - 1 + total) % total)
	}
	const goNext = () => {
		navDirRef.current = 1
		setActiveIndex(i => (i + 1) % total)
	}

	const stepDeg = 360 / total

	const rotationDeg = -activeIndex * stepDeg

	const dots = useMemo(() => {
		if (!circleSize || total === 0) return []

		const r = circleSize / 2
		const startRad = -Math.PI / 3
		const radius = r

		return Array.from({ length: total }, (_, i) => {
			const angle = startRad + (2 * Math.PI * i) / total
			const x = Math.cos(angle) * radius
			const y = Math.sin(angle) * radius
			return { i, x, y }
		})
	}, [circleSize, total])

	const anchor = useMemo(() => {
		if (!circleSize) return null

		const r = circleSize / 2
		const startRad = -Math.PI / 3
		const x = Math.cos(startRad) * r
		const y = Math.sin(startRad) * r
		return { x, y }
	}, [circleSize])

	const categoryStyle: React.CSSProperties | undefined = anchor
		? {
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) translate(${anchor.x}px, ${anchor.y}px) translate(86px, 0)`,
			}
		: undefined

	useEffect(() => {
		const updateCrossY = () => {
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

		updateCrossY()

		window.addEventListener('resize', updateCrossY)
		window.addEventListener('scroll', updateCrossY, { passive: true })

		return () => {
			window.removeEventListener('resize', updateCrossY)
			window.removeEventListener('scroll', updateCrossY)
		}
	}, [])

	useLayoutEffect(() => {
		if (!circleSize) return
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

		const prev = prevActiveRef.current
		const next = activeIndex
		const dir = navDirRef.current

		dotRefs.current.forEach((_, i) => {
			if (i === next) applyBig(i, true)
			else applySmall(i, true)
		})

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
	}, [activeIndex, total, circleSize])

	useLayoutEffect(() => {
		const fromEl = yearsFromRef.current
		const toEl = yearsToRef.current
		if (!fromEl || !toEl) return

		const prev = yearsPrevRef.current ?? { a: minYear, b: maxYear }
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
				yearsPrevRef.current = { a: minYear, b: maxYear }
			},
		})
	}, [minYear, maxYear])

	useLayoutEffect(() => {
		if (!sliderRef.current) return

		gsap.fromTo(
			sliderRef.current,
			{ autoAlpha: 0, y: 12 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.35,
				ease: 'power2.out',
				overwrite: 'auto',
			},
		)
	}, [activeIndex])

	return (
		<section className='timeline'>
			<div className='timeline__grid' aria-hidden='true'>
				<span className='timeline__grid-centerLine' />
			</div>

			<div className='timeline__container'>
				<div className='timeline__content'>
					<header className='timeline__header'>
						<span className='timeline__accent' aria-hidden='true' />
						<h2 className='timeline__title'>
							Исторические <br /> даты
						</h2>
					</header>

					<div className='timeline__stage'>
						<div className='timeline__years' aria-hidden='true'>
							<span
								ref={yearsFromRef}
								className='timeline__year timeline__year--from'
							>
								{minYear}
							</span>
							<span
								ref={yearsToRef}
								className='timeline__year timeline__year--to timeline__year-right'
							>
								{maxYear}
							</span>
						</div>

						<div className='timeline__circle-wrap' ref={circleRef}>
							<div className='timeline__circle'>
								<div
									className='timeline__wheel'
									style={{ transform: `rotate(${rotationDeg}deg)` }}
								>
									{dots.map(({ i, x, y }) => {
										const style: React.CSSProperties = {
											top: '50%',
											left: '50%',
											transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
										}

										return (
											<button
												key={timelinePeriods[i].id}
												type='button'
												ref={el => {
													dotRefs.current[i] = el
												}}
												className='timeline__dot'
												style={style}
												onClick={() => setActiveIndex(i)}
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
								</div>
							</div>

							<div className='timeline__category' style={categoryStyle}>
								{activePeriod.title}
							</div>
						</div>
					</div>

					<div className='timeline__bottom'>
						<div className='timeline__nav'>
							<div className='timeline__counter'>{counterText}</div>

							<div className='timeline__buttons'>
								<button
									onClick={goPrev}
									className='timeline__btn'
									type='button'
									aria-label='Prev'
								>
									<svg width='8' height='12' viewBox='0 0 8 12' fill='none'>
										<path
											d='M7 1L2 6L7 11'
											stroke='#42567A'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</button>
								<button
									onClick={goNext}
									className='timeline__btn'
									type='button'
									aria-label='Next'
								>
									<svg width='8' height='12' viewBox='0 0 8 12' fill='none'>
										<path
											d='M1 1L6 6L1 11'
											stroke='#42567A'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</button>
							</div>
						</div>
						<div ref={sliderRef} className='timeline__slider'>
							<Slider events={activePeriod.events} />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Timeline
