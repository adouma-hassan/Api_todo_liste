import React, { useState, useEffect } from "react";
import { Trash2, Edit3 } from "react-native-feather";

import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function TodoItem(props) {
  const [done, setDone] = useState(props.item.done);

  useEffect(() => {
    setDone(props.item.done);
  }, [props.item.done]);

  const changeSwitch = function (state) {
    setDone(state);
    props.onUpdateTodoItem(props.item.id, state);
  };

  return (
    <View >
      <View style={styles.content}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={done ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="3e3e3e"
        value={done}
        onValueChange={changeSwitch}
      />

      <Text style={styles.text}>
        {props.item.content}
      </Text>


      <View style={styles.action}>
      <TouchableOpacity style={{marginRight: 8}}
          onPress={() => props.onDeleteTodo(props.item.id)}>
            <Edit3 stroke="#2196F3" fill="#fff" width={25} height={25} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.onDeleteTodo(props.item.id)}>
            <Trash2 stroke="red" fill="#fff" width={25} height={25} />
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.line}></View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    marginVertical: 20,
    flex:1,
    alignItems: "center"
  
  },

  images: {
    marginLeft: 16,
    padding: 5,
    flexDirection: "row",
    backgroundColor: "yellowgreen",
    borderRadius: 30,
  },

  action: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10
  },

  text: {
    //  textDecorationLine: done ? "line-through" : "none" ,
    fontSize: 20,
    marginLeft: 5,
    marginTop: -2
  },
  
  line: {
    height:1,
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D8D8"
  },
});
