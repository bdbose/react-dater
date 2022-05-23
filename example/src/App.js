import React, { useEffect, useState } from 'react'

import { DatePicker } from 'react-dater'
import 'react-dater/dist/index.css'

import blockedJson from './data.json'

const App = () => {
  const [dates, setDates] = useState({
    checkin: '',
    checkout: ''
  })
  const [open, setOpen] = useState(true)
  const [blocked, setBlocked] = useState([])
  const getBlocked = async () => {
    const data = await fetch(
      'https://www.saffronstays.com/calender_node.php?listingList=4n25AV4ZEBzoXgqj&checkIn=2022-05-23&checkOut=2023-05-23',
      {
        headers: {},
        body: null,
        method: 'GET'
      }
    )
    const dataJson = await data.json()
    let blockedDates = []
    let rooms = 3
    const res = dataJson['4n25AV4ZEBzoXgqj']
    Object.keys(res).forEach((ele) => {
      if (res[ele].available === '' || res[ele].available === '0') {
        blockedDates.push(ele)
      } else if (
        res[ele].status === 'unavailable' ||
        res[ele].status === 'booked' ||
        res[ele].status === 'blocked'
      ) {
        blockedDates.push(ele)
      } else if (parseInt(res[ele].available) < rooms) {
        blockedDates.push(ele)
      }
    })
    setBlocked(blockedDates)
  }

  useEffect(() => {
    getBlocked()
  }, [])

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
        {blocked.length !== 0 ? (
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
        ) : (
          'Loading'
        )}
      </div>
    </>
  )
}

export default App
