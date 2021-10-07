/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Button,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import {RNCamera} from 'react-native-camera'
import base64 from 'react-native-base64'
import { data } from 'browserslist';
import { id } from 'prelude-ls';

let camera



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [cameraOpen, setOpen] = useState(false)
  const [photoUpload, setUpload] = useState(false)
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function openCamera(){
    setOpen(true)
  }
  
  let takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.warn(data.uri);

    if(data){
      // let file =  base64ToFile(data, fileName)
      let splitString = data.uri.split('/')
      let fileName = splitString[9]
      console.warn(fileName, data.uri)
      console.warn(photoUpload)

      if(photoUpload === false){
        upload(fileName, data.uri)
      }
    }
  };

  function upload(fileName, path){
    setUpload(true)
    let image = {
      uri: path,
      type: 'image/jpeg',
      name: fileName,
    }
    
    const url ='http://system-test.ycs-express.com/api/android/signforCargosTakePictures'
    let dataToPush = new FormData()
    dataToPush.append('user_id', 71)
    dataToPush.append('currentDate', getCurrentTime)
    dataToPush.append('cargoNumber', '12100020911')
    dataToPush.append('image', image)

    // dataToPush.forEach((value,key)=>{
    //   console.warn(key+""+value)
    // })

    let xhr = new XMLHttpRequest()

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }
    
      if (xhr.status === 200) {
        console.warn('success', xhr.responseText);
        setUpload(false)
      } else {
        console.warn('error');
      }
    };

    xhr.open('POST', url)
    xhr.send(dataToPush)
  }

  function getCurrentTime(){
    let now, hour, minutes, seconds, year, month, date
    year = new Date().getFullYear()
    month = new Date().getMonth()
    date = new Date().getDate()
    now = new Date()
    hour = now.getHours()
    minutes = now.getMinutes()
    seconds = now.getSeconds()

    if((month+1).toString().length === 1){
      month = `0${month+1}`
    }else{
      month = month + 1
    }

    if(date.toString().length === 1){
      date = `0${date}`
    }
    
    return this.currentTime = `${year}-${month}-${date}  ${hour}:${minutes}:${seconds}` 
  }

  // function base64ToFile(data, fileName){
  //   let byteString
  //   if(data.split(',')[0].indexOf('base64')>=0){
  //       byteString = base64.decode(data.split(',')[1])
  //   }else{
  //       byteString = unescape(data.split(',')[1])
  //   }
  //   let mimeString = data.split(',')[0].split(':')[1].split(';')[0]

  //   let ia = new Uint8Array(byteString.length)
  //   for(let i = 0;i<byteString.length;i++){
  //       ia[i] = byteString.charCodeAt(i)
  //   } 
  //   let output = new Blob([ia],{type:mimeString})
  //   // 變成png檔，下載可打開
  //   let file = new File([output], fileName, {type:mimeString})
  //   return file
  // }

  return (
    <View style={backgroundStyle}>
      <View style={{display: cameraOpen === true? 'none':'flex'}}>
        <Button title="open camera" onPress={ openCamera }></Button>
      </View>

      <View style={{display: cameraOpen === true? 'flex':'none'}}>
      <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={{justifyContent: 'center', alignItems: 'center', bottom: 150}}>
          <TouchableOpacity style={{width: 80, height: 80, borderColor: 'white', borderWidth: 2, borderRadius: 50, backgroundColor: '#F6742B', borderStyle: 'solid'}} onPress={()=>takePicture(camera)}></TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  camera: {
    width: '100%',
    height: Dimensions.get('window').height,
    
  },
});

export default App;
