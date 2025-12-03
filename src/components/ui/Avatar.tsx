import Image from 'next/image'
import React from 'react'

const Avatar = ({
    imgLink,
    height = 50,
    width = 50
}: {
    imgLink: string;
    height?: number;
    width?: number;
}) => {
    return (
        <Image
            alt="avatar"
            src={imgLink}
            height={height}
            width={width}
            className="h-8 w-8 rounded-full"
        />

    )
}

export default Avatar