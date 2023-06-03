import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { CheckBox } from 'react-native-elements';

export default function App() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  const addTodo = () => {
    if (text.trim()) {
      if (editingTodo) {
        setTodos(
          todos.map((todo) => {
            if (todo.id === editingTodo.id) {
              return {
                ...todo,
                text,
                day: selectedDay,
              };
            }
            return todo;
          })
        );
        setEditingTodo(null);
      } else {
        setTodos([
          ...todos,
          { id: Date.now(), text, day: selectedDay, completed: false },
        ]);
      }
      setText('');
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      })
    );
  };

  const filteredTodos = todos.filter((todo) => todo.day === selectedDay);

  const editTodo = (todo) => {
    setEditingTodo(todo);
    setText(todo.text);
  };

  const markedDates = {};
  todos.forEach((todo) => {
    if (!markedDates[todo.day]) {
      markedDates[todo.day] = { marked: true, dotColor: 'red' };
    } else {
      markedDates[todo.day].marked = true;
      markedDates[todo.day].dotColor = 'red';
    }
  });

  // Add selected date highlighting
  if (selectedDay && !markedDates[selectedDay]) {
    markedDates[selectedDay] = { selected: true, selectedColor: 'skyblue' };
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Calendar
          onDayPress={(day) => setSelectedDay(day.dateString)}
          markedDates={markedDates}
        />
        <View style={styles.form}>
          <TextInput
            multiline={true}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="할 일을 입력하세요"
          />
          <TouchableOpacity style={styles.button} onPress={addTodo}>
            <Text style={styles.buttonText}>{'추가'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.todos}>
          {filteredTodos.map((todo) => (
            <View key={todo.id} style={styles.todo}>
              {editingTodo && editingTodo.id === todo.id ? (
                <TextInput
                  style={styles.editInput}
                  value={text}
                  onChangeText={setText}
                  autoFocus
                />
              ) : (
                <>
                  <CheckBox
                    checked={todo.completed}
                    onPress={() => toggleTodo(todo.id)}
                  />
                  <Text
                    style={[
                      styles.todoText,
                      todo.completed && styles.completedText,
                    ]}
                  >
                    {todo.text}
                  </Text>
                  <TouchableOpacity onPress={() => removeTodo(todo.id)}>
                    <Image
                      source={require('./assets/trash.png')}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editTodo(todo)}>
                    <Image
                      source={require('./assets/edit.png')}
                      style={{ width: 20, height: 20, marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  form: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todos: {
    marginTop: 20,
  },
  todo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 1,
    paddingHorizontal: 20,
    marginBottom: 5,
    borderRadius: 5,
  },
  todoText: {
    flex: 1,
    marginLeft: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'black',
    fontWeight: 'bold',
  },
});
