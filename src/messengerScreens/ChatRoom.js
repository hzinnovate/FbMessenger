import React from 'react';
import { Header, StyleSheet,FlatList, Text, View, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { connect } from 'react-redux'
import moment from 'moment'
import {sendMessageToDb} from '../Api/firebase'
import firebase from '../Config/firebase';
import 'firebase/firestore'
import { TouchableOpacity } from 'react-native-gesture-handler';
const db = firebase.firestore()

class ChatRoom extends React.Component {
  constructor(){
    super();
    this.state = {
      text: '',
      messages: []
    }
  }
  static navigationOptions = {
    headerStyle: {
      height: 62
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  componentDidMount(){
    this.getAllMessage();
  }
  async getAllMessage(){
    const roomId = this.props.chatRoomObj.chatRoom.roomId;
    db.collection('chatrooms').doc(roomId).collection('messages')
      .orderBy('timeStamp')
      .onSnapshot(snapshot => {
        const messages = []
        snapshot.forEach(elem => {
          messages.push({data: elem.data(), _id: elem.id})
        })
        // console.log('msgs ===>', messages)
        this.setState({messages}, ()=>{
          // const scrollHeight = this.messageList.scrollHeight;
          // const height = this.messageList.clientHeight;
          // const maxScrollTop = scrollHeight - height;
          // this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        })
      })
  }
  sendMessage(){
    sendMessageToDb(this.props.chatRoomObj.chatRoom.roomId, this.state.text, this.props.user.uid)
    this.setState({text: ''})
  }
  render() {
    const {messages , text} = this.state;
    const myId = this.props.user.uid
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Constants.statusBarHeight + 62}
          style={styles.container} behavior="padding">
          <ScrollView style={styles.container} >
            {!!messages.length && 
            <FlatList 
            data = {messages}
            renderItem = {(item)=>{
              console.log(item)
              // const messagesStyle = item.data.userId === myId ? 
              // {backgroundColor: 'blue', color: 'white', marginBottom: 48, marginLeft: '50vw'} :
              // {backgroundColor: 'darkgray', color: 'white', marginBottom: 48, marginLeft: '50vw'}
              //   return <View style={messagesStyle}>
              //     <Text>{item.data.message}</Text>
              //     <Text>{moment(item.data.timeStamp).fromNow()}</Text>
              //   </View>
            }}
            />
          }
          </ScrollView>
          <View style={{ height: 40, width: '100%' , flexDirection: 'row'}}>
          <TextInput value={text} onChangeText={text=> this.setState({text})} style={{flex: 2, height: '100%',backgroundColor: 'grey', paddingLeft: 10, color: '#fff' }} placeholder={'Enter text here'} />
          <TouchableOpacity onPress={()=>this.sendMessage()} style={{flex: 1, backgroundColor: 'blue'}}>
            <Text style={{color: 'white'}}>Send It</Text>
          </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.reducer.user,
    chatRoomObj: state.reducer.chatRoomObj
  }
}

export default connect(mapStateToProps)(ChatRoom)