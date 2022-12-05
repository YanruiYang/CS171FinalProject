/* * * * * * * * * * * * * *
*          ScatterVis          *
* * * * * * * * * * * * * */


class ScatterVis {

    // constructor method to initialize the Map object
    constructor(parentElement, imdbData){
        this.parentElement = parentElement;
        this.imdbData = imdbData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        let princessColors = {'Cinderella':'#99b8d8', 'Elsa':'#7498c7', 'Belle':'#fcee8f'}

        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        console.log(vis.imdbData)

        //x and y scale and axis
        vis.xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.imdbData, d => +d['Num Votes'] + 100000)])
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .domain([d3.max(vis.imdbData, d => +d['IMDb Rating']+1), d3.min(vis.imdbData, d => +d['IMDb Rating'] - 0.2)])
            .range([0, vis.height]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', `translate (30, ${vis.height-50})`);


        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr('transform', 'translate (30, -50)');

        let circle = vis.svg.selectAll('circle')
            .data(vis.imdbData)

        vis.circle = circle.enter().append('circle')
            .attr('r', d => +d.Gross/10)
            .attr('cx', d => vis.xScale(+d['Num Votes']) + 30)
            .attr('cy', d => vis.yScale(+d['IMDb Rating']) - 50)
            // .attr('transform', `translate (30, -50})`)
            .style('fill', function(d){
                if (d.Princess === "None"){
                    return '#D3D3D3'
                } else{
                    return '#FFC0CB'
                }
            })
            .style('opacity', function(d){
                if (d.Princess === "None"){
                    return 0.75
                } else {return 1}
            })

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'scatterTooltip')

        //todo: add text comparing your 'personal' princess with the one that is hovered over right now;
        //this should be on the bottom right of the graph - where it is pretty empty
        //maybe show more specific stats for the pricesses? comparison via radar plot?

        //todo: show your 'personal' princess with a cartoon face in the chart.


        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this;
        vis.svg.select('.y-axis')
            .call(vis.yAxis);
        vis.svg.select('.x-axis')
            .call(vis.xAxis);

        vis.circle
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'red')
                    .style('opacity', '1')
                let textblock = ''
                if (d.Princess === 'None'){
                    textblock = `<div><\div>`
                } else {
                    textblock = `<h3>${d.Princess}</h3>`
                }
                console.log(d.Princess)
                //todo: maybe include princess cartoon face?
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                             ${textblock}
                             <h4>Title: ${d.Title}</h4>
                             <h4>IMDb Rating: ${d['IMDb Rating']}</h4>
                             <h4>Votes: ${d['Num Votes']}</h4>
                         </div>`);
            })
            .on('mouseout', function(event, d){
            d3.select(this)
                .attr('stroke-width', 0)
                .style('opacity', function(d){
                    if (d.Princess === "None"){
                        return 0.2
                    } else {return 1}
                });
            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })

    }
}