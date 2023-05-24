import React from 'react'
import Dice from "./components/Dice"
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [diceArray, setDiceArray] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rollCount, setRollCount] = React.useState(0)
  const [bestScore, setBestScore] = React.useState(() => getLocalStorageScore())

  // This side effect checks if we have achieved win conditions
  React.useEffect(() => {
    const allDiceHeld = diceArray.every(die => die.isHeld)
    const firstDie = diceArray[0]
    const diceAreTheSame = diceArray.every(die => die.value === firstDie.value)
    
    if (allDiceHeld && diceAreTheSame) {
      setTenzies(true)
    }
  }, [diceArray])

  // Set roll count in localstorage if it was lower than the current best score
  React.useEffect(() => {
    if (tenzies) {
      if (bestScore > rollCount || bestScore === 0) {
        localStorage.setItem('score', rollCount)
        setBestScore(getLocalStorageScore())
      }
    }
  }, [tenzies])
  
  /**
   * Returns the best score from localStorage, or 0 if none is set
   * @returns {int} Best game score
   */
  function getLocalStorageScore() {
    const score = JSON.parse(localStorage.getItem('score'))
    return score || 0
  }

  /**
   * Returns a single random die value (1-6)
   * Generates ID string with nanoid package
   * @returns {object} `{ value: int, isHeld: bool, id: string }`
   */
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  /**
   * Returns 10 new random dice objects in an array
   * @returns {array} `[{value: int, isHeld: bool, id: string}]`
   */
  function allNewDice() {
    const diceArray = []
    for (let i = 0; i < 10; i++) {
      diceArray.push(generateNewDie())
    }
    return diceArray
  }

  /**
   * Rolls the dice which are not currently held.
   * If there are unheld dice, increments `rollCount` state
   */
  function rollDice() {
    setDiceArray(prevArray => prevArray.map(die => {
      return die.isHeld ?
        die :
        generateNewDie()
    }))
    if (!diceArray.every(die => die.isHeld)) {
      setRollCount(rollCount => rollCount + 1)
    }
  }

  /**
   * Toggles die isHeld value when clicked and updates `diceArray` state
   * @param {string} id The `nanoid` of the specific die
   */
  function holdDice(id) {
    setDiceArray(prevArray => prevArray.map(die => {
        return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }

  // Generate Dice elements from our diceArray in state
  const dieElementsArray = diceArray.map(die => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  // Restart the game, reset counters and states
  const restart = function restartGame() {
    setTenzies(false)
    setDiceArray(allNewDice())
    setRollCount(0)
  }

  return (
    <>
      <main>
        {tenzies && <Confetti />}
        <h1>Tenzies</h1>
        <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='dice-container'>
          {dieElementsArray}
        </div>
        <div className="lower-container">
          <div className="roll-counter">
            <div className='current-count'>
              Roll Count:
              <span className='roll-counter--value'>{rollCount}</span>
            </div>
            <div className='best-count'>
              Best score:
              <span className='roll-counter--best-value'>{bestScore}</span>
            </div>
          </div>
          <button onClick={tenzies ? restart : rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </div>
      </main>
    </>
  )
}

export default App
