import React, { useState } from 'react'

import { DatePicker } from 'react-dater'
import 'react-dater/dist/index.css'

const App = () => {
  const [dates, setDates] = useState({
    checkin: new Date('2022-03-28'),
    checkout: new Date('2022-04-28')
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
