// import { StatusBar } from 'expo-status-bar';
import React, { Component, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Create, FindAll } from "../data/storagen";
import { Feather } from '@expo/vector-icons';

export default function ListEvents(props: any) {

  const { navigate, goBack, canGoBack } = useNavigation();
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);
  const [nameNewEvent, setNameNewEvent] = useState<string>();

  const [listEvents, setListEvents] = useState<any[]>();

  useEffect(() => {
    indexEvents();
  }, [props])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      indexEvents();
    });

    return unsubscribe;
  }, [props.navigation]);

  async function indexEvents() {
    const list = await FindAll('@events');
    console.log(list)
    setListEvents(list);
  }

  async function newEventCreate() {
    await Create('@events', nameNewEvent);
    indexEvents();
    setIsNewEvent(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.TextItem}>Eventos:</Text>
      </View>
      {isNewEvent && (
        <>
          <View style={styles.headerFool}>
            <Text style={styles.headerItem}>Novo Evento</Text>
            <TouchableOpacity onPress={() => { setIsNewEvent(false) }} style={styles.headerItem}>
              <Text style={styles.headerItemClose}>X</Text>
            </TouchableOpacity>
          </View>
          <TextInput onChangeText={(name) => { const n = name.toUpperCase(); setNameNewEvent(n) }} placeholder="Nome" style={styles.textInput} />
          <TouchableOpacity onPress={() => { newEventCreate() }} style={styles.button}><Text style={styles.labelButton}>Salvar</Text></TouchableOpacity>
        </>
      )}
      <FlatList
        data={listEvents}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => { navigate('ShowEvent', item) }}>
            <View style={styles.item}>
              <Text style={styles.TextItem}>{item.name}</Text>
              <Feather name="chevron-right" size={24} color="black" />
            </View>

          </TouchableOpacity>
        )}
      />
      <TouchableOpacity disabled={isNewEvent} onPress={() => { setIsNewEvent(true) }} style={styles.button}><Text style={styles.labelButton}>Novo</Text></TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  header: {
    marginBottom: 8
  },
  headerFool: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10
  },
  headerItem: {
  },
  headerItemText: {
    color: '#006c8d',
    borderRadius: 6,
    borderWidth: 1,
    padding: 5,
    borderColor: '#006c8d'
  },
  headerItemClose: {
    color: '#8d0000',
    borderRadius: 6,
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 15,
    borderColor: '#8d0000'
  },
  item: {
    paddingVertical: 9,
    borderBottomColor: '#c5c5c5',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextItem: {
    fontSize: 18,
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#00ff95',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
  },
  labelButton: {
    fontSize: 16,
    fontWeight: '500'
  },
  textInput: {
    backgroundColor: "#e9e9e9",
    height: 45,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 4,
    textTransform: 'uppercase'
  }
});
