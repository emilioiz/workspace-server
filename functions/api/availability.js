const { db } = require('../util/firebase')
const axios = require('axios')
const dayjs = require('dayjs')
require('dotenv').config()

const acuity_user_id = process.env.ACUITY_USER_ID
const acuity_api_key = process.env.ACUITY_API_KEY
const acuityBaseURL = 'https://acuityscheduling.com/api/v1'
const auth = {
  username: acuity_user_id,
  password: acuity_api_key
}

//route: /availability
//required: q1
//optional: q2, q3
//q1 = date, q2 = appointmentTypeID ,q3 = calendarID
//if no optional params, returns all active lawyers aviability
//Example - http://localhost:5001/workspace-247959/us-central1/api/availability?date=2021-01-01&appointmentTypeID=18628316&calendarID=4783565
exports.getAvailability = async (req, res) => {
  const q1 = req.query.date
  const q2 = parseInt(req.query.appointmentTypeID) || false
  const q3 = req.query.calendarID || false
  const reqParams = []

  let reqType = 'one'

  if (q2 && q3) {
    reqParams.push({
      date: q1,
      appointmentTypeID: q2,
      calendarID: q3,
      searchQuery: `date=${q1}&appointmentTypeID=${q2}&calendarID=${q3}`
    })
  } else {
    reqType = 'all'
    const lawyerRef = db.collection('lawyers').where('isActive', '==', true)

    await lawyerRef
      .get()
      .then(r => {
        r.forEach(doc => {
          const data = doc.data()
          reqParams.push({
            date: q1,
            appointmentTypeID: data.appointmentTypeID,
            calendarID: data.calendarId,
            searchQuery: `date=${q1}&appointmentTypeID=${data.appointmentTypeID}&calendarID=${data.calendarId}`
          })
        })
        return null
      })
      .catch(err => console.log(err.code, ' - ', err.message))
  }

  const getAvailabilityTimes = p => {
    return axios
      .get(`${acuityBaseURL}/availability/times?${p.searchQuery}`, {
        auth: auth
      })
      .then(async r => {
        const res = r.data.map(r => {
          return {
            timeBlock: dayjs(r.time).format('HH'),
            time: r.time
          }
        })
        return res
      })
      .catch(err => console.log(err.message))
  }

  const getAppointmentTypes = p => {
    return axios
      .get(`${acuityBaseURL}/appointment-types`, { auth: auth })
      .then(r => {
        const obj = r.data.find(r => r.id === p.appointmentTypeID)
        const resObj = {
          appointmentTypeID: obj.id,
          name: obj.name,
          duration: obj.duration,
          description: obj.description
        }
        return resObj
      })
      .catch(err => console.log(err.message))
  }

  const collapseAcuityData = async d => {
    const data = await d

    const dataArr = []
    const allTimeBlocks = []
    await data.map(x =>
      x.map(y => [dataArr.push(y), allTimeBlocks.push(y.timeBlock)])
    )

    const uniqueTimeBlocks = [...new Set(allTimeBlocks)]

    const collapsedBlocks = uniqueTimeBlocks.map(x => {
      const partData = dataArr.filter(y => y.timeBlock === x)
      return { timeBlock: x, timeBlockValues: partData }
    })

    return collapsedBlocks
  }

  const acuityData = Promise.all(
    reqParams.map(async r => {
      const times = await getAvailabilityTimes(r)
      const timesType = await getAppointmentTypes(r)

      if (reqType === 'all') {
        const allTimeBlocks = []
        await times.map(x => allTimeBlocks.push(x.timeBlock))

        const uniqueTimeBlocks = [...new Set(allTimeBlocks)]

        const collapsedTimes = uniqueTimeBlocks.map(x => {
          const res = { timeBlock: x, times: [] }
          const partData = times.filter(y => y.timeBlock === x)
          partData.map(y => res.times.push(y.time))
          return res
        })

        return collapsedTimes.map(x => {
          return { calendarID: r.calendarID, ...timesType, ...x }
        })
      } else {
        const timesParsed = times.map(r => r.time)
        return {
          date: r.date,
          calendarID: r.calendarID,
          ...timesType,
          times: timesParsed
        }
      }
    })
  ).catch(err => console.log(err.message))

  if (reqType === 'all') {
    const collapsedAcuityData = await collapseAcuityData(acuityData)

    const response = {
      date: q1,
      dateValues: collapsedAcuityData
    }

    return res.json(response)
  } else {
    const response = await acuityData
    return res.json(...response)
  }
}
