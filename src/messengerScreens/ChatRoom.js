import React from 'react';
import { Header, StyleSheet,FlatList, Text, View, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { connect } from 'react-redux'
import moment from 'moment'
import {sendMessageToDb} from '../Api/firebase'
import firebase from '../Config/firebase';
import 'firebase/firestore'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, Ionicons } from '@expo/vector-icons'

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
              const mainStyle = item.item.data.userId === myId ? 
              {flex: 1, flexDirection: 'row', justifyContent: 'flex-start'} : 
              {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}
              const messagesStyle = item.item.data.userId === myId ? 
              {backgroundColor: 'blue', color: 'white', marginBottom: 20, borderRadius: 30, padding: 5} :
              {backgroundColor: 'darkgray', color: 'white', marginBottom: 20,  borderRadius: 30, padding: 5}
                return(
                  <View style={{flex:1, flexDirection: 'column'}}>
                    <View style={mainStyle}>
                <View style={messagesStyle}>
                  <Text style={{color: 'white', }}>{item.item.data.message}</Text>
                  <Text>{moment(item.item.data.timeStamp).fromNow()}</Text>
                </View>
                </View>
                </View>
                  ) 
            }}
            />
          }
          </ScrollView>
          <View style={{ height: 40, width: '100%' , flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1}}>
          <Ionicons name='ios-camera' size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, margin: 2}}>
          <Ionicons name='md-photos' size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}}>
          <Entypo name='mic' size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}}>
          <Entypo name='location' size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}}>
          <Entypo name='emoji-happy' size={30} />
          </TouchableOpacity>
          <TextInput value={text} onChangeText={text=> this.setState({text})} style={{flex: 3, height: '100%',backgroundColor: 'grey', paddingLeft: 10, color: '#fff' }} placeholder={'Enter text here'} />
          <TouchableOpacity onPress={()=>this.sendMessage()} style={{flex: 1}}>
          <Ionicons name='ios-send' size={30} />
                      {/* <Text style={{color: 'white'}}>Send It</Text> */}
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