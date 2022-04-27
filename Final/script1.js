let countyURL = 'https://dfulton2.github.io/Lab8/counties.json'
let educationURL = 'https://dfulton2.github.io/Lab8/Lab8edupercent.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {

    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if(percentage <= 15){
                    return 'tomato'
                }else if(percentage <= 30){
                    return 'orange'
                }else if(percentage <= 45){
                    return 'lightgreen'
                }else{
                    return 'limegreen'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', (countyDataItem)=> {
                tooltip.transition()
                    .style('visibility', 'visible')

                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })

                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' +
                    county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

                tooltip.attr('data-education', county['bachelorsOrHigher'] )
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}



d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)

const minDate = new Date('1970-01-1'),
  maxDate = new Date('2019-01-1'),
  interval = maxDate.getFullYear() - minDate.getFullYear() + 1,
  startYear = minDate.getFullYear();
let dataMonths = [];
for (let year = 0; year < interval; year++) {
for (let month = 0; month < 12; month++) {
dataMonths.push(new Date(startYear + year, month, 1));
}
}

const sliderTime = d3
.sliderBottom()
.min(d3.min(dataMonths))
.max(d3.max(dataMonths))
.marks(dataMonths)
.width(500)
.tickFormat(d3.timeFormat('%b %Y'))
.tickValues(dataMonths.filter(d => d.getMonth === 0))
.default(minDate);

const gTime = d3
.select('div#slider-time')
.append('svg')
.attr('width', 500)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(30,30)');

gTime.call(sliderTime);
