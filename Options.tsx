import React, { Component } from 'react';
import {View, Text, Button, TextInput, Switch, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getVersion} from 'react-native-device-info';

import config from './config';
const {defaultServer} = config;

type Props = {
    onClose: () => void;
    baseURL:string;
    onSave: (baseURL: string) => void;
};
export default class Options extends Component<Props> {
    state = {
        unsavedServer: this.props.baseURL,
        customServer: (!defaultServer.find((server) => server.url === this.props.baseURL))
    };

    save(baseURL: string) {
        const stored = AsyncStorage.setItem('FWEI.baseURL', baseURL);
        this.props.onSave(baseURL);
        return stored;
    }

    render() {
        return (<View>
            <Text style={styles.header}>Options</Text>

            <Text style={styles.subheader}>Serverauswahl:</Text>
            {this.state.customServer || <Picker style={styles.picker}
                                     selectedValue={this.state.unsavedServer}
                                     onValueChange={(itemValue, _itemIndex) => this.setState({unsavedServer: itemValue})}>
                {defaultServer.map((server) => <Picker.Item label={server.caption} key={server.caption} value={server.url}/>)}
            </Picker>
            }
            <View style={styles.customServer}>
                <View style={styles.toggleView}>
                    <Text style={styles.toggleText}>Eigener Server</Text>
                    <View>
                        <Switch
                            style={styles.toggleSwitch}
                            disabled={false}
                            value={this.state.customServer}
                            onValueChange={(value) => this.setState({customServer: value})}
                        />
                    </View>
                </View>
                {this.state.customServer && (<TextInput
                    style={{height: 40}}
                    autoCapitalize = 'none'
                    placeholder="Server"
                    clearButtonMode="always"
                    value={this.state.unsavedServer}
                    onChangeText={(update) => this.setState({unsavedServer: update.toLowerCase()})}
                />)}
            </View>

            <Button title="Speichern" onPress={() => this.save(this.state.unsavedServer)} />
            <Button title={"Zurück zu " + this.props.baseURL} onPress={() => this.props.onClose()} />
            <Text>Version: {getVersion()}</Text>
        </View>);
    }
}

const styles = StyleSheet.create({
    header: {
        color: 'white',
        backgroundColor: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        padding: 5
    },
    subheader: {
        fontSize: 24,
        padding: 5
    },
    picker: {
        height: 200
    },
    toggleText: {
        height: 24,
        fontSize: 22
    },
    toggleSwitch: {
        height: 24
    },
    customServer: {
        padding: 5,
        paddingTop: 30,
        paddingBottom: 30
    },
    toggleView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
