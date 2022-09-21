/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import './styles.module.css'
import { ReactComponent as LeftArrow } from './assets/left.svg'
import { ReactComponent as RightArrow } from './assets/right.svg'
import { format } from 'multi-date'

export const DatePicker = ({
  children,
  dates,
  setDates,
  noMonth = 2,
  open,
  setOpen,
  sticky = true,
  infinite = true,
  className = '',
  style,
  mobile = false,
  blocked = [],
  sameDay = 0,
  spl = false,
  detail = [],
  normal = false
}) => {
  const [noOfMonth, setNoOfMonth] = useState(noMonth)
  const [nShow, setNShow] = useState([
    {
      m:
        dates.checkin && !isNaN(new Date(dates.checkin))
          ? dates.checkin.getMonth()
          : new Date().getMonth(),
      y:
        dates.checkin && !isNaN(new Date(dates.checkin))
          ? dates.checkin.getFullYear()
          : new Date().getFullYear()
    }
  ])

  useEffect(() => {
    if (
      format(dates.checkin, 'YYYY-MM-DD') ===
      format(dates.checkout, 'YYYY-MM-DD')
    ) {
      setDates({
        // @ts-ignore
        checkin: '',
        // @ts-ignore
        checkout: ''
      })
    }
  }, [dates.checkout])

  const dateRef = useRef()
  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        if (sticky) setOpen(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dateRef])
  useEffect(() => {
    const arr = [...nShow]
    while (true) {
      if (arr.length === noOfMonth) {
        break
      }
      if (arr[arr.length - 1].m === 11) {
        arr.push({
          m: 0,
          y: arr[arr.length - 1].y + 1
        })
      } else {
        arr.push({
          m: arr[arr.length - 1].m + 1,
          y: arr[arr.length - 1].y
        })
      }
    }
    setNShow(arr)
  }, [noOfMonth])
  const [mob, setMob] = useState(mobile)

  // useEffect(() => {
  //   window.addEventListener('resize', () => {
  //     if (window.innerWidth < breakpoint) {
  //       setMob(true)
  //     } else {
  //       setMob(false)
  //       setNoOfMonth(noMonth)
  //     }
  //   })
  //   window.addEventListener('load', () => {
  //     if (window.innerWidth < breakpoint) {
  //       setMob(true)
  //     } else {
  //       setMob(false)
  //       setNoOfMonth(noMonth)
  //     }
  //   })
  // }, [])
  const nextMonths = () => {
    const newArr = nShow.map((ele) => {
      if (ele.m === 11) {
        return {
          m: 0,
          y: ele.y + 1
        }
      }
      return {
        m: ele.m + 1,
        y: ele.y
      }
    })
    setNShow(newArr)
  }
  const prevMonths = () => {
    const newArr = nShow.map((ele) => {
      if (ele.m === 0) {
        return {
          m: 11,
          y: ele.y - 1
        }
      }
      return {
        m: ele.m - 1,
        y: ele.y
      }
    })
    setNShow(newArr)
  }
  const LeftButton = styled.button`
    position: absolute;
    background: none;
    border: 0;
    left: 30px;
    padding: 10px;
    top: calc(1.5em + 10px);
    cursor: pointer;
  `
  const RightButton = styled.button`
    position: absolute;
    background: none;
    border: 0;
    right: 30px;
    padding: 10px;
    top: calc(1.5em + 10px);
    cursor: pointer;
  `

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10
    if (bottom && mob) {
      const arr = []
      if (nShow[nShow.length - 1].m === 11) {
        arr.push({
          m: 0,
          y: nShow[nShow.length - 1].y + 1
        })
      } else {
        arr.push({
          m: nShow[nShow.length - 1].m + 1,
          y: nShow[nShow.length - 1].y
        })
      }
      // e.target.scrollTop = 10
      setNShow([...nShow, ...arr])
    }
    // const top = e.target.scrollTop
    // if (top === 0) {
    //   const arr = []
    //   if (nShow[0].m === 0) {
    //     arr.push({
    //       m: 11,
    //       y: nShow[0].y - 1
    //     })
    //   } else {
    //     arr.push({
    //       m: nShow[0].m - 1,
    //       y: nShow[0].y
    //     })
    //   }
    //   // console.log([...arr, nShow[0]])
    //   setNShow([...arr, nShow[0]])
    // }
  }

  return (
    <div
      className={'date-picker ' + className}
      ref={dateRef}
      tabIndex={0}
      id='date-picker'
    >
      {children}
      {open && (
        <div
          className='date-picker-wrapper'
          onScroll={handleScroll}
          style={{
            display: 'flex',
            gap: '20px',
            width: mob ? '100%' : 'fit-content',
            position: 'absolute',
            flexDirection: mob ? 'column' : 'row',
            background: '#FFFFFF',
            border: !mob && '1px solid #F2F2F2',
            boxSizing: 'border-box',
            boxShadow: !mob && '0px 0px 50px 4px rgba(221, 221, 221, 0.35)',
            borderRadius: '10px',
            padding: mob ? '20px 0' : '20px 40px',
            alignItems: mob && 'center',
            overflowY: mob && 'auto',
            maxHeight: mob && '400px',
            ...style
          }}
        >
          {!mob && (
            <React.Fragment>
              <LeftButton onClick={prevMonths}>
                <LeftArrow />
              </LeftButton>

              <RightButton onClick={nextMonths}>
                <RightArrow />
              </RightButton>
            </React.Fragment>
          )}
          {nShow
            .slice(!mob ? nShow.length - 2 : 0, nShow.length)
            .map((ele, indx) => {
              return (
                <Months
                  setDates={setDates}
                  month={ele.m}
                  year={ele.y}
                  dates={dates}
                  key={`${ele.m}+${ele.y}`}
                  mob={mob}
                  blocked={blocked}
                  sameDay={sameDay}
                  spl={spl}
                  detail={detail}
                  normal={normal}
                />
              )
            })}
        </div>
      )}
    </div>
  )
}

