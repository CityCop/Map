
import { crimeometerAPI } from '../services/crimeometerAPI'

const ObtainData = async (page, startDate, endDate, miles, lat, lon) => {
	try {
		let moment = require("moment");
    if ("default" in moment){
      moment = moment["default"];
		}
		startDate = moment(startDate).format("YYYY-MM-DD")
		endDate = moment(endDate).format("YYYY-MM-DD")
		//console.log(miles)
		const res = await crimeometerAPI.get('/v1/incidents/raw-data',{
		params: {
				lat,
				lon,
				distance: `${miles}mi`,
				datetime_ini: startDate+'T00:00:00.000Z',
				datetime_end: endDate+'T00:00:00.000Z',
				page_size:9000,
		}
		})
		//console.log(res)
		return res.data
	} catch (err) {
		console.log(err)
		return "error"
	}
}
export { ObtainData };
