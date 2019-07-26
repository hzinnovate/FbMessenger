import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'

function ChatList(props) {
  console.log('>===', props)
  
  return (
      <View>
          <Text>ChatList</Text>
      </View>
  );
}
const mapStateToProps = (state) => {
  return {
      user: state.reducer.user
  }
}

export default connect(mapStateToProps)(ChatList)