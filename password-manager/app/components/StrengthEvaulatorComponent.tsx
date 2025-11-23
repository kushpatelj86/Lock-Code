import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { AddAccountStyles } from '../styles/AddAccountStyles';


interface StrengthEvaulatorProps {
  password: string;
    crackTime: string;

}


export default function StrengthEvaulatorComponent({password,crackTime}: StrengthEvaulatorProps)
{
    let content = null;

    if(password.length > 0)
    {
        content = <Text style={AddAccountStyles.strengthEvaulator}>Estimated crack time: {crackTime}</Text>
    }
    else
    {
        content = null;
    }

    return content;
}