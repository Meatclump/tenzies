import React from 'react'
import t1 from '/Terning1.svg'
import t2 from '/Terning2.svg'
import t3 from '/Terning3.svg'
import t4 from '/Terning4.svg'
import t5 from '/Terning5.svg'
import t6 from '/Terning6.svg'

export default function Dice(props) {
    const dieFaces = [t1, t2, t3, t4, t5, t6]
    const styles = {
        filter: props.isHeld ? 'hue-rotate(135deg)' : 'unset'
    }
    
    return(
        <div
            className='dice'
            style={styles}
            onClick={props.holdDice}
        >
            <img className='die-face' src={dieFaces[props.value-1]} alt={props.value} />
        </div>
    )
}
