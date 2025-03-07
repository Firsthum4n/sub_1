import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import moment from "moment";
import arrowL from './arrow_L.png'
import arrowR from './arrow_R.png'

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
           <div className={styles.arrow} > 
                <img src={arrowL} alt="Стрелка"></img> 
            </div>
            <div className={styles.UpperText} >
                <li>{settings.naimenovanie1}</li>
                <li>{settings.naimenovanie2}</li>
                <li>{settings.naimenovanie3}</li>
                <li>{settings.naimenovanie4}</li>
                <li>{settings.naimenovanie5}</li>
                <li>{settings.naimenovanie6}</li>
                <li>{settings.naimenovanie7}</li>
            </div>
            <div className={styles.LowerText} >
                <li> {settings.naimen1}</li>
                <li> {settings.naimen2}</li>
                <li> {settings.naimen3}</li>
                <li> {settings.naimen4}</li>
                <li> {settings.naimen5}</li>
                <li> {settings.naimen6}</li>
                <li> {settings.naimen7}</li>
            </div>
            <div className={styles.Price15} >
                <li>{settings.price15_1}</li>
                <li>{settings.price15_2}</li>
                <li>{settings.price15_3}</li>
                <li>{settings.price15_4}</li>
                <li>{settings.price15_5}</li>
                <li>{settings.price15_6}</li>
                <li>{settings.price15_7}</li>
            </div>
            <div className={styles.PriceCombo } >
                <li>{settings.priceCombo_1}</li>
                <li>{settings.priceCombo_2}</li>
                <li>{settings.priceCombo_3}</li>
                <li>{settings.priceCombo_4}</li>
                <li>{settings.priceCombo_5}</li>
                <li>{settings.priceCombo_6}</li>
                <li>{settings.priceCombo_7}</li>
            </div>
            <div className={styles.Price30} >
                <li>{settings.price30_1}</li>
                <li>{settings.price30_2}</li>
                <li>{settings.price30_3}</li>
                <li>{settings.price30_4}</li>
                <li>{settings.price30_5}</li>
                <li>{settings.price30_6}</li>
                <li>{settings.price30_7}</li>
                </div>
        </div>
        )
    }

