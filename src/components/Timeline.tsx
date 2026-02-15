import './Timeline.scss'

export function Timeline() {
	return (
		<section className='timeline'>
			<h2 className='timeline__title'>Timeline block</h2>

			<div className='timeline__years'>
				<span className='timeline_year'>2015</span>
				<span className='timeline_year'>2022</span>
			</div>

			<div className='timeline__circle-area'>
				<button className='timeline__arrow'>&#8592;</button>

				<div className='timeline__circle'>circle placeholder</div>

				<button className='timeline__arrow'>&#8594;</button>
			</div>

			<div className="timeline__slider-placeholder">
				slider placeholder
			</div>
		</section>
	)
}

export default Timeline
