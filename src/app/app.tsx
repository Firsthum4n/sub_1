import React from 'react'
import { AppMain } from "../components/appMain/appMain";
import { Logger, ClientCommunicator, Messenger, translate, setLocale, setDictionary, isExist } from "sp_widget_core";
import { DATABASE_CONFIG } from "../database/databaseConfig";
import { Database } from "../database";
import methods from '../communicatorMethods'
import styles from './app.module.scss'
import { Auth } from '../models/Auth';
import { Localisation } from "../models/localisation";
import { MediaFileData } from '../models/MediaFileData';
import { WidgetEditor, WidgetOptionsEditor, getQueryStringValue } from 'sp_widget_editor'
import settingsIcon from './images/settings.svg'
import download_icon from './images/download.svg'
import upload_icon from './images/upload.svg'
import audio_icon from './images/audio.svg'
import video_icon from './images/video.svg'
import delete_icon from './images/delete_icon.svg'
import mixed_content_icon from './images/mixedContent.svg'
import modal_close from './images/modal_close.svg'
import plus_icon from './images/plus.svg'
import arrow_icon from './images/arrow.svg'

import l10n from '../dictionary/l10n.json'
setDictionary(l10n)

interface IAppProps {
    requireDatabase?: boolean
    requireCommunicator?: boolean
}

interface IAppState {
    database?: Database,
    clientCommunicator?: any
    isAdmin: boolean
    auth?: Auth
    widgetOptionsEditor: WidgetOptionsEditor
    isAuthenticationScreenOpen: boolean
    widgetOptionsTemp: any
}

const logger = Logger()

class App extends React.Component<IAppProps, IAppState> {
    settingsIconRef: any
    private _frontendMessenger: any
    private _isNeedDownloadMedia = true

    constructor(props: IAppProps) {
        super(props)

        this.state = {
            database: undefined,
            clientCommunicator: undefined,
            auth: undefined,
            isAdmin: false,
            widgetOptionsEditor: new WidgetOptionsEditor(window['petrovich']),
            isAuthenticationScreenOpen: false,
            widgetOptionsTemp: {}
        }

        this._frontendMessenger = Messenger(this.messageListener)
    }

    componentDidMount() {
        this._initLocale()
        this.setCommunicator()
        this.setDatabase()
    }

    componentWillUnmount(): void {
        this._frontendMessenger.removeListener()
    }

    setWidgetOptionsTemp = (options: any) => {
        this.setState({ widgetOptionsTemp: options })
    }

    clearWidgetOptionsTemp = () => {
        this.setState({ widgetOptionsTemp: {} })
    }

    _setAuth = (data: any) => {
        logger.log(`Setting authorization ${JSON.stringify(data)}`)

        const { token, host, deviceId } = data
        this.setState(state => ({
            ...state,
            auth: new Auth(token, host, deviceId)
        }))
    }

    private _initLocale = () => {
        this.onLocaleChanged(this.state.widgetOptionsEditor.data.settings.localisation)
    }

    messageListener = (message: any) => {
        logger.log(`App#frontendMessageListener. ${message.data}`)

        let data: any = message.data
        if (typeof data !== 'string') {
            return
        }

        if (data.indexOf('selectMedia__') === 0) {
            data = data.replace('selectMedia__', '')
            const bufferData: MediaFileData = JSON.parse(data)
            this.state.widgetOptionsEditor.onMediaLoaded(bufferData)
        }

        if (data.indexOf('selectMediaWithFolders__') === 0) {
            data = data.replace('selectMediaWithFolders__', '')
            const bufferData: any = JSON.parse(data)
            this.state.widgetOptionsEditor.onMediaLoaded(bufferData)
        }

        if (data.includes('authorization')) {
            data = data.replace('authorization__', '')
            const parsed = JSON.parse(data)
            this.onMessageForApp('authorization', parsed)
        }

        if (data.includes('listenerDataUpdated')) {
            data = data.replace('listenerDataUpdated__', '')
            this.onMessageForApp('listenerDataUpdated', data)
        }

        if (data.includes('listenerDataDeleted')) {
            data = data.replace('listenerDataDeleted__', '')
            this.onMessageForApp('listenerDataDeleted', data)
        }

        if (data.includes('settings__')) {
            data = data.replace('settings__', '')
            data = JSON.parse(data)
            this._updateWidgetData(data)
        }
    }

    private _updateWidgetData = (data: any) => {
        const widgetOptionsEditor = this.state.widgetOptionsEditor

        this.setState(state => ({
            ...state,
            widgetOptionsEditor: new WidgetOptionsEditor(
                {
                    ...widgetOptionsEditor.data,
                    ...data
                },
                widgetOptionsEditor.inEditMode
            )
        }))
    }

    onWidgetOptionsUpdated = (updatedData: any) => {
        if (isExist(updatedData)) {
            this._updateWidgetData(updatedData)
        } else {
            // TODO: remove it after reworking widgetEditor.add method
            this.forceUpdate()
        }
    }

    onLocaleChanged = (locale: Localisation) => {
        setLocale(locale)
        this.forceUpdate()
    }

    onMessageForApp = (type: string, data: any) => {
        logger.log(`App#onMessageForApp. type:${type}. data: ${JSON.stringify(data)}`)
        if (type === 'authorization') {
            this._setAuth(data)
        }

        if (type === 'closeModal') {

        }
    }

    setDatabase = () => {
        if (this.props.requireDatabase) {
            const database = new Database(DATABASE_CONFIG.NAME)

            database.declare(1)
            database.open()
                .then(() => {
                    logger.log(`Database was opened`)
                    this.setState(state => ({
                        ...state,
                        database
                    })
                    )
                })
        }

    }

