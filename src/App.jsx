import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

// THE ACTIONS VARIABLES
export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate'
}

// THE 'reducer' FUNCTION PERFORMS ACTIONS BASED ON THE 'ACTION.type' GIVEN TO IT.
function reducer(state, { type, payload }) {

  switch (type) {

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite == true) {
        return {
          ...state,
          // SETTING 'currentOperand' TO 'payload.digit'(WHAT THE USER ENTER)
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      } else if (payload.digit === "." && state.currentOperand === undefined) {
        return {};
      } else if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        // APPENDING 'payload.digit'(WHAT THE USER ENTER) 'currentOperand' WEATHER THERE IS DATA IN 'currentOperand' OR NOT.
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }


    case ACTIONS.CLEAR:
      // CLEAR EVERYTHING
      return {};


    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        // RETURN NOTHING
        return state;
      }

      // MOVING DATA IN 'currentOperand' TO 'previousOperand'
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      // CHANGING THE OPERATOR ATTECHED TO THE 'previousOperand'
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      // TRANSFERING DATA FROM 'previousOperand' TO 'evaluate' FOR CALCULATION
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }


    // THIS IS WERE CALCULATIONS ARE DONE WITHOUT CLICKING THE '=' BUTTON
    case ACTIONS.EVALUATE:
      // IF ONE OF THESE ARE NOT CARRYING DATA, RETURN NOTHING
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      // SETTING 'currentOperand' TO THE CALCULATED DATA, AND SETTING 'overwrite' TO TRUE, TO ALOW NEW DATA TO BE ENTERED BY USER.
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }


    case ACTIONS.DELETE_DIGIT:
      // ON CLICK, IF 'previousOperand' HAS DATA MOVE IT TO 'currentOperand' FOR CHANGES TO BE MADE. NOTE THE OPERATOR(+,*,|,+) WILL NOT BE INCLUDED.
      if (state.currentOperand == null && state.previousOperand !== null) {
        return {
          ...state,
          overwrite: false,
          currentOperand: state.previousOperand,
          previousOperand: null,
          operation: null
        }
      }

      if (state.overwrite == true) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) {
        return state;
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        // This will delete the last digit
        currentOperand: state.currentOperand.slice(0, -1)
      }

  }
}

// THIS IS THE FUNCTION WHICH DOES THE EVALUATION WHEN THE '=' BUTTON IS CLICKED
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  // CHECKING IF OPERATORS ARE EMPTY
  if (isNaN(prev) || isNaN(current)) {
    // RETURN NOTHING
    return {};
  }

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
    default:
      break;
  }
  return computation.toString();
}

// FORMATING NUMBERS example (123,432,423.09)
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
// THE FUNCTION TO PERFORM NUMBER FORMATING
function formatOperand(operand) {
  if (operand == null) {
    // RETURN NOTHING
    return;
  }
  const [integer, decimal] = operand.split('.');
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  // No formating after decimal(.)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

// THIS IS THE MAIN FUNCTION OF THE WEBAPP
function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <>
      <div className="calculator_grid">

        <div className="output">
          <div className="previous_operand">{formatOperand(previousOperand)} {operation} </div>
          <div className="current_operand">{formatOperand(currentOperand)}</div>
        </div>


        <button className="span_two_AC" onClick={() => dispatch({ type: ACTIONS.CLEAR })}> AC </button>
        <button id="del_button" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}> DEL </button>

        <OperationButton operation="/" dispatch={dispatch} />

        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />

        <OperationButton operation="*" dispatch={dispatch} />

        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />

        <OperationButton operation="+" dispatch={dispatch} />

        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />

        <OperationButton operation="-" dispatch={dispatch} />

        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span_two_equal" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}> = </button>

      </div>
    </>
  )
}

export default App
