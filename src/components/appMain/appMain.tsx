import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Auth} from "../../models/Auth";
import {DatabaseProvider} from "../../database/databaseProvider";
import {Logger} from "sp_widget_core";
import { AuthContext } from '../AuthContext';
import {MainPage} from "../MainPage/MainPage";

interface IAppMainComponent {
    clientProvider?: any
    database?: DatabaseProvider
    auth?: Auth
    widgetOptions?: any
    isAdmin: boolean
    widgetOptionsTemp: any
}

const logger = Logger()

const AppMain: FunctionComponent<IAppMainComponent> = ({widgetOptionsTemp, clientProvider, database, auth, widgetOptions, isAdmin}) => {
    useEffect(() => {
        const subscribeToEvents = () => {
            if (clientProvider) {
                clientProvider.setListeners([
                    {listenerType: "setDeviceId", listenerMethod: setDeviceId}
                ])
            }
        }
        subscribeToEvents()

        return () => {
            if (clientProvider) {
                clientProvider.clearListeners()
            }
        }
    }, [clientProvider])

    useEffect(() => {
        if('getDeviceId' in window){
            window.getDeviceId()
        }
    }, [])

    const authContext = useMemo(() => {
        return {
            isAdmin
        }
    }, [isAdmin])

    if (!clientProvider) {
        return null
    }

    const setDeviceId = (deviceId: string) => {
        logger.log(`set device id: ${deviceId}`)
        window.deviceId = deviceId
    }

    const isEmpty = (obj: {}) => {
        return Object.keys(obj).length === 0;
    }

    return (
        <div style={{height: '100%'}} id={'appMain'}>
            <AuthContext.Provider value={authContext}>
                <MainPage
                    auth={auth}
                    settings={!isEmpty(widgetOptionsTemp) ? widgetOptionsTemp : widgetOptions.settings}
                />
            </AuthContext.Provider>
        </div>
    );
};

export {AppMain}
