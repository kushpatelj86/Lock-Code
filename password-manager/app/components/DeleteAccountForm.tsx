import AccountList from "./AccountList";
import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { DeleteAccountStyles } from "../styles/DeleteAccountStyles";



type Password = {
  password_id: number;
  user_id: number;
  account_name: string;
  account_username: string;
  encrypted_pass: string;
  iv: string;
  url?: string;
  add_date?: string;
  expiry_date?: string;
  notes?: string;
  decrypted_pass?: string;
  crackTime?: string;
};

interface DeleteAccountFormProps {
  selectedAccount: Password | null;
    handleDeletePassword: () => void;

}





export default function DeleteAccountForm({selectedAccount,handleDeletePassword}: DeleteAccountFormProps) {

    let content = null;

    if (selectedAccount) {
        content = (
            <View style={DeleteAccountStyles.selected}>
            <Text style={DeleteAccountStyles.selectedtag}>
                Selected: {selectedAccount.account_name}
            </Text>

            <Text>Delete Password</Text>
            <Button title="Delete Password" onPress={handleDeletePassword} />
            </View>
        );
    } 
    else {
        content = <Text>No results found</Text>;
    }

    return (
        <ScrollView style={{ marginBottom: 20 }}>
            {content}
        </ScrollView>
    );


}


