import React, { useEffect, useRef } from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';

export default function GunDeathsBarGraph(props) {
  const d3Container = useRef(null);
  const [svg, height, width, tTip] = useSVGCanvas(d3Container);
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  useEffect(() => {
    if (svg === undefined || props.data === undefined) {
      return;
    }

    // Prepare data
    const data = props.data.states;

    // Extract state names and gun death counts
    const plotData = data.map((state) => ({
      state: state.state,
      gunDeaths: state.count,
    }));

    // Create scales for x and y axes
    const xScale = d3
      .scaleBand()
      .domain(plotData.map((d) => d.state))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(plotData, (d) => d.gunDeaths)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create bars for the bar graph
    svg.selectAll('.bar').remove();
    svg
      .selectAll('.bar')
      .data(plotData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.state))
      .attr('y', (d) => yScale(d.gunDeaths))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d.gunDeaths))
      .style('fill', 'darkblue')
      .on('mouseover', (e, d) => {
        const text = `${d.state}<br>Gun Deaths: ${d.gunDeaths}`;
        props.ToolTip.moveTTipEvent(tTip, e);
        tTip.html(text);
      })
      .on('mousemove', (e) => {
        props.ToolTip.moveTTipEvent(tTip, e);
      })
      .on('mouseout', (e) => {
        props.ToolTip.hideTTip(tTip);
      });

    // Draw x and y axes
    svg.selectAll('g').remove();
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${(height - margin.bottom)})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-45)') // Rotate x-axis labels for better readability

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5));

    // Add axis labels and chart title

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 6)
      .attr('text-anchor', 'middle')
      .text('State');
    
    
    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', 11)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Gun Deaths');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'middle')
      .text('Gun Deaths by State');

  }, [props.data, svg]);

  return (
    <div className={"d3-component"} style={{ 'height': '99%', 'width': '99%' }} ref={d3Container}></div>
  );
}
