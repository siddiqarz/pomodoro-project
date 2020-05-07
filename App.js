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
let inputChanged = false;


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
      let mins = this.state.inputTime.workMinutes;
      let secs = this.state.inputTime.workSeconds;
      if (this.state.inputTime.workMinutes== 0 && this.state.inputTime.workSeconds == 0)
       {
        this.setState({
          isWorkDone: true,
          minutes: this.state.inputTime.breakMinutes,
          seconds: this.state.inputTime.breakSeconds,
        });
      } else {
        this.setState({
          minutes: this.state.inputTime.workMinutes,
          seconds: this.state.inputTime.workSeconds
        });

      }
      this.timer = setInterval(this.tick, 1000);
    } else {
      clearInterval(this.timer);
    }
  }

  restartTimer() {
    clearInterval(this.timer)
       this.setState({
        isWorkDone: false,
        minutes: this.state.inputTime.workMinutes,
        seconds: this.state.inputTime.workSeconds,
        isStarted: false
       },
       () => {
timerStart=false });
  }

  tick = () => {
    if (this.state.minutes == 0 && this.state.seconds == 0) {
      if (this.state.isWorkDone) {
        this.setState({
          minutes: this.state.inputTime.workMinutes,
          seconds: this.state.inputTime.workSeconds,
          isWorkDone:false
        })
      } else {
        this.setState({
          minutes: this.state.inputTime.breakMinutes,
          seconds: this.state.inputTime.breakSeconds,
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
        this.setState(prevState => ({
          seconds: prevState.seconds - 1,
        }));
      }
    }
  };

  pad = n => {
    if(isNaN(n)){
      return '00'
    }
    else {
    n= parseInt(n,10);
    return n < 10 ? '0' : '';
    }
  };

  textInputChanged = () => {
    console.log(this.state.workMinutes)
    clearInterval(this.timer);
     timerStart = false;
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
                    workMinutes:text,
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
                    workSeconds: text
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
                    breakMinutes: text,
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
                    breakSeconds: text,
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
