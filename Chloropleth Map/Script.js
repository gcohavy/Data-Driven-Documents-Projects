const projectName = 'chloropleth-map';

var leg = 33;

var heading = d3.select('body')
  .style('text-align', 'center')
  .style('display', 'flex')
  .style('justify-content', 'center')
  .append('heading')
  .style('margin', '3em')

heading.append('h1')
  .attr('id', 'title')
  .style('font-size', '2em')
  .style('text-decoration', 'underline')
  .text('US Education Percentage by County')
  
heading.append('h3')
  .attr('id', 'description')
  .attr('dy', '1em')
  .style('color', '#123452')
  .text('This is a description that I\'m too lazy to write')

var svg = d3.select('body')
  .append('section')
  .attr('id', 'graph')
  .append('svg')
  .attr('width', 1000)
  .attr('height', 600)
  .style('background-color', '#ccc');

var tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)
  .style('background-color', '#b0c4de')
  .style('padding', '1em')
  .style('border-radius', '8px')
  .style('pointer-events', 'none')

var legend = d3.select('body')
  .append('svg')
  .attr('id', 'legend')
  .attr('width', 300)
  .attr('height', 100)
  .style('background-color', '#b0c4de')
  .style('padding', '1em')
  .style('border-radius', '8px')
  .style('pointer-events', 'none')
  .style('position', 'absolute')
  .style('left', '4em')
  .style('top', 450)

var color = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
    .range(d3.schemeGreens[9]);

d3.queue()
  .defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
  .defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
  .await(rendering);

function rendering (error, loc, edu) {
  if(error) throw error;
  
  svg.append('g')
    .selectAll('path')
    .data(topojson.feature(loc, loc.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('data-fips', (d,i) => d.id)
    .attr('data-education', (d)=> {
        var result = edu.filter( (item) => item.fips == d.id );
        if(result[0]){
          return result[0].bachelorsOrHigher
        }
        console.log('could find data for: ', d.id);
        return 0 })
    .attr('fill', (d) => {
        var result = edu.filter( (item) => item.fips == d.id );  
        if(result[0]){
          return color(result[0].bachelorsOrHigher)
        }
        return color(0)
    })
    .attr('d', d3.geoPath() )
    .on('mouseover', (d) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.8);
      tooltip.html( () =>{
        var result = edu.filter( (item) => item.fips == d.id );  
        if(result[0]) {
          return result[0].area_name + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher + '%'
        }
        return 0
      })
      .attr('data-education', () => {
        var result = edu.filter( (item) => item.fips == d.id );  
        return result[0] ? result[0].bachelorsOrHigher : 0
      })
      .style('position', 'absolute')
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY - 30) + 'px');
    })
    .on('mouseout', (d) => {
      tooltip.transition()
        .duration(400)
        .style('opacity', 0);
    });
}

legend.selectAll('rect')
  .data(d3.schemeGreens[9])
  .enter()
  .append('rect')
  .attr('height', leg)
  .attr('width', leg)
  .attr('x', (d,i) => i*leg)
  .attr('fill', (d) => d)
