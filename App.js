import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';

let timerStart = false;
let timerPaused = false;


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      minutes: 0,
      seconds: 8,
      isWorkDone: false,
      isStarted: false,
      inputTime: {
        workMinutes: 0,
        workSeconds: 8,
        breakMinutes: 0,
        breakSeconds: 4,
      },
    };
  }
  componentDidMount() {
     this.toggleTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  toggleTimer() {
    timerStart = !timerStart;
    this.setState({
      isStarted: timerStart,
    });
    if (timerStart) {
      if (this.state.inputTime.workMinutes== 0 && this.state.inputTime.workSeconds == 0 && !timerPaused)       
      {
      let mins = this.getMinutesFromSeconds(this.state.inputTime.breakSeconds)
        this.setState({
          isWorkDone: true,
          minutes: this.state.inputTime.breakMinutes + mins,
          seconds: this.state.inputTime.breakSeconds - (mins*60),
        });
      }
      else {
        if(!timerPaused){
          console.log("timer upaused")
        let mins = this.getMinutesFromSeconds(this.state.inputTime.workSeconds)
        console.log("current mins",this.state.inputTime.workMinutes)

        console.log("got mins from secs",Number(this.state.inputTime.workMinutes + mins))
        
        this.setState({
          minutes: this.state.inputTime.workMinutes + mins,
          seconds:this.state.inputTime.workSeconds - (mins*60),
        });
      }
      else{
        timerPaused=false;
      }
      }
       this.timer = setInterval(this.tick, 1000);
      
    } else {
      clearInterval(this.timer);
      timerPaused = true;
    }
  }

  getMinutesFromSeconds(secs){
    return Math.floor(secs/60);
  }
  restartTimer() {
    clearInterval(this.timer)
    let mins = this.getMinutesFromSeconds(this.state.inputTime.workSeconds);
       this.setState({
        isWorkDone: false,
        minutes: this.state.inputTime.workMinutes + mins,
        seconds: this.state.inputTime.workSeconds - (mins*60),
        isStarted: false
       },
       () => {
timerStart=false });
  }

  tick = () => {
    if (this.state.minutes == 0 && this.state.seconds == 0) {
      if (this.state.isWorkDone) {
        let mins = this.getMinutesFromSeconds(this.state.inputTime.workSeconds)
        this.setState({
          minutes: this.state.inputTime.workMinutes + mins,
          seconds: this.state.inputTime.workSeconds - (mins*60),
          isWorkDone:false
        })
      } else {
        let mins = this.getMinutesFromSeconds(this.state.inputTime.breakSeconds)
        this.setState({
          minutes: this.state.inputTime.breakMinutes + mins,
          seconds: this.state.inputTime.breakSeconds - (mins*60),
          isWorkDone:true
        });
      }
    } else {
      if (this.state.seconds == 0) {
        this.setState(prevState => ({
          minutes: prevState.minutes - 1,
          seconds: 59,
        }));
      } else {
        console.log('paused ', this.state.minutes)

        this.setState(prevState => ({
          seconds: prevState.seconds - 1,
        }));
      }
    }
  };

  pad = n => {
    n= parseInt(n,10);
    if(!isNaN(n)){
    return n < 10 ? '0' : '';
    } else {
    console.log('in else')
      return '00';}
  };

 
  textInputChanged = (text) => {
    clearInterval(this.timer);
     timerStart = false;
     timerPaused=false;
    this.setState({
      isStarted: timerStart,
      isWorkDone: false
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button
            title={this.state.isStarted ? 'PAUSE' : 'START'}
            onPress={() => this.toggleTimer()}
          />
          <Button title="reset" onPress={() => this.restartTimer()} />
        </View>
        <Text style={styles.timerStyle}>{this.state.isWorkDone? 'BREAK TIMER': 'WORK TIMER'}</Text>
        <Text style={styles.timerStyle}>
    {this.pad(this.state.minutes)}{this.state.minutes}:{this.pad(this.state.seconds)}{this.state.seconds}
        </Text>
        <Text>Work Time</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            keyboardType='numeric'
            onChangeText={text => {
              this.setState(
                {
                  inputTime: Object.assign({}, this.state.inputTime, {
                    workMinutes: isNaN(Number(text))?0:Number(text),
                  }),
                },
                () => {
                  this.textInputChanged();
                }
              );
            }}
            value={`${this.state.inputTime.workMinutes}`}
          />
          <Text>:</Text>
          <TextInput
            style={styles.textInput}
            keyboardType='numeric'
            onChangeText={text => {
              this.setState(
                {
                  inputTime: Object.assign({}, this.state.inputTime, {
                    workSeconds: isNaN(Number(text))?0:Number(text),
                  }),
                },
                () => {
                  this.textInputChanged();
                }
              );
            }}
            value={`${this.state.inputTime.workSeconds}`}
          />
        </View>
        <Text>Break Time</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            keyboardType='numeric'
            onChangeText={text => {
              this.setState(
                {
                  inputTime: Object.assign({}, this.state.inputTime, {
                    breakMinutes: isNaN(Number(text))?0:Number(text),
                  }),
                },
                () => {
                  this.textInputChanged();
                }
              );
            }}
            value={`${this.state.inputTime.breakMinutes}`}
          />
          <Text>:</Text>
          <TextInput
            style={styles.textInput}
            keyboardType='numeric'
            onChangeText={text => {
              this.setState(
                {
                  inputTime: Object.assign({}, this.state.inputTime, {
                    breakSeconds: isNaN(Number(text))?0:Number(text),
                  }),
                },
                () => {
                  this.textInputChanged();
                }
              );
            }}
            value={`${this.state.inputTime.breakSeconds}`}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
   paddingLeft: 60,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  textInput: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    width: 50,
    height: 40,
    paddingLeft: 10,
  },
  timerStyle:{
    fontSize: 30,
    fontWeight: "bold",
    alignItems: 'center',
    justifyContent: 'center', 
  },
});
