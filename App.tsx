import React, { Component } from 'react';
import {View, SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import FweiView from './FweiView';
import Options from './Options';
import Popup from './Popup';
import Welcome from './Welcome';
import CookieManager from '@react-native-cookies/cookies';
import config from './config';
import KeepAwake from '@sayem314/react-native-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

function setPersistentSession(domain: string) {
    if (!domain) return Promise.resolve();
    return AsyncStorage.getItem('FWEI.persistentSession').then((persistentSession) => {
        if (persistentSession) {
            return CookieManager.set("https://" + domain, {
                name: 'persistentSession',
                value: persistentSession,
                domain: domain,
                origin: domain,
                path: '/',
                version: '1',
                expiration: '2030-01-01T12:30:00.00-05:00'
            }, true).then((_res) => {
                crashlytics().log(`CookieManager.set => ${domain} ${persistentSession}`);
                console.log(`CookieManager.set => ${domain} ${persistentSession}`);
            });
        } else {
            crashlytics().log("no persistensSession");
            console.log("no persistensSession");
        }
    }).catch(e => {
        crashlytics().recordError(e);
        console.error(e);
    });
}

type Props = {};
export default class App extends Component<Props> {
    state = {
        popup: '',
        options: false,
        baseURL: '',
        init: false,
    };

    constructor(props: Props) {
        super(props);
        crashlytics().log('App started');
    }

    async componentDidMount() {
        try {
            const baseURL = await AsyncStorage.getItem('FWEI.baseURL');
            if (baseURL) {
                await setPersistentSession(baseURL);
                this.setState({baseURL});
            }
        } catch (e) {
            crashlytics().recordError(e as Error);
            const baseURL = config.defaultBaseURL;
            await setPersistentSession(baseURL);
            this.setState({baseURL});
        } finally {
            this.setState({init: true});
        }
    }

    render() {
        const {init, options, popup, baseURL} = this.state;
        return (
            <SafeAreaView style={styles.safeArea}>
                <KeepAwake />
                <StatusBar
                    backgroundColor="#222"
                    barStyle="light-content"
                />
                <View style={styles.appArea}>
                    {baseURL && <View style={{flex: 1}}>
                        <FweiView baseURL={baseURL}
                                  onOpenOptions={() => this.setState({options: true})}
                                  onOpenPopup={(url: string) => this.setState({popup: url})}
                        />
                    </View>}
                    {popup && <View style={{flex: 1000}}>
                        <Popup
                            baseURL={baseURL}
                            url={popup}
                            onClose={() => this.setState({popup: false})}
                        />
                        </View>
                    }
                    {options && <View style={{flex: 1000}}>
                        <Options
                            baseURL={baseURL}
                            onClose={() => this.setState({options: false})}
                            onSave={(baseURL: string) => this.setState({options: false, baseURL})}
                        />
                    </View>
                    }
                    {init && !baseURL && <View style={{flex: 1000}}>
                        <Welcome
                            baseURL={config.defaultBaseURL}
                            onSave={(baseURL: string) => this.setState({baseURL})}
                        />
                    </View>
                    }
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#222'
    },
    appArea: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});
