import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import JournalStyles from "../styles/journalStyles";

const JournalTextBox = ({ value, onChangeText }) => {
  return (
    <View style={JournalStyles.textBoxContainer}>
      <TextInput
        style={JournalStyles.textBox}
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



export default JournalTextBox;
