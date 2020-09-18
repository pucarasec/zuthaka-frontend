import React from 'react'

export interface CTwoProps {
	type: string
	options: { name: string; value: string }[]
}

export default ({ type, options }: CTwoProps) => {
	return <span>ITEM</span>
}
