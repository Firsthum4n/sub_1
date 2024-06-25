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

    return (
        <div className={styles.testWrapper} >
            <div className={styles.UpperText} >
                <li>{settings.naimenovanie2}</li>
                <li>{settings.naimenovanie2}</li>
                <li>{settings.naimenovanie3}</li>
                <li>{settings.naimenovanie4}</li>
                <li>{settings.naimenovanie5}</li>
                <li>{settings.naimenovanie6}</li>
                <li>{settings.naimenovanie7}</li>
            </div>
            <div className={styles.Price} >
                <li>{settings.cena1}</li>
                <li>{settings.cena2}</li>
                <li>{settings.cena3}</li>
                <li>{settings.cena4}</li>
                <li>{settings.cena5}</li>
                <li>{settings.cena6}</li>
                <li>{settings.cena7}</li>
            </div>
        </div>
        )
    }

