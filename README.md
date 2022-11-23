# react-responsive-calendar-picker

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-dater.svg)](https://www.npmjs.com/package/react-dater) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash

npm install --save react-responsive-calendar-picker

```

<img  src='https://i.ibb.co/QDKRjxM/image.png'  height='300'  width='100%'  />

## Usage

```jsx

import  React, { Component } from  'react'



import { DatePicker } from  'react-responsive-calendar-picker'

import  'react-responsive-calendar-picker/dist/index.css'




export  default  const  App = () => {

const [dates, setDates] = useState({

checkin:  new  Date('2022-03-28'),

checkout:  new  Date('2022-04-28')

})

const [open, setOpen] = useState(false)

return (

<>

<DatePicker

dates={dates}
setDates={setDates}
open={open}
setOpen={setOpen}
mobile={window.innerWidth>800?false:true}

>

<button  onClick={() =>  setOpen(!open)}>

{dates.checkin && dates.checkin.toDateString()} |{' '}

{dates.checkout && dates.checkout.toDateString()}

</button>

</DatePicker>

</>

)

}

```

## License

MIT © [bdbose](https://github.com/bdbose)
