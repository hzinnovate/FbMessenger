import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { getStories } from '../Redux/actions/authAction'
import * as ImagePicker from 'expo-image-picker';
import { sendStoryToDb } from '../Api/firebase'
import firebase from '../Config/firebase';
import 'firebase/firestore';
const db = firebase.firestore();




class Stories extends React.Component {
  constructor() {
    super();
    this.state = {
      stories: []
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { stories, allUsers, user } = nextProps
    const storiesObj = []
    if (stories) {
      for (var key in allUsers) {
        allUsers[key].stories = []
        for (var key2 in stories) {
          if (allUsers[key].uid === stories[key2].data.uid) {
            const oneday = 60 * 60 * 24 * 1000
            const dateNow = Date.now()
            const calculate = stories[key2].data.timeStamp + oneday;
            if(calculate > dateNow){
              allUsers[key].stories.push({
                storyId: stories[key2]._id,
                storageName: stories[key2].data.storageName,
                storyCreateTime: stories[key2].data.timeStamp,
                story: stories[key2].data.story
              })
            }
          }
        }
      }
      for(var v in allUsers){
        if(allUsers[v].stories.length){
          storiesObj.push(allUsers[v])
        }
      }
      return {
        stories: storiesObj
      }
    } else {
      return {
        stories: []
      }
    }
  }

  async pickImage() {
    try {
      const picImage = await ImagePicker.launchImageLibraryAsync()
      if (!picImage.cancelled) {
        const response = await fetch(picImage.uri);
        const blob = await response.blob()
        await sendStoryToDb(this.props.user, blob)
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, }}>
        <View style={{ flex: 1 }}>
          <View style={{ width: '40%', height: 250, borderWidth: 2, borderColor: 'black', margin: 10, borderRadius: 20, overflow: 'hidden' }}>
            <TouchableOpacity onPress={() => { this.pickImage() }}>
              <View>
                <Image source={{ uri: this.props.user.profilePic }} style={{ height: '100%', width: '100%' }} />
              </View>
              <View style={{ position: 'absolute', top: 0, left: 0, alignItems: 'center', backgroundColor: 'black', borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>+</Text>
              </View>
              <View style={{ position: 'absolute', color: 'white', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }} >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add Stories</Text>
              </View>
            </TouchableOpacity>
          </View>
          {!!this.state.stories.length &&
            <FlatList
              data={this.state.stories}
              renderItem={({ item }) =>
                <View style={{ width: '40%', height: 250, borderWidth: 2, borderColor: 'black', margin: 10, borderRadius: 20, overflow: 'hidden' }}>
                  <TouchableOpacity>
                    <View>
                      <Image source={{ uri: item.stories[item.stories.length - 1].story }} style={{ height: '100%', width: '100%'}} />
                    </View>
                    <View style={{ position: 'absolute', top: 0, left: 0, alignItems: 'center', backgroundColor: 'black', borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                      <Image source={{ uri: item.profilePic }} style={{ height: '100%', width: '100%' , borderRadius: 100 }} />
                    </View>
                    <View style={{ position: 'absolute', color: 'white', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }} >
                      <Text style={{ color: 'white', fontSize: 14}}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
            />
          }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.reducer.user,
    allUsers: state.reducer.allUsers,
    stories: state.reducer.stories
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getStories: () => dispatch(getStories()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stories)

