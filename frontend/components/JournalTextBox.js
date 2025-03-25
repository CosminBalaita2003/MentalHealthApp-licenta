import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import GlobalStyles from "../styles/globalStyles";

const JournalTextBox = ({ value, onChangeText }) => {
  return (
    <View style={styles.textBoxContainer}>
      <TextInput
        style={styles.textBox}
        placeholder="Write your thoughts here..."
        placeholderTextColor="#aaa"  //  Placeholder mai vizibil pe fundal întunecat
        multiline
        value={value}
        onChangeText={onChangeText}
        returnKeyType="done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textBoxContainer: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  textBox: {
    height: 120,
    textAlignVertical: "top",
    color: "#fff",  //  Face textul alb
    fontSize: 16,
  },
});

export default JournalTextBox;
