import React, { useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  PanResponder,
  Dimensions,
  Platform,
  NativeModules,
} from "react-native";
import PropTypes from "prop-types";
import pinyin from "pinyin";

const defaultLetter = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// 设置沉浸式状态栏
StatusBar.setTranslucent(true);

// 获取状态栏高度
const { StatusBarManager } = NativeModules;
const getStatusBarHeight = () => {
  let sHeight;
  if (Platform.OS === "ios") {
    StatusBarManager.getHeight((statusBarHeight) => {
      sHeight = statusBarHeight;
    });
  } else if (Platform.OS === "android") {
    sHeight = StatusBar.currentHeight;
  }
  return sHeight;
};

export default function ContactBook(props) {
  const {
    contactList,
    headerComponent,
    topComponent,
    topComponentHeight,
    titleHeight,
    itemHeight,
    letterHeight,
    activeLetterBg,
    activeLetterShowType,
    showAvatar,
    titleStyle,
    itemStyle,
    onPressItem,
  } = props;

  let data = [];
  let letterArr = [];
  let isHasErrStr = false;

  // 生成侧边栏字母数组
  for (let i = 0; i < contactList.length; i++) {
    let letter = pinyin(contactList[i].nickname.substring(0, 1), {
      style: pinyin.STYLE_NORMAL,
    })[0][0]
      .substring(0, 1)
      .toUpperCase();
    if (defaultLetter.includes(letter)) {
      letterArr.push(letter);
    } else {
      isHasErrStr = true;
    }
  }
  let letArr = [...new Set(letterArr.sort(pinyin.compare))];
  isHasErrStr && letArr.push("#");

  // 转化列表数据格式
  for (let i = 0; i < letArr.length; i++) {
    data.push({
      title: letArr[i],
      list: [],
    });
  }
  for (let i = 0; i < contactList.length; i++) {
    let letter = pinyin(contactList[i].nickname.substring(0, 1), {
      style: pinyin.STYLE_NORMAL,
    })[0][0]
      .substring(0, 1)
      .toUpperCase();
    for (let j = 0; j < data.length; j++) {
      if (letter === data[j].title) {
        data[j].list.push(contactList[i]);
      }
    }
    if (!defaultLetter.includes(letter)) {
      data[data.length - 1].list.push(contactList[i]);
    }
  }

  // 扁平化数据
  const flatData = (arr) => {
    let list = [];
    let sum = topComponentHeight ? 1 : 0;
    let stickyHeaderIdx = [];
    for (let i = 0; i < arr.length; i++) {
      stickyHeaderIdx.push(sum);
      sum += arr[i].list.length + 1;
      list = list.concat([arr[i].title]).concat(arr[i].list);
    }
    return { list, stickyHeaderIdx };
  };

  // 创建标题位置信息数组
  const creatTitlePs = (arr) => {
    let ps = topComponentHeight || 0;
    let newTitlePs = [];
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        newTitlePs.push({ offsetY: topComponentHeight || 0 });
      } else {
        ps += itemHeight * arr[i - 1].list.length + titleHeight;
        newTitlePs.push({ offsetY: ps });
      }
    }
    return newTitlePs;
  };

  // 创建字母位置信息数组
  const creatLetterPs = (arr) => {
    let newLetterPs = [];
    for (let i = 0; i < arr.length; i++) {
      let item = {};
      if (i === 0) {
        newLetterPs.push({ min: 0, max: letterHeight });
      } else {
        item.min = letterHeight * i;
        item.max = letterHeight * i + letterHeight;
        newLetterPs.push(item);
      }
    }
    return newLetterPs;
  };

  // 动态计算侧栏top的值，实现纵向居中
  const letterTop = (Dimensions.get("window").height - letArr.length * 20) / 2;
  const windowHeight = Dimensions.get("window").height;

  const [dataList, setDataList] = useState(flatData(data).list);
  const [letData, setLetData] = useState(letArr);
  const [isTouch, setIsTouch] = useState(false);
  const [curTouchIdx, setCurTouchIdx] = useState(0);
  const [titlePs, setTitlePs] = useState(creatTitlePs(data));
  const [letterPs, setLetterPs] = useState(creatLetterPs(letArr));
  const scrollRef = useRef();

  let panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      setIsTouch(true);
      let startY = gestureState.y0 - letterTop;
      for (let i = 0; i < letterPs.length; i++) {
        if (letterPs[i].min < startY && letterPs[i].max > startY) {
          setCurTouchIdx(i);
          scrollRef.current.scrollTo({
            x: 0,
            y: titlePs[i].offsetY,
            animated: false,
          });
        }
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      let moveY = gestureState.moveY - letterTop;
      for (let i = 0; i < letterPs.length; i++) {
        if (letterPs[i].min < moveY && letterPs[i].max > moveY) {
          setCurTouchIdx(i);
          scrollRef.current.scrollTo({
            x: 0,
            y: titlePs[i].offsetY,
            animated: false,
          });
        }
      }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      setIsTouch(false);
    },
    onPanResponderTerminate: (evt, gestureState) => {},
    onShouldBlockNativeResponder: (evt, gestureState) => {
      return true;
    },
  });

  return (
    <SafeAreaView style={Styles.container}>
      {headerComponent}
      <View
        style={{ ...Styles.sideLetter, top: letterTop }}
        {...panResponder.panHandlers}
      >
        {letData.map((item, index) => {
          return (
            <View key={index}>
              <Text
                style={
                  curTouchIdx === index
                    ? {
                        ...Styles.activeLetter,
                        backgroundColor: activeLetterBg,
                      }
                    : Styles.letter
                }
              >
                {item}
              </Text>
              {activeLetterShowType === "side" &&
                isTouch &&
                curTouchIdx === index && (
                  <Text
                    style={{ ...Styles.sideLetterLarge, top: letterHeight / 2 }}
                  >
                    {letArr[curTouchIdx]}
                  </Text>
                )}
            </View>
          );
        })}
      </View>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={flatData(data).stickyHeaderIdx}
        style={Styles.scrollView}
        onScroll={({
          nativeEvent: {
            contentOffset: { x, y },
            contentSize: { height, width },
          },
        }) => {
          for (let i = 0; i < titlePs.length; i++) {
            if (y >= titlePs[i].offsetY && !isTouch) {
              setCurTouchIdx(i);
            }
          }
        }}
      >
        {topComponent}
        {dataList.map((item, index) => {
          if (letData.includes(item)) {
            return (
              <View key={index}>
                <Text
                  style={{
                    ...Styles.title,
                    ...titleStyle,
                    height: titleHeight,
                    lineHeight: titleHeight,
                  }}
                >
                  {item}
                </Text>
              </View>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                style={{ ...Styles.item, ...itemStyle, height: itemHeight }}
                onPress={() => onPressItem(item)}
              >
                {item.avatar && showAvatar && (
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      marginRight: 5,
                    }}
                    source={{
                      uri: item.avatar,
                    }}
                  />
                )}
                <Text style={Styles.name}>{item.nickname}</Text>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
      {activeLetterShowType === "center" && isTouch && (
        <View style={Styles.letterModal}>
          <Text style={Styles.letterLarge}>{letArr[curTouchIdx]}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

ContactBook.defaultProps = {
  contactList: [],
  headerComponent: null,
  topComponent: null,
  topComponentHeight: 0,
  titleHeight: 25,
  itemHeight: 60,
  letterHeight: 20,
  activeLetterBg: "#125FED",
  activeLetterShowType: "side",
  showAvatar: true,
  titleStyle: {},
  itemStyle: {},
  onPressItem: () => {},
};

ContactBook.propTypes = {
  contactList: PropTypes.array,
  headerComponent: PropTypes.node,
  topComponent: PropTypes.node,
  topComponentHeight: PropTypes.number,
  titleHeight: PropTypes.number,
  itemHeight: PropTypes.number,
  letterHeight: PropTypes.number,
  activeLetterBg: PropTypes.string,
  activeLetterShowType: PropTypes.string,
  showAvatar: PropTypes.bool,
  titleStyle: PropTypes.object,
  itemStyle: PropTypes.object,
  onPressItem: PropTypes.func,
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: getStatusBarHeight(),
  },
  title: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#F8F8F8",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  name: {
    fontSize: 16,
  },
  sideLetter: {
    position: "absolute",
    right: 0,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  letter: {
    width: 20,
    height: 20,
    color: "#111",
    textAlign: "center",
    lineHeight: 20,
    borderRadius: 20,
  },
  activeLetter: {
    width: 20,
    height: 20,
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
    borderRadius: 20,
  },
  sideLetterLarge: {
    position: "absolute",
    left: -50,
    width: 40,
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    lineHeight: 40,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  letterModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: -50,
    marginTop: -50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  letterLarge: {
    fontSize: 50,
    color: "#FFF",
  },
});
