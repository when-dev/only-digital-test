import { useEffect, useRef } from 'react'
import './Timeline.scss'

export function Timeline() {
	const circleRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const updateCrossY = () => {
			const el = circleRef.current
			if (!el) return

			const rect = el.getBoundingClientRect()
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
			<div className='timeline__grid' aria-hidden='true' >
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
							<span className='timeline__year timeline__year--from'>2015</span>
							<span className='timeline__year timeline__year--to timeline__year-right'>2022</span>
						</div>

						<div className='timeline__circle-wrap'>
							<div ref={circleRef} className='timeline__circle'>
								<span className='timeline__dot timeline__dot--topLeft' />
								<span className='timeline__dot timeline__dot--topRight timeline__dot--active'>
									<span className='timeline__dot-index'>6</span>
								</span>

								<span className='timeline__dot timeline__dot--left' />
								<span className='timeline__dot timeline__dot--right' />

								<span className='timeline__dot timeline__dot--bottomLeft' />
								<span className='timeline__dot timeline__dot--bottomRight' />
							</div>

							<div className='timeline__category'>Наука</div>
						</div>
					</div>

					<div className='timeline__bottom'>
						<div className='timeline__nav'>
							<div className='timeline__counter'>06/06</div>

							<div className='timeline__buttons'>
								<button
									className='timeline__btn'
									type='button'
									aria-label='Prev'
								>
									←
								</button>
								<button
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
