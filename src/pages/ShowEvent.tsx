// import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Alert, Pressable } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Create, FindAll, Delete } from "../data/storagen";

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import QRCode from 'react-native-qrcode-svg';


export default function App(props: any) {
  const { navigate, goBack } = useNavigation();
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [nameNewGuest, setNameNewGuest] = useState<any>();
  const [currentEvent, setCurrentEvent] = useState<{ id: string | undefined, name: string | undefined }>();
  const [qrRef, setQrRef] = useState<any>();
  const [loadQrShare, setLoadQrShare] = useState<boolean>(false);

  const [lisGuest, setLisGuest] = useState<{ id: string, name: string, event: string | null, presence: boolean }[] | []>([]);

  const [isSheet, setIsSheet] = useState({ isVisible: false, current: '' })

  useEffect(() => {
    setCurrentEvent(props.route.params);
  }, [props])

  useEffect(() => {
    ListGuests();
  }, [currentEvent])

  async function ListGuests() {
    const list: any = await FindAll('@guest', currentEvent?.id);
    setLisGuest(list);
  }

  async function createGuest() {
    await Create('@guest', nameNewGuest, currentEvent?.id);
    ListGuests();
    setIsNewGuest(false);
  }
  async function deleteGuest(id: string) {
    await Delete('@guest', id);
    ListGuests();
    setIsSheet({ isVisible: false, current: '' });
  }



  function saveQrToDisk() {

    let baseQr = '';

    qrRef.toDataURL((data: any) => {
      async function sha() {
        console.log(data)
        const image_source = 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80';
        FileSystem.downloadAsync(
          image_source,
          FileSystem.documentDirectory + '.png'
        )
          .then(({ uri }) => {
            FileSystem.writeAsStringAsync(
              uri,
              data,
              { 'encoding': FileSystem.EncodingType.Base64 }
            )
              .then(() => {
                Sharing.shareAsync(uri);
              })

          })
          .catch(error => {
            console.error(error);
          });
      }

      sha()
    });

  }

  function scan(){
    navigate('ScanQrCode',currentEvent);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => { goBack() }}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>

        <Text style={styles.title}>{currentEvent?.name}</Text>

        <TouchableOpacity onPress={() => { goBack() }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isNewGuest && (
        <>
          <View style={styles.header}>
            <Text>Novo convidado</Text>
            <TouchableOpacity onPress={() => { setIsNewGuest(false) }}>
              <Text style={styles.headerItemClose}>X</Text>
            </TouchableOpacity>
          </View>
          <TextInput onChangeText={(name) => setNameNewGuest(name)} placeholder="Nome" style={styles.textInput} />
          <TouchableOpacity onPress={() => { createGuest() }} style={styles.button}><Text style={styles.labelButton}>Salvar</Text></TouchableOpacity>
        </>
      )}


      <View style={styles.header}>
        <Text>Lista de convidados:</Text>
        <TouchableOpacity onPress={() => { setIsNewGuest(true) }}>
          {!isNewGuest && <Text style={styles.headerItemText}>Novo Convidado</Text>}
        </TouchableOpacity>
      </View>
      <FlatList
        data={lisGuest}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={(e: any) => {
              setIsSheet({ isVisible: true, current: item.id });
            }}>
            <View style={styles.item}>
              <View style={styles.TextItemPrimary}>
                <Text style={styles.TextItem}>{item.name}</Text>
                {item.presence && <Text style={styles.presence}> Presente </Text>}
              </View>

              <Ionicons name="menu" size={24} color="black" />

            </View>
          </TouchableOpacity>
        )}
      />
      {isSheet.isVisible &&
        <Pressable onPress={() => setIsSheet({ isVisible: !isSheet.isVisible, current: '' })} style={styles.modalBlockPress}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSheet.isVisible}
          >
            <View style={styles.modal}>
              <View style={styles.QrCodeModal}>
                <QRCode
                  backgroundColor='#ebebeb'
                  value={isSheet.current}
                  getRef={(e) => { setQrRef(e) }}
                />
              </View>
              <FlatList
                style={styles.listSheet}
                data={[
                  { name: 'Deletar', icon: <Ionicons name="remove-circle-outline" size={24} color="black" />, onPress: (() => { deleteGuest(isSheet.current) }) },
                  { name: 'Enviar Convite', icon: <Ionicons name="ios-share-outline" size={24} color="black" />, onPress: (() => { saveQrToDisk() }) },
                ]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={item.onPress}>
                    <View style={styles.item}>
                      <View style={styles.TextItemPrimary}>
                        <Text style={styles.TextItem}>{item.name}</Text>
                      </View>
                      {item.icon}
                    </View>
                  </TouchableOpacity>
                )}
              />
              <Pressable
                style={[styles.buttonSheet]}
                onPress={() => setIsSheet({ isVisible: !isSheet.isVisible, current: '' })}
              >
                <Text style={styles.labelButtonSheet}>Cancelar</Text>
              </Pressable>
            </View>
          </Modal>
        </Pressable>}
      <TouchableOpacity onPress={()=>{scan()}} style={styles.button}><Text style={styles.labelButton}>Conferir Convite</Text></TouchableOpacity>
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
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#006c8d'
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
    paddingVertical: 10,
    borderTopColor: '#c5c5c5',
    borderTopWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextItemPrimary: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextItem: {
    fontSize: 18,
    fontWeight: '500'
  },
  presence: {
    color: '#009456'
  },
  button: {
    backgroundColor: '#00ff95',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonSheet: {
    backgroundColor: '#8d0000',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15
  },
  labelButtonSheet: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
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
    marginVertical: 4
  },
  modal: {
    height: 300,
    backgroundColor: '#e9e9e9',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalBlockPress: {
    position: 'absolute',
    width: '120%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    marginLeft: -15,
    marginTop: -20
  },
  QrCodeModal: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  listSheet: {
    paddingHorizontal: 10,
  }
});
