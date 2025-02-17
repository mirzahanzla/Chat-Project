import React from 'react'

const InfluencerIcon = ({color}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 48 48">
        <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
            <circle cx={24} cy={10} r={6}></circle><path d="M31 44v-9l5-3l-4-13s-4-3-8-3s-8 3-8 3l-4 12l5 4v9">
                </path></g></svg>
  )
}

export default InfluencerIcon