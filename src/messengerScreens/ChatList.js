import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList } from 'react-native';
import {objForChat} from '../Redux/actions/authAction'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from '../Config/firebase';
import 'firebase/firestore';
import {createRoom} from '../Api/firebase'

const db = firebase.firestore();
class ChatList extends React.Component {
  constructor() {
    super();
    this.state = {
      usersArray: [],
    }
    this.updateState = this.updateState.bind(this)
  }
  componentWillMount() {
    const myUid = this.props.user.uid;
    this.getUsers(myUid)
  }
  updateState(usersArray) {
    this.setState({ usersArray })
    // console.log(usersArray)
  }
  getUsers(myUid) {
    let updateStateFromDb = this.updateState
    db.collection('users').onSnapshot(function (querySnapshot) {
      const usersArry = [];
      querySnapshot.forEach(function (doc) {
        if (doc.id !== myUid) {
          usersArry.push(doc.data());
        }
      });
      updateStateFromDb(usersArry)
    })
  }
  async startChat(chatUser) {
    const friendId = chatUser.uid;
    const myId = this.props.user.uid;
    try{
     let chatRoom = await createRoom(friendId, myId)
        this.props.objForChat({chatRoom, chatUser})
        this.props.navigation.navigate('ChatRoom')
    }catch (e) {
        console.log(e)
    }
}
//  openChatRoom(chatUser){
//     this.props.navigation.navigate('ChatRoom')
//   }
  ChatListRender() {
    const { usersArray } = this.state
    return (<View style={{ paddingTop: 10 }}>
      <FlatList
        data={usersArray}
        renderItem={({ item, index }) =>
            <TouchableOpacity key={index} onPress={() => { this.startChat(item) }} style={{ height: 60, padding: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Image source={require('../assets/adduser.png')} color='black' style={{ height: 50, width: 50, marginLeft: 15, borderRadius: 100 }} />
              </View>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18 }}>{item.email}</Text>
              </View>
            </TouchableOpacity>
        }
      />

    </View>
    )
  }
  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          {this.ChatListRender()}
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.reducer.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    objForChat: (chatObj) => dispatch(objForChat(chatObj))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(ChatList)