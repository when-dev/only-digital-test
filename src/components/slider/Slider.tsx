import { useMemo, useState } from 'react'
import { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { TimelineEvent } from '../timeline/mockData/timelineData'

import 'swiper/css'
import './Slider.scss'

type Props = {
	events: TimelineEvent[]
}

export function Slider({ events }: Props) {
	const [swiper, setSwiper] = useState<SwiperType | null>(null)
	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)

	const updateEdges = (s: SwiperType) => {
		setIsBeginning(s.isBeginning)
		setIsEnd(s.isEnd)
	}

	const sliderKey = useMemo(() => {
		const first = events[0]?.year ?? 'x'
		const last = events[events.length - 1]?.year ?? 'y'
		return `${first}-${last}-${events.length}`
	}, [])

	return (
		<div className='events'>
			<Swiper
				key={sliderKey}
				onSwiper={s => {
					setSwiper(s)
					requestAnimationFrame(() => updateEdges(s))
				}}
				onSlideChange={s => updateEdges(s)}
				onReachBeginning={s => updateEdges(s)}
				onReachEnd={s => updateEdges(s)}
				slidesPerView={3}
				spaceBetween={24}
				speed={500}
				breakpoints={{
					0: { slidesPerView: 1.2, spaceBetween: 16 },
					768: { slidesPerView: 2.2, spaceBetween: 20 },
					1024: { slidesPerView: 3, spaceBetween: 24 },
				}}
			>
				{events.map(e => (
					<SwiperSlide key={`${e.year}-${e.text}`}>
						<article className='events__card'>
							<div className='events__year'>{e.year}</div>
							<div className='events__text'>{e.text}</div>
						</article>
					</SwiperSlide>
				))}
			</Swiper>

			{!isBeginning && (
				<button
					type='button'
					className='events__arrow events__arrow--left'
					aria-label='Previous slide'
					onClick={() => swiper?.slidePrev()}
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
			)}

			{!isEnd && (
				<button
					type='button'
					className='events__arrow events__arrow--right'
					aria-label='Next slide'
					onClick={() => swiper?.slideNext()}
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
			)}
		</div>
	)
}

export default Slider