const Months = ({
  dates,
  setDates,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  mob,
  blocked,
  sameDay,
  spl,
  detail,
  normal
}) => {
  const [changeMonth, setChangeMonth] = useState({
    month: month,
    year: year
  })
  const [data, setData] = useState({})
  const [monthAvg, setMonthAvg] = useState(0)

  useMemo(() => {
    setData(
      getDaysInMonth(
        changeMonth.month,
        changeMonth.year,
        blocked,
        sameDay,
        normal
      )
    )
  }, [changeMonth, blocked])

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setMonthAvg(getAvgPrice(data, detail))
    }
  }, [data])

  useMemo(() => {
    if (new Date(dates.checkin) > new Date(dates.checkout)) {
      return setDates({
        checkin: dates.checkout,
        checkout: ''
      })
    }
    var flag = 0
    if (data.data) {
      const arr = data.data.map((i) => {
        if (i.blocked && dates.checkin < i.time && dates.checkout > i.time) {
          flag = 1
        }
        if (
          i.time &&
          (i.time.toDateString() ===
            (dates.checkin &&
              !isNaN(new Date(dates.checkin)) &&
              dates.checkin.toDateString()) ||
            i.time.toDateString() ===
              (dates.checkout &&
                !isNaN(new Date(dates.checkout)) &&
                dates.checkout.toDateString()))
        ) {
          return { ...i, color: '#3564E2' }
        }
        if (dates.checkin < i.time && dates.checkout > i.time) {
          return { ...i, color: '#EDF2FF' }
        }
        return { ...i, color: '' }
      })
      if (flag && !spl) {
        return setDates({
          ...dates,
          checkout: ''
        })
      }
      setData({ month: data.month, data: arr })
    }
  }, [dates])
  const MonthWrapper = styled.div`
    width: fit-content;
    h3 {
      text-align: center;
    }
  `
  const MonthTitle = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    font-family: Inter;
    justify-content: center;
  `
  const MonthContainer = styled.div`
    grid-template-columns: repeat(7, ${mob ? '40px' : '48px'});
    display: grid;
    .min-alert {
      :before {
        content: 'Min 2 Nights';
        position: absolute;
        top: -5px;
        font-size: 7.5px;
        background: black;
      }
    }
    .inbtw-dates {
      background: #edf2ff;
      color: black !important;
    }
    .active-date {
      background: #2d66a1 !important;
      color: white !important;
      text-decoration: none !important;
      &:hover {
        background: #2d66a1;
        color: white !important;
      }
    }
  `
  const DayContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    font-family: Inter;
    justify-content: center;
    border-radius: 4px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #333333;
    height: ${mob ? '40px' : '48px'};
    cursor: pointer;
    border: 1px solid white;
    transition: 0.3s ease-in-out;
    flex-direction: column;
    .day-date {
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 15px;
    }
    .day-price {
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 8px;
    }
    &:hover {
      background: #f2f2f2;
      border: 1px solid #f2f2f2;
    }
  `
  const WeekDaysWrapper = styled.div`
    grid-template-columns: repeat(7, ${mob ? '40px' : '48px'});
    display: grid;
    div {
      text-align: center;
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 150%;
      color: #666666;
    }
  `
  const H3 = styled.div`
    display: block;
    text-align: center;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  `
  useEffect(() => {
    if (data.data) {
      let flag = 0
      const arr = data.data.map((i) => {
        if (i.blocked && i.time && dates.checkout) {
          flag = 1
        }
        if (
          i.time &&
          (i.time.toDateString() ===
            (dates.checkin &&
              !isNaN(new Date(dates.checkin)) &&
              dates.checkin.toDateString()) ||
            i.time.toDateString() ===
              (dates.checkout &&
                isNaN(new Date(dates.checkout)) &&
                dates.checkout.toDateString()))
        ) {
          return { ...i, color: '#3564E2' }
        }
        if (i.time && (i.time === dates.checkin || i.time === dates.checkout)) {
          return { ...i, color: '#3564E2' }
        }
        if (dates.checkin < i.time && dates.checkout > i.time) {
          return { ...i, color: '#EDF2FF' }
        }
        return { ...i, color: '' }
      })
      // console.log(flag)
      // if (flag) {
      //   return setDates({
      //     ...dates,
      //     checkout: ''
      //   })
      // }
      setData({ month: data.month, data: arr })
    }
  }, [])
  return (
    <MonthWrapper>
      <MonthTitle>
        {data.data && (
          <H3>
            {data.month}
            &nbsp;{year}
            {/* {data.data[data.length - 1].time.getFullYear()} */}
          </H3>
        )}
      </MonthTitle>
      <WeekDaysWrapper>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </WeekDaysWrapper>
      <MonthContainer>
        {data.data &&
          data.data.map((ele, indx) => {
            return (
              <DayContainer
                className={`${getClass(ele, dates)}  ${
                  spl &&
                  format(dates.checkin, 'YYYY-MM-DD') ===
                    format(ele.time, 'YYYY-MM-DD')
                    ? ' min-alert'
                    : ''
                }
                `}
                style={{
                  background: ele.color,
                  color: ele.color
                    ? ele.color === '#EDF2FF'
                      ? 'black'
                      : 'white'
                    : !ele.active
                    ? 'lightgray'
                    : 'black',
                  textDecoration: ele.blocked && 'line-through'
                }}
                onClick={() => {
                  if (ele.active) {
                    if (dates.checkin < dates.checkout) {
                      return setDates({
                        checkin: '',
                        checkout: ''
                      })
                    }
                    if (
                      dates.checkout === ele.time ||
                      dates.checkin === ele.time
                    ) {
                      return setDates({
                        checkin: '',
                        checkout: ''
                      })
                    }
                    if (dates.checkin === '') {
                      setDates({
                        ...dates,
                        checkin: ele.time
                      })
                    } else if (dates.checkin !== '') {
                      setDates({
                        ...dates,
                        checkout: ele.time
                      })
                    }
                  }
                }}
                key={`${ele.date}-${ele.day}-${indx}`}
              >
                <div className='day-date'>{ele.date}</div>
                {ele.active &&
                  !ele.blocked &&
                  detail[format(ele.time, 'YYYY-MM-DD')]?.price && (
                    <div
                      className='day-price'
                      style={{
                        color:
                          detail[format(ele.time, 'YYYY-MM-DD')].price <
                            (monthAvg * 80) / 100 && '#00c700'
                      }}
                    >
                      ₹{' '}
                      {currenyShortner(
                        detail[format(ele.time, 'YYYY-MM-DD')].price
                      )}
                    </div>
                  )}
              </DayContainer>
            )
          })}
      </MonthContainer>
    </MonthWrapper>
  )
}

