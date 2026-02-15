import './Timeline.scss'

export function Timeline() {
	return (
		<section className='timeline'>
			<div className='timeline__container'>
				<header className='timeline__header'>
					<span className="timeline__accent" aria-hidden="true" />
					<h2 className='timeline__title'>Исторические <br/> даты</h2>
				</header>

				<div className='timeline__stage'>
					<div className='timeline__years'>
						<span className='timeline__year timeline__year--from'>2015</span>
						<span className='timeline__year timeline__year--to'>2022</span>
					</div>

					<div className='timeline__circle-wrap'>
						<div className='timeline__circle'>circle</div>

						<div className='timeline__category'>Наука</div>
					</div>
				</div>

				<div className='timeline__bottom'>
					<div className='timeline__nav'>
						<div className='timeline__counter'>06/06</div>
						<div className='timeline__buttons'>
							<button className='timeline__btn' type='button' aria-label='Prev'>
								←
							</button>
							<button className='timeline__btn' type='button' aria-label='Next'>
								→
							</button>
						</div>
					</div>
				<div className='timeline__slider-placeholder'>slider placeholder</div>
				</div>
			</div>
		</section>
	)
}

export default Timeline
