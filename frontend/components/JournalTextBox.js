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
        autoComplete="off"
        autoCorrect={false}
        textAlignVertical="top"  //  Textul începe de sus
        
      />
    </View>
  );
};



export default JournalTextBox;
