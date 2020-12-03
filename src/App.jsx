import React from 'react';
import ReactDOM from 'react-dom';
import { Page, Button, Input } from 'react-onsenui';
import Item from './Item.jsx';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: "", // 入力テキスト
      items: [] // Itemの要素を記憶しておくための配列
    };
    this.addItem = this.addItem.bind(this);
  }



  addItem() {
    var newitems = this.state.items;
    var now = new Date();
	  var year = now.getFullYear();
	  var mon = now.getMonth()+1; //１を足すこと
	  var day = now.getDate();
	  var hour = now.getHours();
	  var min = now.getMinutes();
	  var sec = now.getSeconds();
	  var d = year+"/"+mon+"/"+day+" "+hour+":"+min+":"+sec; 

    newitems.push({ text: this.state.inputText, time: d }); // 入力テキストをitems配列に追加
    this.setState({ inputText: "", items: newitems }); // this.stateを更新

    firestore
    .collection("memo")
    .add({
      text: this.state.inputText,
      date: d
    })
    .then((docRef) => {
      //componentDidMount();
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  componentDidMount() {
    document.addEventListener("DOMContentLoaded", () => {
      firestore
      .collection("memo")
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("no matching documents");
        }
        var items = [];
        snapshot.forEach((data) => {
          var item = data.data();
          items.push({ text: item.text, date: item.date.toDate() });
        });
        this.setState({ inputText: "", items: items });
      });
    });
  }

  render() {
    return (
      <Page>
        <Input value={this.state.inputText}
        onChange={(event) => { this.setState({ inputText: event.target.value, items: this.state.items }) }}
        modifier="material" />
          <Button onClick={this.addItem}>追加</Button>
        {this.state.items.map(item => {
          return <Item text={item.text} time={item.time}></Item>
        })}
      </Page>
    );
  }
}
