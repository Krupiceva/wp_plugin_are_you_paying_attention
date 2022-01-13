import './index.scss'
//Wordpress package have all react packages, we do not need to import react
import {
	TextControl,
	Flex,
	FlexBlock,
	FlexItem,
	Button,
	Icon,
	PanelBody,
	PanelRow,
} from '@wordpress/components'
import {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor'
import { ChromePicker } from 'react-color'

//So i dont need to make up a unique name of a function, immediately define and call this function
;(function () {
	let locked = false

	wp.data.subscribe(() => {
		const results = wp.data
			.select('core/block-editor')
			.getBlocks()
			.filter((block) => {
				return (
					block.name == 'ourplugin/are-you-paying-attention' &&
					block.attributes.correctAnswer == undefined
				)
			})

		if (results.length && locked == false) {
			locked = true
			wp.data.dispatch('core/editor').lockPostSaving('noanswer')
		}

		if (!results.length && locked) {
			locked = false
			wp.data.dispatch('core/editor').unlockPostSaving('noanswer')
		}
	})
})()

//Register new block type, backend part in editor is in edit function, frontend is in index.php, thats way save function return null
wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
	title: 'Are You Paying Attention?',
	icon: 'smiley',
	category: 'common',
	attributes: {
		question: { type: 'string' },
		answers: { type: 'array', default: [''] },
		correctAnswer: { type: 'number', default: undefined },
		bgColor: { type: 'string', default: '#EBEBEB' },
		theAlignment: { type: 'string', default: 'left' },
	},
	description: 'Give your audience a chance to prove their comprehension.',
	example: {
		attributes: {
			question: 'What is my name?',
			correctAnswer: 3,
			answers: ['Drupiceva', 'Brupiceva', 'Grupiceva', 'Krupiceva'],
			theAlignment: 'center',
			bgColor: '#CFE8F1',
		},
	},
	edit: EditComponent,
	save: () => {
		return null
	},
})

//Component of block type in editor screen
function EditComponent(props) {
	function updateQuestion(value) {
		props.setAttributes({ question: value })
	}

	function deleteAnswer(indexToDelete) {
		const newAnswers = props.attributes.answers.filter((x, index) => {
			return index != indexToDelete
		})
		props.setAttributes({ answers: newAnswers })

		//If we are deleting correct answer then new correct answer need to be set to undefined
		if (indexToDelete === props.attributes.correctAnswer) {
			props.setAttributes({ correctAnswer: undefined })
		}
	}

	function markAsCorrect(index) {
		props.setAttributes({ correctAnswer: index })
	}

	return (
		<div
			className='paying-attention-edit-block'
			style={{ backgroundColor: props.attributes.bgColor }}>
			<BlockControls>
				<AlignmentToolbar
					value={props.attributes.theAlignment}
					onChange={(x) => props.setAttributes({ theAlignment: x })}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title='Background Color' initialOpen={true}>
					<PanelRow>
						<ChromePicker
							color={props.attributes.bgColor}
							onChangeComplete={(x) =>
								props.setAttributes({ bgColor: x.hex })
							}
							disableAlpha={true}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<TextControl
				label='Question:'
				style={{ fontSize: '20px' }}
				value={props.attributes.question}
				onChange={updateQuestion}
			/>
			<p style={{ fontSize: '13px', margin: '20px 0 8px 0' }}>Answers:</p>
			{props.attributes.answers.map((answer, index) => {
				return (
					<Flex>
						<FlexBlock>
							<TextControl
								value={answer}
								onChange={(newValue) => {
									const newAnswers = props.attributes.answers.concat(
										[]
									)
									newAnswers[index] = newValue
									props.setAttributes({ answers: newAnswers })
								}}
								autoFocus={answer == undefined}
							/>
						</FlexBlock>
						<FlexItem>
							<Button onClick={() => markAsCorrect(index)}>
								<Icon
									className='mark-as-correct'
									icon={
										props.attributes.correctAnswer === index
											? 'star-filled'
											: 'star-empty'
									}
								/>
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								isLink
								className='attention-delete'
								onClick={() => deleteAnswer(index)}>
								Delete
							</Button>
						</FlexItem>
					</Flex>
				)
			})}
			<Button
				isPrimary
				onClick={() => {
					props.setAttributes({
						answers: props.attributes.answers.concat([undefined]),
					})
				}}>
				Add another answer
			</Button>
		</div>
	)
}
