import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import moment from "moment";

type Files = {
    id: number
    name: string
    src: string
    type: string
}

export const MainPage = ({ settings, auth }: any) => {
    moment.locale('ru')

    const videoRef = useRef() as React.MutableRefObject<any>
    const videoSrc = settings.video.length ? settings.video[0].src : ''

    const videoRef1 = useRef() as React.MutableRefObject<any>
    const videoSrc1 = settings.video1.length ? settings.video1[0].src : ''

    useEffect(() => {
        if (settings.video) {
            videoRef.current && videoRef.current.play()
        }
        
    },  settings.video)

    useEffect(() => {
        if (settings.video1) {
            videoRef.current && videoRef.current.play()
        }
        
    },settings.video1)


    return (
        <div className={styles.testWrapper} >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    src={videoSrc}
                    width='50%'
                    height='100%'
                    />
                <video
                    ref={videoRef1}
                    autoPlay
                    loop
                    muted
                    src={videoSrc1}
                    width='50%'
                    height='100%'
                    margin-left="960px"
                    />
                <aside>
                    <ul>
                        <li>{settings.naimenovanie1}</li>
                        <li>{settings.naimenovanie2}</li>
                        <li>{settings.naimenovanie3}</li>
                        <li>{settings.naimenovanie4}</li>
                        <li>{settings.naimenovanie5}</li>
                        <li>{settings.naimenovanie6}</li>
                    </ul>
                </aside>
            </div>


        )
    }

