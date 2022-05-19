import React, { useState } from 'react'

import { DatePicker } from 'react-dater'
import 'react-dater/dist/index.css'

import blocked from './data.json'

const App = () => {
  const [dates, setDates] = useState({
    checkin: '',
    checkout: ''
  })
  const [open, setOpen] = useState(true)
  return (
    <>
      <div className='ieo'>
        <DatePicker
          dates={dates}
          setDates={setDates}
          open={open}
          setOpen={setOpen}
          mobile={window.innerWidth < 800 ? true : false}
          sticky={false}
          blocked={blocked}
        >
          <div className='sda'>
            <button onClick={() => setOpen(!open)}>
              {dates.checkin && dates.checkin.toDateString()} |{' '}
              {dates.checkout && dates.checkout.toDateString()}
            </button>
          </div>
        </DatePicker>
      </div>
    </>
  )
}

export default App
