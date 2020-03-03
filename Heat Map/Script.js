const projectName = "d3-heat-map";

var width = 1000,
  height = 500;

margin = {
  top: 10,
  left: 70,
  right: 30,
  bottom: 120
};

var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var colors = {
  0: '#00f', 1: '#10e', 2: '#20d', 3: '#30c', 4: '#40b', 5: '#50a', 6: '#709', 7: '#808', 8: '#907', 9: '#a06', 10: '#b05', 11: '#c04', 12: '#d03', 13: '#e02', 14: '#f01'
}

var tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var heading = d3.select('body')
  .append('section')

var svg = d3
  .select("body")
  .append("svg")
  .attr("id", "graph")
  .attr("width", width)
  .attr("height", height);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  (error, data) => {
    
    var years = data.monthlyVariance.map(item =>(item.year));
    
    var yScale = d3.scaleLinear()
      .domain([1,12])
      .range([margin.top, height - margin.bottom]);

    var yAxis = d3.axisLeft()
      .scale(yScale)
      .tickFormat((d,i)=>months[i+1]);

    svg.append("g")
      .attr("transform", "translate(" + (margin.left + 3) + "," + 17 + ")")
      .call(yAxis)
      .attr("id", "y-axis");

    var xScale = d3.scaleLinear()
      .domain([new Date(d3.min(years)), new Date(d3.max(years))])
      .range([margin.left, width - margin.right]);

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(d3.format('d'));

    svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(" + 4 + "," + (height - margin.bottom + ((height - margin.top - margin.bottom) / 12)) + ")")
      .attr("id", "x-axis");

    heading.append("heading")
      .append('h1')
      .attr("y", 50)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("id", "title")
      .text("Monthly Global Land Temperature")
    heading.append("h3")
      .attr("y", 50)
      .attr("id", "description")
      .text("1753 to 2015 - Base temperature: 8.66 degrees");

    svg
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => d.variance + 8.66)
      .attr("width", width/data.monthlyVariance.length + 4)
      .attr("height", (height - margin.top - margin.bottom) / 12)
      .attr("x", (d, i) => xScale(d.year))
      .attr("y", d => yScale(d.month))
      .style("fill", d => colors[Math.floor(d.variance+8.66)])
      .on('mouseover', (d,i) => {
        d3.select(d3.event.target)
          .style('fill', '#fff');
        tooltip.transition()
          .duration(300)
          .style('opacity', 0.9)
        tooltip.style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px')
          .attr('data-year', d.year)
          .html('Date: '+ months[d.month] + 
                d.year + '<br />Temp: ' + 
                (Math.floor((data.baseTemperature +
                             d.variance)*100)/100) + 
                '&degC <br />' + d.variance + 
                '&deg from base temp'
               )
      })
      .on('mouseout', (d,i) => {
        d3.select(d3.event.target)
          .style('fill', d => colors[Math.floor(d.variance+8.66)]);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      });
    
    
  }
);

var keys = Object.keys(colors)

var legend = d3.select('svg')
  .append('svg')
  .attr('width', 400)
  .attr('height', 100)
  .attr('y', height - margin.bottom + margin.bottom/2)
  .attr('x', 50)
  .attr('id', 'legend');

legend.selectAll('rect')
  .data(keys).enter()
  .append('rect')
  .attr('x', (d,i)=> i*20)
  .attr('height', 20)
  .attr('width', 20)
  .style('border', '1px solid black')
  .style('fill', (d,i)=> colors[d])
legend.append('text')
  .attr('y', 40)
  .text('colder')
legend.append('text')
  .attr('y', 40)
  .attr('x', 260)
  .text('hotter')
