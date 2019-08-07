import React from 'react';
import { FlatList, View, Text, Image, Alert } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import firebase from '../Config/firebase'
import MapView, { Marker } from 'react-native-maps';
import 'firebase/firestore'
import { ScrollView } from 'react-native-gesture-handler';
const db = firebase.firestore()

class ChatComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }
   
    static getDerivedStateFromProps(nextProps){
        // console.log(nextProps.chatRoomObj.messages)
        if(nextProps.messages !== undefined, nextProps.messages !== null){
            return{
                messages: nextProps.messages
            }
        }else{
            return{
                messages: []
            }
        }
    }


    render() {
        const myId = this.props.user.uid
        const { messages } = this.state
        if (!!messages.length) {
            return (
                    <FlatList
                    inverted={true}
                        data={messages.reverse()}
                        renderItem={({ item }) => {
                            const mainStyle = item.data.userId === myId ?
                                { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' } :
                                { flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }
                            const messagesStyle = item.data.userId === myId ?
                                { backgroundColor: '#0084FF', marginBottom: 10, borderRadius: 10, padding: 10, marginLeft: 50 } :
                                { backgroundColor: '#EFF0EF', marginBottom: 10, borderRadius: 10, padding: 10, marginRight: 50 }
                            const textStyle = item.data.userId === myId ?
                                { color: 'white', fontSize: 18, textAlign: 'left' } :
                                { color: 'black', fontSize: 18, textAlign: 'left' }
                            const timeTextStyle = item.data.userId === myId ?
                                { color: 'white', fontSize: 10, textAlign: 'left' } :
                                { color: 'black', fontSize: 10, textAlign: 'left' }
                            return (
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <View style={mainStyle}>
                                        {item.data.image &&
                                            <View style={messagesStyle}>
                                                <Image source={{ uri: item.data.message }} style={{ width: 200, height: 200 }} />
                                                <Text style={timeTextStyle}>{moment(item.data.timeStamp).fromNow()}</Text>
                                            </View>}
                                        {item.data.text &&
                                            <View style={messagesStyle}>
                                                <Text style={textStyle}>{item.data.message}</Text>
                                                <Text style={timeTextStyle}>{moment(item.data.timeStamp).fromNow()}</Text>
                                            </View>
                                        }
                                        {item.data.location &&
                                            <View style={messagesStyle}>
                                                <MapView onPress={()=> Alert.alert('done')} style={{ width: 200, height: 200 }}
                                                    region={item.data.latlang}
                                                >
                                                    <Marker
                                                        coordinate={{ latitude: item.data.latlang.latitude, longitude: item.data.latlang.longitude }}
                                                    />
                                                </MapView>
                                            </View>

                                        }
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
            )
        } else {
            return (<Text>No Messages Here</Text>)
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.reducer.user,
        chatRoomObj: state.reducer.chatRoomObj,
        messages: state.reducer.messages
    }
}

export default connect(mapStateToProps)(ChatComponent)