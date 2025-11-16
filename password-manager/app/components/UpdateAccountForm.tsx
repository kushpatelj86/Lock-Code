import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { updateaccountstyles } from '../styles/UpdateAccountStyles';

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

interface UpdateAccountFormProps {
  selectedAccount: Password | null;

  newPassword: string;
  setNewPassword: (value: string) => void;
  handleUpdatePassword: () => void;

  newUsername: string;
  setNewUsername: (value: string) => void;
  handleUpdateUsername: () => void;

  newName: string;
  setNewName: (value: string) => void;
  handleUpdateName: () => void;

  newURL: string;
  setNewURL: (value: string) => void;
  handleUpdateURL: () => void;

  newNotes: string;
  setNewNotes: (value: string) => void;
  handleUpdateNotes: () => void;
}



export default function UpdateAccountForm({
  selectedAccount,
  newPassword,
  setNewPassword,
  handleUpdatePassword,
  newUsername,
  setNewUsername,
  handleUpdateUsername,
  newName,
  setNewName,
  handleUpdateName,
  newURL,
  setNewURL,
  handleUpdateURL,
  newNotes,
  setNewNotes,
  handleUpdateNotes,
}: UpdateAccountFormProps){
    if (!selectedAccount)
    {
        return null;
    }
    else
    {
        return (<View style={updateaccountstyles.secondcontainer}>

            <Text style={updateaccountstyles.selectedlabel}>
                Selected: {selectedAccount.account_name}
            </Text>

            <Text>Update Password</Text>
            <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
            />
            <Button title="Update Password" onPress={handleUpdatePassword} />

            <Text style={updateaccountstyles.updatelabel}>Update Username</Text>
            <TextInput
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Enter new username"
            />
            <Button title="Update Username" onPress={handleUpdateUsername} />

            <Text style={updateaccountstyles.updatelabel}>Update Account Name</Text>
            <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter new account name"
            />
            <Button title="Update Account Name" onPress={handleUpdateName} />

            <Text style={updateaccountstyles.updatelabel}>Update URL</Text>
            <TextInput
                value={newURL}
                onChangeText={setNewURL}
                placeholder="Enter new URL"
            />
            <Button title="Update URL" onPress={handleUpdateURL} />

            <Text style={updateaccountstyles.updatelabel}>Update Notes</Text>
            <TextInput
                value={newNotes}
                onChangeText={setNewNotes}
                placeholder="Enter new notes"
            />
            <Button title="Update Notes" onPress={handleUpdateNotes} />

        </View>
        );
    }

}