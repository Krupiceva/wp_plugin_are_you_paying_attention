import React from 'react'
import ReactDOM from 'react-dom'
import './frontend.scss'

const divsToUpdate = document.querySelectorAll('.paying-attention-update-me')

divsToUpdate.forEach((div) => {
	const data = JSON.parse(div.querySelector('pre').innerHTML)
	ReactDOM.render(<Quiz {...data} />, div)
	div.classList.remove('paying-attention-update-me')
})

function Quiz(props) {
	const { question, answers } = props
	return (
		<div className='paying-attention-frontend'>
			<p>{question}</p>
			<ul>
				{answers.map((answer) => {
					return <li>{answer}</li>
				})}
			</ul>
		</div>
	)
}