const currenyShortner = (m) => {
  if (m.length >= 4) {
    return `${(parseInt(m) / 1000).toFixed(1)}k`
  } else {
    return m
  }
}

const getClass = (i, dates) => {
  if (
    i.time &&
    (i.time.toDateString() ===
      (dates.checkin &&
        !isNaN(new Date(dates.checkin)) &&
        dates.checkin.toDateString()) ||
      i.time.toDateString() ===
        (dates.checkout &&
          !isNaN(new Date(dates.checkout)) &&
          dates.checkout.toDateString()))
  ) {
    return 'active-date'
  }
  if (i.time && (i.time === dates.checkin || i.time === dates.checkout)) {
    return 'active-date'
  }
  if (dates.checkin < i.time && dates.checkout > i.time) {
    return 'inbtw-dates'
  }
  return ''
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function getDaysInMonth(month, year, blocked, sameDay, normal) {
  var date = new Date(year, month, 1)
  var days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  const arr = days.map((ele) => {
    if (blocked.includes(format(ele, 'YYYY-MM-DD'))) {
      return {
        active: false,
        blocked: true,
        day: new Date(ele).getDay(),
        date: new Date(ele).getDate(),
        time: new Date(ele)
      }
    }
    if (
      sameDay &&
      format(new Date(), 'YYYY-MM-DD') === format(ele, 'YYYY-MM-DD')
    ) {
      return {
        active: true,
        day: new Date(ele).getDay(),
        date: new Date(ele).getDate(),
        time: new Date(ele)
      }
    }
    if (new Date() > ele) {
      if (normal) {
        return {
          active: true,
          day: new Date(ele).getDay(),
          date: new Date(ele).getDate(),
          time: new Date(ele)
        }
      }
      return {
        active: false,
        day: new Date(ele).getDay(),
        date: new Date(ele).getDate(),
        time: new Date(ele)
      }
    }
    return {
      active: true,
      day: new Date(ele).getDay(),
      date: new Date(ele).getDate(),
      time: new Date(ele)
    }
  })
  const fillerArr = [0, 1, 2, 3, 4, 5, 6]
  const fillArr = [...fillerArr.slice(0, arr[0].time.getDay()), ...arr]

  return { month: monthNames[month], data: fillArr }
}

const getAvgPrice = (data, details) => {
  let sum = 0
  data.data.forEach((ele) => {
    if (
      ele.active &&
      !ele.blocked &&
      format(ele.time, 'YYYY-MM-DD') &&
      details[format(ele.time, 'YYYY-MM-DD')]?.price
    ) {
      sum = sum + parseInt(details[format(ele.time, 'YYYY-MM-DD')].price)
    }
  })
  return sum / 30
}
