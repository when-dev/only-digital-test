import { useEffect, useRef, useMemo, useState } from 'react'
import { timelinePeriods } from './timelineData'
import './Timeline.scss'

export function Timeline() {
	const circleRef = useRef<HTMLDivElement | null>(null)
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

	const goPrev = () => setActiveIndex(i => (i - 1 + total) % total)
	const goNext = () => setActiveIndex(i => (i + 1) % total)

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
							<span className='timeline__year timeline__year--from'>
								{minYear}
							</span>
							<span className='timeline__year timeline__year--to timeline__year-right'>
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
										const isActive = i === activeIndex

										const style: React.CSSProperties = {
											top: '50%',
											left: '50%',
											// позиция точки (вращение wheel повлияет на позицию)
											transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
										}

										if (isActive) {
											return (
												<button
													key={timelinePeriods[i].id}
													type='button'
													className='timeline__dot timeline__dot--active'
													style={style}
													onClick={() => setActiveIndex(i)}
													aria-label={`Select period ${i + 1}`}
												>
													{/* индекс НЕ должен вращаться вместе с wheel */}
													<span
														className='timeline__dot-index'
														style={{ transform: `rotate(${-rotationDeg}deg)` }}
													>
														{i + 1}
													</span>
												</button>
											)
										}

										return (
											<button
												key={timelinePeriods[i].id}
												type='button'
												className='timeline__dot'
												style={style}
												onClick={() => setActiveIndex(i)}
												aria-label={`Select period ${i + 1}`}
											/>
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
									←
								</button>
								<button
									onClick={goNext}
									className='timeline__btn'
									type='button'
									aria-label='Next'
								>
									→
								</button>
							</div>
						</div>

						<div className='timeline__slider-placeholder'>
							slider placeholder
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Timeline
