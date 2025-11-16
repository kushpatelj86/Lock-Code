import AccountList from "./AccountList";
import React from 'react';
import { ScrollView, Text } from 'react-native';


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

interface ScrollAccountListProps {
  filteredPasswords: Password[];
  handleSelectAccount: (item: Password) => void;
}



export default function ScrollAccountList({filteredPasswords,handleSelectAccount}: ScrollAccountListProps) {

    let content = null;

    if (filteredPasswords.length > 0) {
        const accountComponents = [];
        for (let i = 0; i < filteredPasswords.length; i++) {
            const item = filteredPasswords[i];
            accountComponents.push(
            <AccountList
                key={item.password_id}
                item={item}
                onPress={() => handleSelectAccount(item)}
            />
            );
        }
        content = accountComponents;
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


