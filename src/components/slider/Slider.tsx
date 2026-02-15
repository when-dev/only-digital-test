import { Swiper, SwiperSlide } from 'swiper/react';
import type { TimelineEvent } from '../timeline/timelineData';

import 'swiper/css';
import './Slider.scss';

type Props = {
	events: TimelineEvent[];
}

export function Slider({ events }: Props) {
	return (
		<div className="events">
			<Swiper
				slidesPerView={3}
				spaceBetween={24}
				speed={500}
				breakpoints={{
					0: { slidesPerView: 1.2, spaceBetween: 16 },
					768: { slidesPerView: 2.2, spaceBetween: 20 },
					1024: { slidesPerView: 3, spaceBetween: 24 },
				}}
			>
				{events.map((e) => (
					<SwiperSlide key={`${e.year}-${e.text}`}>
						<article className='events__card'>
							<div className="events__year">{e.year}</div>
							<div className="events__text">{e.text}</div>
						</article>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default Slider