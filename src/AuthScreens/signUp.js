import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput,Alert, ScrollView, KeyboardAvoidingView,SafeAreaView } from 'react-native';
import {register} from '../Api/firebase'

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            userImageUri: ''
        }
    }
    ImageRender() {
        if (this.state.userImageUri === '') { return (<Image style={{ height: 100, width: 100, borderWidth: 1, borderColor: 'grey', borderRadius: 100 }} source={require('../assets/adduser.png')} />) }
        else { return (<Image style={{ height: 100, width: 100, borderWidth: 1, borderColor: 'grey', borderRadius: 100 }} source={{ uri: this.state.userImageUri }} />) }
    }
  async signUp(){
        const {email, password, confirmPassword} = this.state;
        if(password === confirmPassword){
               try{
                   const isRegister = await register(email, password)
                   if(isRegister){
                       this.props.navigation.navigate('authVerify')
                   }
                } catch (e) {
                    console.log(e.message)
                    Alert.alert(e.message)
                }

        }else{
            Alert.alert('Password does not match')
        }

    }
    render() {
        const { email, password, confirmPassword, userImageUri } = this.state
        return (
                <View style={styles.container}>
                    <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ height: 200, width: 200 }} source={require('../assets/Logo.png')} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        {this.ImageRender()}
                        <TextInput
                            style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1 }}
                            placeholder="Email"
                            onChangeText={email => this.setState({ email })}
                            value={email}
                        />
                        <TextInput
                            style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1 }}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={password => this.setState({ password })}
                            password={password}
                        />
                        <TextInput
                            style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white' }}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })}
                            password={password}
                        />
                        <View style={{ flexDirection: 'row' }}>

                            <TouchableOpacity
                                style={{ flex: 1, backgroundColor: 'red', width: '50%', borderRadius: 15, height: 50, justifyContent: 'center', alignItems: 'center', margin: 5 }}
                                onPress={()=> this.props.navigation.navigate('login')}
                            >
                                <Text style={{ color: 'white' }}>CANCLE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, backgroundColor: '#4BCC1E', width: '50%', borderRadius: 15, height: 50, justifyContent: 'center', alignItems: 'center', margin: 5 }}
                                onPress={()=> this.signUp()}
                            >
                                <Text style={{ color: 'white' }}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default SignUp