import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BubbleData } from '../types';

interface BubbleNode extends BubbleData, d3.SimulationNodeDatum {}

interface BubbleMapProps {
  data: BubbleData[];
  onBubbleClick?: (bubble: BubbleData) => void;
  width?: number;
  height?: number;
}

const BubbleMap: React.FC<BubbleMapProps> = ({
  data,
  onBubbleClick,
  width = 1000,
  height = 700
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Create color scale based on clusters
    const clusterTypes = [...new Set(data.map(d => d.cluster || 'unknown'))];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(clusterTypes)
      .range(d3.schemeCategory10);

    // Create simulation
    const bubbleNodes: BubbleNode[] = data.map(d => ({ ...d }));
    const simulation = d3.forceSimulation<BubbleNode>(bubbleNodes)
      .force('charge', d3.forceManyBody<BubbleNode>().strength(-50))
      .force('center', d3.forceCenter<BubbleNode>(width / 2, height / 2))
      .force('collision', d3.forceCollide<BubbleNode>().radius((d: BubbleNode) => {
        // Scale bubble size based on percentage
        const baseRadius = 5;
        const maxRadius = 80;
        const minPercentage = Math.min(...data.map(b => b.percentage));
        const maxPercentage = Math.max(...data.map(b => b.percentage));
        
        if (maxPercentage === minPercentage) return 20;
        
        const scale = (d.percentage - minPercentage) / (maxPercentage - minPercentage);
        return baseRadius + scale * (maxRadius - baseRadius);
      }))
      .force('x', d3.forceX<BubbleNode>(width / 2).strength(0.05))
      .force('y', d3.forceY<BubbleNode>(height / 2).strength(0.05));

    // Create bubbles
    const bubbles = g.selectAll('circle')
      .data(bubbleNodes)
      .enter()
      .append('circle')
      .attr('r', (d) => {
        const baseRadius = 5;
        const maxRadius = 80;
        const minPercentage = Math.min(...data.map(b => b.percentage));
        const maxPercentage = Math.max(...data.map(b => b.percentage));
        
        if (maxPercentage === minPercentage) return 20;
        
        const scale = (d.percentage - minPercentage) / (maxPercentage - minPercentage);
        return baseRadius + scale * (maxRadius - baseRadius);
      })
      .attr('fill', d => colorScale(d.cluster || 'unknown'))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke-width', 3);
        
        // Build safe tooltip content
        const parts = [
          `<strong>${(d.label || 'Holder').replace(/[<>]/g, '')}</strong>`,
          `Address: ${d.address.substring(0, 10).replace(/[<>]/g, '')}...`,
          `Balance: ${d.balance.toLocaleString()}`,
          `Percentage: ${d.percentage.toFixed(4)}%`
        ];
        
        if (d.clusterName) {
          parts.push(`Cluster: ${d.clusterName.replace(/[<>]/g, '')}`);
        }
        
        const content = parts.join('<br/>');
        
        setTooltip({
          visible: true,
          x: event.pageX + 10,
          y: event.pageY - 10,
          content
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.7)
          .attr('stroke-width', 2);
        
        setTooltip({ visible: false, x: 0, y: 0, content: '' });
      })
      .on('click', (_event, d) => {
        if (onBubbleClick) {
          onBubbleClick(d);
        }
      });

    // Add labels for large bubbles
    const labels = g.selectAll('text')
      .data(bubbleNodes.filter(d => d.percentage > 1))
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text(d => d.label || '');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      bubbles
        .attr('cx', (d: BubbleNode) => d.x || 0)
        .attr('cy', (d: BubbleNode) => d.y || 0);
      
      labels
        .attr('x', (d: BubbleNode) => d.x || 0)
        .attr('y', (d: BubbleNode) => d.y || 0);
    });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, width, height, onBubbleClick]);

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ddd', background: '#f9f9f9' }}
      />
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            pointerEvents: 'none',
            fontSize: '12px',
            zIndex: 1000,
            maxWidth: '300px'
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};

export default BubbleMap;
