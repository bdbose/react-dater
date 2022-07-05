import React, { useEffect, useState } from 'react'

import { DatePicker } from 'react-dater'
import 'react-dater/dist/index.css'

import blockedJson from './data.json'

import { customDates, format } from 'multi-date'

const App = () => {
  const [dates, setDates] = useState({
    checkin: '',
    checkout: ''
  })
  const [open, setOpen] = useState(true)
  const [blocked, setBlocked] = useState([])
  const getBlocked = async () => {
    setBlocked(blockedJson)
  }
  const calculateBlockedDates = () => {
    const tempArr = blocked
    for (let i = 1; i <= 30; i++) {
      let checkIn = format(customDates(dates.checkin, i, 'day'), 'YYYY-MM-DD')
      if (tempArr.includes(checkIn)) {
        let indx = tempArr.indexOf(checkIn)
        tempArr.splice(indx, 1)
        setBlocked([
          ...tempArr.slice(0, indx),
          ...tempArr.slice(indx, tempArr.length - 1)
        ])
        break
      }
    }
  }

  useEffect(() => {
    getBlocked()
  }, [])

  useEffect(() => {
    if (!dates.checkin) {
      getBlocked()
    } else {
      calculateBlockedDates()
    }
  }, [dates.checkin])

  const [toggle, setToggle] = useState(true)
  return (
    <>
      <button
        onClick={() => {
          if (toggle) {
            getBlocked()
          } else {
            setBlocked(blockedJson)
          }
          setToggle(!toggle)
        }}
      >
        Toggle
      </button>
      <span>{blocked.length}</span>
      <div className='ieo'>
        <DatePicker
          dates={dates}
          setDates={setDates}
          open={open}
          setOpen={setOpen}
          mobile={window.innerWidth < 800 ? true : false}
          sticky={false}
          blocked={blocked}
          sameDay={0}
        >
          {/* <div className='sda'>
            <button onClick={() => setOpen(!open)}>
              {dates.checkin && dates.checkin.toDateString()} |{' '}
              {dates.checkout && dates.checkout.toDateString()}
            </button>
          </div> */}
        </DatePicker>
      </div>
    </>
  )
}

export default App
