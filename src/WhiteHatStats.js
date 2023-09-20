import React, { useEffect, useRef, useMemo } from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';

export default function GunDeathsBarGraph(props) {
  const d3Container = useRef(null);
  const [svg, height, width, tTip] = useSVGCanvas(d3Container);
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };

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
      maleDeaths: state.male_count,
      femaleDeaths: state.count - state.male_count,
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

    // Create bars for the bar graph (Male Deaths)
    svg.selectAll('.bar-male').remove();
    svg
      .selectAll('.bar-male')
      .data(plotData)
      .enter()
      .append('rect')
      .attr('class', 'bar-male')
      .attr('x', (d) => xScale(d.state))
      .attr('y', (d) => yScale(d.maleDeaths))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', (d) => height - margin.bottom - yScale(d.maleDeaths))
      .style('fill', 'Darkblue')
      .on('mouseover', (e, d) => {
        const text = `${d.state}<br>Male Gun Deaths: ${d.maleDeaths}`;
        props.ToolTip.moveTTipEvent(tTip, e);
        tTip.html(text);
      })
      .on('mousemove', (e) => {
        props.ToolTip.moveTTipEvent(tTip, e);
      })
      .on('mouseout', (e) => {
        props.ToolTip.hideTTip(tTip);
      });

    // Create bars for the bar graph (Female Deaths)
    svg.selectAll('.bar-female').remove();
    svg
      .selectAll('.bar-female')
      .data(plotData)
      .enter()
      .append('rect')
      .attr('class', 'bar-female')
      .attr('x', (d) => xScale(d.state) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.femaleDeaths))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', (d) => height - margin.bottom - yScale(d.femaleDeaths))
      .style('fill', 'Red')
      .on('mouseover', (e, d) => {
        const text = `${d.state}<br>Female Gun Deaths: ${d.femaleDeaths}`;
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
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-45)'); // Rotate x-axis labels for better readability

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5));

    // Add axis labels and chart title

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.top + 10)
      .attr('text-anchor', 'middle')
      .text('State');

    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', 20 - margin.left)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Gun Deaths');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'middle')
      .text('Gun Deaths by State (Separated by Gender)');

  }, [props.data, svg]);

  return (
    <div className={"d3-component"} style={{ 'height': '99%', 'width': '99%' }} ref={d3Container}></div>
  );
}
