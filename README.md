# react-native-contact-book

![top_component](src/assets/top_component.png "top_component")
![letter_side](src/assets/letter_side.png "letter_side")
![letter_center](src/assets/letter_center.png "letter_center")

## Props

|         prop         |   type   |  default  |  desc  |
| :-------: | :---: | :---: |  :------------:  |
|     contactList      |  array   |    []     |  通讯录数据，必须有nickname  |
|   headerComponent    |   node   |   null    |  用于传递顶部导航栏header  |
|     topComponent     |   node   |   null    |  滚动列表头部扩展组件，要给定高度，否则影响滚动位置计算  |
|  topComponentHeight  |  number  |     0     |  如果传了头部扩展组件，则必须传该组件的高度，用于计算  |
|     titleHeight      |  number  |    25     |  通讯录字母标题的高度  |
|      itemHeight      |  number  |    60     |  通讯录项的高度  |
|     letterHeight     |  number  |    20     |  侧边字母栏每个字母的高度  |
|    activeLetterBg    |  string  | '#125FED' |  侧边字母栏选中字母的背景色  |
| activeLetterShowType |  string  |  'side'   |  触摸侧边字母栏滚动时选中字母的显示方式，可选side和center  |
|      showAvatar      | boolean  |   true    |  是否显示头像  |
|      titleStyle      |  object  |    {}     |  自定义通讯录字母标题样式  |
|      itemStyle       |  object  |    {}     |  自定义通讯录项的样式  |
|     onPressItem      | function |  ()=>{}   |  点击通讯录项事件  |

## Usage

### Step 1 - install

`$ npm install react-native-contact-book --save`

or

`$ yarn add react-native-contact-book`

### Step 2 - import and use in project

```javascript
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ContactBook from '@/component/ContactBook';
import contactList from '@/assets/contactList.json';

export default function TestContactBookPlugin() {
  const options = {
    contactList: contactList,
    headerComponent: header(),
    topComponent: topEl(),
    topComponentHeight: 80,  //若传了topComponent，这个高度必传
    activeLetterShowType: 'side',
  };

  function header() {
    return (
      <View
        style={{
          height: 60,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>通讯录</Text>
      </View>
    );
  }

  function topEl() {
    return (
      <View
        style={{
          height: 80,
          backgroundColor: '#FFF',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity activeOpacity={0.6} style={{alignItems:'center'}}>
          <Feather name="user-plus" color={'#125FED'} size={30} />
          <Text style={{fontSize: 16, marginTop: 5}}>新朋友</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} style={{alignItems:'center'}}>
          <Feather name="users" color={'#125FED'} size={30} />
          <Text style={{fontSize: 16, marginTop: 5}}>群聊</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <ContactBook {...options} />;
}
```