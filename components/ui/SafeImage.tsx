"use client"
import { useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { notFoundMusicImage } from '@/public/images'

/**
 * Drop-in replacement for next/image that shows a dummy cover
 * when the source is missing or fails to load.
 */
const SafeImage = ({ src, onError, alt, ...rest }: ImageProps) => {
    const [failed, setFailed] = useState(false)

    useEffect(() => { setFailed(false) }, [src])

    return <Image
        {...rest}
        alt={alt}
        src={!src || failed ? notFoundMusicImage : src}
        onError={(e) => {
            setFailed(true)
            onError?.(e)
        }}
    />
}

export default SafeImage
