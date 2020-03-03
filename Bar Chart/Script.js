const projectName = 'bar-chart';

var width = 800,
    height = 400

var svgContainer =  d3.select('.graph')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

var tooltip = d3.select('.graph')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', (err, data) => {
  
  var displayDate = data.data.map( (item) => {
    var quarter;
    var temp = item[0].substring(5, 7);
    switch(temp){
      case '01':
        quarter = 'Q1';
        break;
      case '04':
        quarter = 'Q2';
        break;
      case '07':
        quarter = 'Q3';
        break;
      case '10':
        quarter = 'Q4';
        break;
      default:
        quarter='';
    }
    return item[0].substring(0, 4) + ' ' + quarter
  });
  
  var graphDate = data.data.map( (item) => new Date(item[0]));

  var xMax = new Date(d3.max(graphDate));
  xMax.setMonth(xMax.getMonth() + 3);
  
  var xScale = d3.scaleTime()
    .domain([d3.min(graphDate), xMax])
    .range([0, width + 60]);
  
  var gdpValue = data.data.map( (item) => {
    return item[1]
  });
  
  var scaledGDP = [];
  
  var gdpMin = d3.min(gdpValue);
  var gdpMax = d3.max(gdpValue);
  
  var linearScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([0, height]);
  
  scaledGDP = gdpValue.map( (item) => linearScale(item));
  
  var xAxis = d3.axisBottom().scale(xScale);
  
  var xAxisGroup = svgContainer.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(30, 400)');
  
  var yAxis = d3.axisLeft(d3.scaleLinear()
    .domain([0, (gdpMax + 120)/1000])
    .range([height, 0])) ;
  
  var yAxisGroup = svgContainer.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(30)')
    
  d3.select('svg').selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => xScale(graphDate[i]))
    .attr('y', (d, i) => height - d)
    .attr('width', width/200)
    .attr('height', (d) => d)
    .attr('transform', 'translate(30, 0)')
    .attr('data-date', (d, i) => data.data[i][0])
    .attr('data-gdp', (d, i) => data.data[i][1])
    .style('fill', '#396FAF') 
    .on('mouseover', (d, i) => {
      d3.select(d3.event.target).style('fill', '#324447')
      .style('opacity', 0.5)
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(displayDate[i] + '<br>$' + Math.floor(gdpValue[i])/1000 + ' Trillion')
        .attr('data-date', data.data[i][0])
        .style('left', (i * 3 + 270)+ 'px')
        .style('top', height - 100 + 'px');
    })
    .on('mouseout', (d, i) => {
      d3.select(d3.event.target)
        .style('fill', '#396FAF')
        .style('opacity', 1)
      tooltip.transition()
        .duration(0)
        .style('opacity', 0)
    })

  svgContainer.append('text')
    .text('Gross Domestic Product (in trillions)')
    .attr('x', -300)
    .attr('y', 50)
    .attr('transform', 'rotate(-90)')
});
