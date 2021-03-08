import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function App(props: any) {
  const [feedBack, setFeedBack] = useState<{ text: string, color: string } | null>(null);

  const [currentEvent, setCurrentEvent] = useState<{ id: string | undefined, name: string | undefined }>();
  const [currentGuest, setCurrentGuest] = useState<{ id: string, name: string, event: string | null, presence: boolean } | null>();
  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    setCurrentEvent(props.route.params.currentEvent);
    setCurrentGuest(props.route.params.currentGuest);

    if (props.route.params.status == 1) {
      setFeedBack({ text: `Bem-vindo ${props.route.params.curretGuest?.name}.`, color: '#006c8d' })
    } else if (props.route.params.status == 2) {
      setFeedBack({ text: `Ops... ${props.route.params.curretGuest?.name} já esta presente.`, color: '#8d0000' })

    } else if (props.route.params.status == 3) {
      setFeedBack({ text: `Ops... Esse convite não é válido.`, color: '#8d0000' })
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentEvent?.name}</Text>
      </View>
      <View style={styles.container} >
        <Text style={{ color: feedBack?.color, fontSize: 38, fontWeight: '600', textAlign: 'center' }}>{feedBack?.text}</Text>
      </View>
        <TouchableOpacity onPress={() => { goBack() }} style={styles.button}><Text style={styles.labelButton}>Voltar</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 8
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#006c8d'
  },
  labelButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  },
  button: {
    backgroundColor: '#006c8d',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
