var width = 800,
    height = 400;

var circlesColor = '#54c'

var margin = {
  top: 60,
  right: 20,
  left: 50,
  bottom: 20
};

var tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('opacity', 0)

var svg =  d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr('class', 'graph');

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function(error, data) {

  var dates = data.map((item)=>item.Year);
  var seconds = data.map((item)=> item.Seconds);
  var times = data.map((item)=> item.Time)
  
  var parsedTime = times.map((d) => {
    return d3.timeParse('%M:%S')(d)
  })
  
  console.log(times);
  
  var xScale = d3.scaleLinear()
    .domain([d3.min(dates) - 1, d3.max(dates) + 1])
    .range([0, width - (margin.right+ margin.left)]);
  
  var xAxis = d3.axisBottom()
             .scale(xScale)
             .tickFormat(d3.format('d'));
  
  var yScale = d3.scaleLinear()
    .domain([d3.min(parsedTime), d3.max(parsedTime)])
    .range([height - margin.top,margin.top]);
  
  var yAxis = d3.axisLeft()
              .scale(yScale)
              .tickFormat(d3.timeFormat('%M:%S'));
  
  svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr('class', 'dot')
    .attr("r", 6)
    .attr("cx", (d)=>xScale(d.Year) + margin.left)
    .attr('data-xvalue', (d)=> d.Year)
    .attr('data-yvalue', (d)=> d.Time)
    .attr("cy", (d,i)=> yScale(d3.timeParse('%M:%S')(d.Time)))
    .style("fill", circlesColor) 
    .on('mouseover', (d, i)=> {
      d3.select(d3.event.target)
        .style('fill', 'blue');
      tooltip.style("opacity", .9)
        .attr("data-year", d.Year)
        .html(
          d.Name + ": " + d.Nationality + "<br/>"
            + "Year: "+ d.Year
            + "<br/>Time: "+ d.Time )
        .style("left", (d3.event.pageX + 30) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
  })
    .on('mouseout', (d,i) => {
      d3.select(d3.event.target)
        .style('fill', circlesColor);
      tooltip.style('opacity', 0);
    }) ;
  
  svg.append('g')
    .attr('transform', 'translate('+ margin.left + ',' + (height - margin.top) + ')')
    .call(xAxis)
    .attr('id', 'x-axis')
  
  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ')')
    .call(yAxis)
    .attr('id', 'y-axis');
  
  svg.append('text')
    .attr('id', 'title')
    .attr('x', width/2)
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .style('font-size', 2 + 'em')
    .text('Top Cycling Times');
  
  svg.append('text')
    .attr('x', width/2)
    .attr('y', height-margin.top/3)
    .attr('text-anchor', 'middle')
    .text('Year of Competition')
  
  svg.append('circle')
    .attr('cx', width - margin.left)
    .attr('cy', height/2)
    .attr('r', 12)
    .attr('id', 'legend')
    .style('fill', circlesColor + '025')
  
  svg.append('text')
    .attr('x', width - margin.left - 17)
    .attr('y', height/2 + 5)
    .attr('text-anchor', 'end')
    .text('Cyclists who didn\'t dope up')
  
  svg.append('circle')
    .attr('cx', width - margin.left)
    .attr('cy', height/2 + 24)
    .attr('r', 12)
    .attr('id', 'legend')
    .style('fill', circlesColor)
  
  svg.append('text')
    .attr('x', width - margin.left - 17)
    .attr('y', height/2 + 29)
    .attr('text-anchor', 'end')
    .text('Cyclists who probably doped')  
  }
);
