# react-native-contact-book


<img src="src/assets/top_component.png" width="300" align="middle" />
<img src="src/assets/letter_side.png" width="300" align="middle" />
<img src="src/assets/letter_center.png" width="300" align="middle" />


## Props

|         props         |   type   |  default  |  desc  |
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

## 用法

### 步骤 1 - 安装

`$ npm install react-native-contact-book --save`

or

`$ yarn add react-native-contact-book`

### 步骤 2 - 引入

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

## 注意

传入的数据`contactList` 是array类型，列表项必须要有nickname，如果有头像则添加avatar，格式如下：
```
[
  {
    "nickname": "路飞",
    "avatar": "https://z3.ax1x.com/2021/05/07/g123h6.jpg",
    "id": "openid1"
  },
  {
    "nickname": "钢铁侠",
    "avatar": "https://z3.ax1x.com/2021/05/07/g121tx.jpg",
    "id": "openid2"
  },

  ...

]
```