import React, { Component } from 'react';
import {View, Button} from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
    onClose: () => void;
    url: string;
    baseURL: string;
};
export default class Options extends Component<Props> {
    render() {
        return (<View style={{flex: 1}}>
            <WebView
                source={{uri: this.props.url}}
                style={{flex: 1}}
            />
            <Button title={"Zurück zu " + this.props.baseURL} onPress={() => this.props.onClose()} />
        </View>);
    }
}
