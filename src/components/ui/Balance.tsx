import React from 'react'

const Balance = ({ text, balance }: { text: string; balance: string; }) => {
    return (
        <div className='bg-white flex gap-2 px-2 sm:px-3  md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md'>

            <p
                className='text-xs md:text-sm px-2  rounded-md transition-colors duration-200'
            >{text}</p>

            <p
                className='text-xs md:text-sm px-2  rounded-md transition-colors duration-200'
            >${balance}</p>

        </div>
    )
}

export default Balance