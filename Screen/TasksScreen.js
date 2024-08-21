import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity } from "react-native-web";

import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  Button,
  FlatList,
} from "react-native";
import TodoItem from "../Components/TodoItem";
import { SessionContext } from "../Context/Context";
import { deleteTodoList, getTodoLists, getTodos, deleteTodo, updateTodo, createTodo } from "../utils/api";
import Navbar from "../Components/Navbar";
import { ArrowLeftCircle, Trash2, Trash } from "react-native-feather";
import TodoListsScreen from "./TodoListsScreen";

export default function TasksScreen({ route, navigation }) {
  const [session, setSession] = useContext(SessionContext);

  const { id, title, username, onDeleteTodoList } = route.params;
  const [todoData, setTodoData] = useState([]);
  const [filterTodoData, setFilterTodoData] = useState(todoData);
  const [todoItem, setTodoItem] = useState("");
  const [error, setError] = useState("");
  const [countPercent, setCountPercent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    retrieveTodos();
  }, []);


  //Mettre à jour le nombre de tâches réalisées
  useEffect(() => {
    setCount(todoData.filter((todo) => todo.done).length);
}, [todoData]);

// Mettre à jour le nombre de tâches réalisées avec progress bar
useEffect(() => {
    setCountPercent((todoData.filter((todo) => todo.done).length / todoData.length) * 100);
}, [todoData]);

 

  function onCreateTodo() {
    if (todoItem.length == 0) {
      setError("Veuillez mettre un titre valide!");
    } else {
      createTodo(todoItem, id, session.token)
        .then((todoItem) => {
          const newTodoItems = [...todoData, todoItem];
                    setTodoData(newTodoItems);
                    setCountPercent((newTodoItems.filter((item) => item.done).length / newTodoItems.length) * 100);
                    
          retrieveTodos();
          setTodoItem("");
          setError("");
        })
        .catch((err) => console.log(err.message));
    }
  }

  function onUpdateTodoItem(id, state) {
    updateTodo(id, state, session.token)
      .then((res) => {
        retrieveTodos();
      })
      .catch((err) => console.log(err.message));
  }

  function onDeleteTodo(id) {
    deleteTodo(id, session.token)
      .then((res) => {

        const newTodoItems = todoData.filter((item) => item.id !== id);
                setTodoData(newTodoItems);
                setCountPercent((newTodoItems.filter((item) => item.done).length / newTodoItems.length) * 100);

        retrieveTodos();
        setTodoItem("");
      })
      .catch((err) => console.log(err.message));
  }

  function retrieveTodos() {
    getTodos(id, session.token)
        .then((res) => {
            setTodoData(res);
            
            const completedTasks = res.filter((item) => item.done).length;
            setCount(completedTasks);
            setCountPercent((completedTasks / res.length) * 100);
        })
        .catch((err) => console.log(err.message));
}


  function onCheckNone() {
    let cpy = [...todoData];
    cpy.forEach((item) => {
      onUpdateTodoItem(item.id, false);
    });
  }

  function onCheckAll() {
    let cpy = [...todoData];
    cpy.forEach((item) => {
      onUpdateTodoItem(item.id, true);
    });
  }

  function showOngoing() {
    let cpy = [...todoData];
    cpy = cpy.filter((item) => !item.done);

    setTodoData(cpy);
  }

  function showChecked() {
    let cpy = [...todoData];
    cpy = cpy.filter((item) => item.done);

    setTodoData(cpy);
  }

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={{ width: "100%", height: "100%" }}
    >
      <Navbar navigation={navigation}/>
      <View style={styles.container}>

        <View style={styles.card}>
          <View style={styles.head}>
            <TouchableOpacity
            onPress={() => {
              navigation.navigate("Todolists", {
                screen: "Todolist",
              });
            }}>
              <ArrowLeftCircle stroke="black" fill="#fff" width={32} height={32} />
            </TouchableOpacity>
            <Text style={styles.header}>{title}</Text>
            <TouchableOpacity
            onPress={() => {onDeleteTodoList(id);  navigation.navigate("Todolists", {
              screen: "Todolist",
            });}}>
              <Trash2 stroke="red" fill="#fff" width={25} height={25} />
            </TouchableOpacity>
          </View>
        
            {/* <View style={styles.progressBar}>
                <View style={[styles.progressBarStyle, { width: `${countPercent}%`}]}>
                    <Text style={styles.progressBarText}>
                        {`${countPercent}% `}
                    </Text>
                </View>
            </View> */}
        <View styles={styles.itemList}>
          <View style={styles.actionOptionsContainer}>
            
            <View style={styles.actionContainer}>
              <View style={styles.btnOption}>
                  <Button title="Tout cocher" onPress={onCheckAll} />
              </View>
              <View style={styles.btnOption}>
                  <Button title="Tout décocher" onPress={onCheckNone} />
              </View>
              <View style={styles.btnOption}>
                <Button title={"Afficher tout(" + count + ")"} onPress={retrieveTodos} />
              </View>
              <View style={styles.btnOption}>
                <Button title="Afficher non fait" onPress={showOngoing} />
              </View>
              <View style={styles.btnOption}>
                <Button title="Afficher fait" onPress={showChecked} />
              </View>
            </View>

          </View>

          <View style={styles.listContainer}>
            {todoData != [] ? (
              <FlatList
                data={todoData}
                renderItem={({ item }) => (
                  <TodoItem
                    item={item}
                    onDeleteTodo={onDeleteTodo}
                    onUpdateTodoItem={onUpdateTodoItem}
                    navigation={navigation}
                  />
                )}
              />
            ) : (
              <Text style={styles.description}>Liste de tâches vide</Text>
            )}
          </View>
          <View style={styles.addItemContainer}>
            <TextInput
                style={styles.input}
                value={todoItem}
                placeholder = "Ajouter une nouvelle tâche" 
                onChangeText={(value) => {
                  setTodoItem(value);
                }}
              />
            <View style={styles.btnAdd}>
                  <Button title="Ajouter" onPress={onCreateTodo} />
            </View>
            <Text style={{ color: "red", marginVertical: 10 }}>{error}</Text>
          </View>
        </View>
        
        </View>
      </View>
    </ImageBackground>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "vertical"
  },

  head: {
    flexDirection: "row",
    alignItems: "center"
  },

  descriptionContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  description: {
    fontSize: 20,
  },

  listContainer: {
    paddingVertical: 30,
  },

  addItemContainer: {
    marginTop: 20,
    flexDirection: "row",
    display: "flex",
  },

  input: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 5,
    flex: 1
  },

  optionContainer: {
    flexDirection: "row",
    flex: 0.2
  },

  actionContainer: {
    flexDirection: "row",
  },

  btnOption: {
    marginHorizontal: 5,
  },

  btnAdd: {
    marginHorizontal: 5,
    marginTop: 2.5
  },

  buttons1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        width: "60%",
    },

    buttons2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        width: "60%",
    },
    card: {
      width: "50%",
      minHeight: "80%",
      backgroundColor: "white",
      paddingVertical: 30,
      paddingHorizontal: 30,
      textAlign: "center",
      borderRadius: 10,
      marginTop: 60
    },

    header: {
      fontSize: 30,
      fontWeight: "600",
      marginVertical: 15,
      marginLeft:20
    },

    actionOptionsContainer: {
      flexDirection: "row",
      marginTop: 25,
    },

    itemList: {
      display: "flex",
    justifyContent: "center",
    alignItems: "center",
      borderWidth: 1000,
      borderColor: "red"
    }

});
