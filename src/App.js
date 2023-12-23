import './App.css';
import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';


const Display = (props) => {
  return (
    <div id="display" className='position-relative'>
        <h4  className='position-absolute bottom-0 end-0'>{props.inputDisplay}</h4>
    </div>
  )
}

const Operators = (props) => {
   
  const changeInput = (char) => {
    let operators = ['/', '*', '+'];
    return () => {
      if((props.isInitializedVar == true)){
        if(props.initialInputVar.length === 0){
          if(operators.some((operator) => operator === char) === false){
            if(char !== '-' && char !== '.'){
              props.setInitialInputFunc(char);
              props.setisInitializedFunc(false);
            } else {
              props.setInitialInputFunc(`0${char}`);   
              props.setisInitializedFunc(false); 
            }
          }
        } else {
          props.setInitialInputFunc(input => input + char);
          props.setisInitializedFunc(false);
        }
      } else {
        props.setInitialInputFunc(input => input + char);
      }
    }
  }

  const intialize = () => {
    return () => {
      props.setDisplayFunc("0");
      props.setInitialInputFunc("");
      props.setisInitializedFunc(true);
    }
  }

  const calculate = () => {
    return () => {
      let exp = math.compile(props.displayVar);
      props.setInitialInputFunc(math.round(exp.evaluate(), 4).toString());
      props.setisInitializedFunc(true);
    }
  }
  
  
  return  (
    <div id="operators" className='operators-struct'>
        <button onClick={intialize()} id="clear" className='horizontal-growth AC'><span>AC</span></button>
        <button onClick={changeInput('/')} id="divide" className='item operator'><span>/</span></button>
        <button onClick={changeInput('*')} id="multiply" className='item operator'><span>x</span></button>
        <button onClick={changeInput('7')} id="seven" className='item num'><span>7</span></button>
        <button onClick={changeInput('8')} id="eight" className='item num'><span>8</span></button>
        <button onClick={changeInput('9')} id="nine" className='item num'><span>9</span></button>
        <button onClick={changeInput('-')} id="subtract" className='item operator'><span>-</span></button>
        <button onClick={changeInput('4')} id="four" className='item num'><span>4</span></button>
        <button onClick={changeInput('5')} id="five" className='item num'><span>5</span></button>
        <button onClick={changeInput('6')} id="six" className='item num'><span>6</span></button>
        <button onClick={changeInput('+')} id="add" className='item operator'><span>+</span></button>
        <button onClick={changeInput('1')} id="one" className='item num'><span>1</span></button>
        <button onClick={changeInput('2')} id="two" className='item num'><span>2</span></button>
        <button onClick={changeInput('3')} id="three" className='item num'><span>3</span></button>
        <button onClick={calculate()} id="equals" className="vertical-growth equals-sign"><span>=</span></button>
        <button onClick={changeInput('0')} id="zero" className='horizontal-growth num'><span>0</span></button>
        <button onClick={changeInput('.')} id="decimal" className='horizontal-growth num'><span>.</span></button>
    </div>
  )
}


const App = () => {
  const [initialInput, setInitialInput] = useState("");
  const [display, setDisplay] = useState("0");
  const [isInitialized, setisInitialized] = useState(true);

  const checkMultipleZeroes = (input) => {
    let inputArr = input.split("");
    let lastOperatorIndex = findLastOperatorIndex(inputArr);
    let newInputFromOperator = inputArr.slice(lastOperatorIndex, inputArr.length);

    if(lastOperatorIndex <= 0) {
      if (inputArr[0] == '0' && inputArr[1] == '0') {
        return true;
      } else {
        return false;
      }
    } else {
      if(newInputFromOperator[1] == '0' && newInputFromOperator[2] == '0') {
        return true;
      } else {
        return false;
      }
    }

  }

  const checkLastTwoCharsSame = (input) => {
    if((input[input.length - 1] === '.') && (input[input.length - 2] === '.')) {
      return true;
    } else {
      return false;
    }
  }

  const checkLastTwoCharsOperators = (input) => {
    let operators = ['*', '/', '+'];
    if((operators.some((operator) => input[input.length - 1] === operator)) && (operators.some((operator) => input[input.length - 2] === operator))) {
      return true;
    } else {
      return false;
    }
  }

  //check if last three characters in initialInput are operands, if they are then return true 
  const checkLastTwoCharsMinus = (input) => {
    if((input[input.length - 1] === '-') && (input[input.length - 2] === '-') && (input[input.length - 3] === '-')) {
      return true;
    } else {
      return false;
    }
  }

  const checkLastThreeOperators = (input) => {
    let operators = ['*', '/', '+', '-'];
    if((operators.some((operator) => input[input.length - 1] === operator)) && (operators.some((operator) => input[input.length - 2] === operator)) && (operators.some((operator) => input[input.length - 3] === operator))) {
      return true;
    } else {
      return false;
    }
  }

  const getOccurence = (input, searchValue) => {
    return input.filter((value) => (value === searchValue)).length;
  }

  const findLastOperatorIndex = (arr) => {
    let allOperators = ['-', '+', '*', '/'];
    let lastIndex = 0;
    for(let i = arr.length - 1; i >= 0; i--) {
      if(allOperators.some((operator) => operator === arr[i])){
        lastIndex += i;
        return lastIndex;
      }
    }
    if(lastIndex === 0) {
      return 0;
    }
  }

  const decimalsBetweenOperatorAndLast = (input) => {
    let inputArr = input.split("");
    let lastOperatorIndex = findLastOperatorIndex(inputArr);
    let newInputArr = inputArr.slice(lastOperatorIndex, inputArr.length);
    let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    if(getOccurence(newInputArr, '.') === 2 && numbers.some((number) => number === newInputArr[newInputArr.length - 1])){
      return true;
    } else {
      return false;
    }

  }

  //if last decimal point and first decimal point have an operator in between
  useEffect(() => {
    if(initialInput !== "" ) {
      //if the last two characters in initialINput string are decimals or are operators then --> set display to intialInput but you remove the 2nd last character in InitialINput 
      let initialInputArr = initialInput.split(""); 
      if(checkLastTwoCharsSame(initialInput) == true || checkMultipleZeroes(initialInput) == true || checkLastTwoCharsOperators(initialInput) == true || checkLastTwoCharsMinus(initialInput)) {
        initialInputArr.splice(initialInputArr.length - 2, 1);
      } else if (checkLastThreeOperators(initialInput) == true) {
        initialInputArr.splice(initialInputArr.length - 3, 2);
      }// else if you find 2 decimal points in initialInput and there is no operator between last and first decimal point, then remove the decimal point at the last index
      else if(decimalsBetweenOperatorAndLast(initialInput) === true) {
        let decimalIndex = initialInputArr.findLastIndex((char) => (char === '.'));
        initialInputArr.splice(decimalIndex, 1);
      }
      setInitialInput(initialInputArr.join(""));
      setDisplay(initialInput);
    }
  }, [initialInput])
  
  return (
    <div className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
      <div id="myCalculator" className="myCalc rounded">
        <Display inputDisplay={display}/>
        <Operators setInitialInputFunc={setInitialInput} setDisplayFunc={setDisplay} initialInputVar={initialInput} isInitializedVar={isInitialized} setisInitializedFunc={setisInitialized} displayVar={display}/>
      </div>
    </div>
  );
}

export default App;
