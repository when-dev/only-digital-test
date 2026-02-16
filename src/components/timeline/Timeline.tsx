import gsap from 'gsap'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Slider from '../slider/Slider'
import './Timeline.scss'
import { timelinePeriods } from './timelineData'
import { useTimelineLayout } from '../../hooks/useTimelineLayout'
import { TimelineYears } from './TimelineYears'
import TimelineDots from './TimelineDots'
import {
	getTimelineAnchor,
	getTimelineDots,
} from '../../utils/timelineGeometry'

export function Timeline() {
	const circleRef = useRef<HTMLDivElement | null>(null)

	const sliderRef = useRef<HTMLDivElement | null>(null)
	const navDirRef = useRef<-1 | 1>(1)

	const circleSize = useTimelineLayout(circleRef)

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

	const dots = useMemo(
		() => getTimelineDots({ size: circleSize, total }),
		[circleSize, total],
	)

	const anchor = useMemo(
		() => getTimelineAnchor({ size: circleSize }),
		[circleSize],
	)

	const categoryStyle: React.CSSProperties | undefined = anchor
		? {
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) translate(${anchor.x}px, ${anchor.y}px) translate(86px, 0)`,
			}
		: undefined

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
						<TimelineYears minYear={minYear} maxYear={maxYear} />

						<div className='timeline__circle-wrap' ref={circleRef}>
							<div className='timeline__circle'>
								<div
									className='timeline__wheel'
									style={{ transform: `rotate(${rotationDeg}deg)` }}
								>
									<TimelineDots
										dots={dots}
										total={total}
										activeIndex={activeIndex}
										rotationDeg={rotationDeg}
										navDirRef={navDirRef}
										onSelect={setActiveIndex}
									/>
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
