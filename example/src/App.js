import React, { useEffect, useState } from 'react'

import { DatePicker } from 'react-dater'
import 'react-dater/dist/index.css'

import { customDates, format, compareDates } from 'multi-date'
import axios from 'axios'

const App = () => {
  const [dates, setDates] = useState({
    checkin: '',
    checkout: ''
  })
  const [open, setOpen] = useState(true)

  const [blocked, setBlocked] = useState([])
  const [blockedTemp, setBlockedTemp] = useState([])

  const [storeDates, setStoreDates] = useState([])
  const getCalendarData = async () => {
    const checkout = customDates(format(new Date(), 'YYYY-MM-DD'), 1, 'year')
    let data = await axios(
      `https://ecapi2.saffronstays.com//fetch-calendar/6tUAe6Z6C5KFnXR0?checkIn=${format(
        new Date(),
        'YYYY-MM-DD'
      )}&checkOut=${format(checkout, 'YYYY-MM-DD')}`
    )
    setStoreDates(data.data['6tUAe6Z6C5KFnXR0'])
  }

  useEffect(() => {
    getCalendarData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [roomsData, _] = useState(2)
  const [spl, setSpl] = useState(false)
  const getBlockedDate = async () => {
    setBlocked(
      // @ts-ignore
      await getBlockedDates('6tUAe6Z6C5KFnXR0', roomsData, storeDates)
    )
    if (blockedTemp.length === 0) {
      setBlockedTemp(
        // @ts-ignore
        await getBlockedDates('6tUAe6Z6C5KFnXR0', roomsData, storeDates)
      )
    }
  }

  useEffect(() => {
    if (storeDates.length !== 0) getBlockedDate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDates])

  const getBetweenDates = (start) => {
    let arr = []
    for (let i = 1; i < 100; i++) {
      arr.push(format(customDates(start, i, 'day'), 'YYYY-MM-DD'))
    }
    return arr
  }

  const getNextBlockDate = (d) => {
    let i
    for (i = 0; i < blockedTemp.length; i++) {
      if (compareDates(blockedTemp[i], d) === -1) {
        return i
      }
    }
    return 0
  }

  const calculateBlockedDates = (flag = 1) => {
    let tempArr = [...blockedTemp]
    for (let i = 1; i <= 30; i++) {
      let checkIn = format(customDates(dates.checkin, i, 'day'), 'YYYY-MM-DD')

      if (
        // @ts-ignore
        tempArr.includes(checkIn) ||
        minNightsData.includes(format(dates.checkin, 'YYYY-MM-DD'))
      ) {
        // @ts-ignore
        let indx = tempArr.indexOf(checkIn)
        const t = tempArr.splice(indx, 1)

        if (flag === 1) {
          const nextDay = customDates(dates.checkin, 1, 'day')
          if (
            minNightsData.includes(format(dates.checkin, 'YYYY-MM-DD')) &&
            tempArr.includes(
              // @ts-ignore
              format(customDates(dates.checkin, 2, 'day'), 'YYYY-MM-DD')
            )
          ) {
            if (
              !blockedTemp.includes(
                // @ts-ignore
                format(customDates(dates.checkin, 1, 'day'), 'YYYY-MM-DD')
              )
            ) {
              setSpl(true)
              // @ts-ignore
              setBlocked([
                ...tempArr.splice(0, getNextBlockDate(dates.checkin)),
                format(nextDay, 'YYYY-MM-DD'),
                ...getBetweenDates(
                  format(customDates(dates.checkin, 2, 'day'), 'YYYY-MM-DD')
                )
              ])
            }
            // @ts-ignore
            else setBlocked([...tempArr.slice(0, indx), ...getBetweenDates(t)])
          } else if (
            minNightsData.includes(format(dates.checkin, 'YYYY-MM-DD')) &&
            // @ts-ignore
            !tempArr.includes(format(nextDay, 'YYYY-MM-DD'))
          ) {
            // @ts-ignore
            if (blockedTemp.includes(format(nextDay, 'YYYY-MM-DD'))) {
              // @ts-ignore
              setBlocked([...tempArr.slice(0, indx), ...getBetweenDates(t)])
            } else {
              setSpl(true)
              // @ts-ignore
              setBlocked([
                ...tempArr.slice(0, getNextBlockDate(dates.checkin)),
                format(nextDay, 'YYYY-MM-DD'),
                ...tempArr.slice(
                  getNextBlockDate(dates.checkin),
                  tempArr.length - 1
                )
              ])
            }
          }
          // @ts-ignore
          else setBlocked([...tempArr.slice(0, indx), ...getBetweenDates(t)])
        } else {
          setSpl(false)
          setBlocked([
            ...tempArr.slice(0, indx),
            ...tempArr.slice(indx, tempArr.length - 1)
          ])
        }
        break
      }
    }
  }

  useEffect(() => {
    if (storeDates.length !== 0) {
      if (!dates.checkin) {
        getBlockedDate()
      } else if (dates.checkin && !dates.checkout) {
        calculateBlockedDates()
      } else if (dates.checkin && dates.checkout) {
        calculateBlockedDates(0)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates])

  // useEffect(() => {
  //   if (
  //     format(dates.checkin, 'YYYY-MM-DD') ===
  //     format(dates.checkout, 'YYYY-MM-DD')
  //   ) {
  //     setDates({
  //       // @ts-ignore
  //       checkin: '',
  //       // @ts-ignore
  //       checkout: ''
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dates.checkout])

  return (
    <>
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
          spl={spl}
          detail={storeDates}
        >
          {/* <div className='sda'>
            <button onClick={() => setOpen(!open)}>
              {dates.checkin && dates.checkin.toDateString()} |{' '}
              {dates.checkout && dates.checkout.toDateString()}
            </button>
          </div> */}
          <>
            {dates.checkin && dates.checkin.toDateString()} |{' '}
            {dates.checkout && dates.checkout.toDateString()}
          </>
        </DatePicker>
      </div>
    </>
  )
}

export default App

const getBlockedDates = async (id, rooms, data) => {
  const res = data
  let blockedDates = []
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
  return blockedDates
}

const minNightsData = [
  '2022-08-13',
  '2022-08-14',
  '2022-10-15',
  '2022-10-15',
  '2022-10-22',
  '2022-10-23',
  '2022-10-24',
  '2022-12-23',
  '2022-12-24',
  '2022-12-30',
  '2022-12-31'
]