    setCommunicator = () => {
        if (this.props.requireCommunicator) {
            const clientCommunicator = ClientCommunicator(methods)

            if (clientCommunicator.provider) {
                clientCommunicator.connect()
                    .then(() => {
                        logger.log(`Client communicator was opened`)
                        this.setState({
                            clientCommunicator
                        })
                    })
            }
        }
    }

    isServicesReady = () => {
        const { requireCommunicator, requireDatabase } = this.props

        if (requireCommunicator && !this._isCommunicatorInitialized()) {
            logger.warn(`Client communicator required`)
            return false
        }

        if (requireDatabase && !this._isDatabaseInitialized()) {
            logger.warn(`Database required`)
            return false
        }

        return true
    }

    _isDatabaseInitialized = () => {
        return !!this.state.database
    }

    _isCommunicatorInitialized = () => {
        const { clientCommunicator } = this.state
        return !!(clientCommunicator && clientCommunicator.provider)
    }

    handleAuthenticationScreenOpen = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isAuthenticationScreenOpen: true
            }
        })
    }

    handleAuthenticationScreenClose = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isAuthenticationScreenOpen: false
            }
        })
    }

    onAuth = () => {
        this.setState((prevState) => ({ isAdmin: true }))
    }

    isEmpty(obj: {}) {
        return Object.keys(obj).length === 0;
    }

    getAppStyle = (styleName: string) => {
        const settings = this.state.widgetOptionsEditor.data.settings
        const tempSettings = this.state.widgetOptionsTemp
        const styleValue = !this.isEmpty(tempSettings) ? tempSettings[styleName] : settings[styleName]

        return styleValue || null
    }

    render() {
        const {
            isAdmin,
            auth,
            database,
            clientCommunicator,
            widgetOptionsEditor,
            isAuthenticationScreenOpen
        } = this.state
        const isServicesReady = this.isServicesReady()
        const isShowAuthenticationScreen = !isAdmin && process.env.REACT_APP_PIN_CODE && getQueryStringValue()
        const appMainProps = {
            clientProvider: clientCommunicator?.provider,
            widgetOptions: widgetOptionsEditor.data,
            widgetOptionsTemp: this.state.widgetOptionsTemp,
            database,
            auth,
            isAdmin
        }

        if (!isServicesReady) {
            return null
        }

        return (
            <div className={styles.app} style={
                {
                    fontSize: `${this.getAppStyle('widgetFontSize')}px`
                }
            }>
                <AppContext.Provider value={{
                    onLocaleChanged: this.onLocaleChanged,
                }}>
                    <AppMain
                        {...appMainProps}
                    />
                    {getQueryStringValue() &&
                        <div
                            className={styles.edit}
                        >
                            <WidgetEditor
                                path="settings"
                                isNeedDownloadMedia={this._isNeedDownloadMedia}
                                widgetOptionsEditor={widgetOptionsEditor}
                                onMessageForApp={this.onMessageForApp}
                                onWidgetOptionsUpdated={this.onWidgetOptionsUpdated}
                                ref={settingsIconRef => this.settingsIconRef = settingsIconRef}
                                //@ts-ignore
                                MainComponent={AppMain}
                                appMainProps={appMainProps}
                                setWidgetOptionsTemp={this.setWidgetOptionsTemp}
                                clearWidgetOptionsTemp={this.clearWidgetOptionsTemp}
                                localeChanged={this.onLocaleChanged}
                                navButtonsText={{ applyButton: translate('saveSettings'), resetButton: translate('reset') }}
                                iconsList={{
                                    download_icon,
                                    upload_icon,
                                    audio_icon,
                                    video_icon,
                                    delete_icon,
                                    mixed_content_icon,
                                    modal_close,
                                    plus_icon,
                                    arrow_icon
                                }}

                                settings={[
                                    {
                                        name: translate('settings'),
                                        fields: [
                                            {
                                                label: translate('selectLanguage'),
                                                name: 'localisation',
                                                type: 'localisation'
                                            }, 
                                            {
                                                name: 'video',
                                                label: translate('video'),
                                                type: 'video'
                                            },
                                            {
                                                name: 'video1',
                                                label: translate('video'),
                                                type: 'video'
                                            },
                                            {
                                                name: 'naimenovanie1',
                                                label: 'naimenovanie1',
                                            },
                                            {
                                                name: 'naimenovanie2',
                                                label: 'naimenovanie2',
                                            },
                                            {
                                                name: 'naimenovanie3',
                                                label: 'naimenovanie3',
                                            },
                                            {
                                                name: 'naimenovanie4',
                                                label: 'naimenovanie4',
                                            },
                                            {
                                                name: 'naimenovanie5',
                                                label: 'naimenovanie5',
                                            },
                                            {
                                                name: 'naimenovanie6',
                                                label: 'naimenovanie6',
                                            }
                                        ]
                                    },
                                ]}
                            >
                                <img
                                    src={settingsIcon}
                                    className={styles.openEditorIcon}
                                    onClick={(e) => {
                                        this.settingsIconRef.editStart(e);
                                    }}
                                    width={120}
                                    height={120}
                                    alt=""
                                />
                            </WidgetEditor>
                        </div>
                    }
                </AppContext.Provider>
            </div>
        )
    }
}

type AppContextType = {
    onLocaleChanged: (locale: Localisation) => void
}

export const AppContext = React.createContext<AppContextType>({
    onLocaleChanged: () => {

    }
})

export { App }
