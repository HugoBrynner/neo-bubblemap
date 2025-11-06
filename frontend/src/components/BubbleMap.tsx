import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TokenHolder } from '../types';

interface BubbleMapProps {
  holders: TokenHolder[];
  onBubbleClick?: (holder: TokenHolder) => void;
}

const BubbleMap: React.FC<BubbleMapProps> = ({ holders, onBubbleClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || holders.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create container group with zoom support
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare data for D3 pack layout
    interface BubbleNode {
      name: string;
      value?: number;
      holder?: TokenHolder;
      children?: BubbleNode[];
    }

    const hierarchyData: BubbleNode = {
      name: 'root',
      value: undefined,
      children: holders.map((holder) => ({
        name: holder.address,
        value: holder.balanceNumeric || parseFloat(holder.balance) || 1,
        holder,
      })),
    };

    // Create pack layout
    const pack = d3.pack<BubbleNode>()
      .size([width, height])
      .padding(3);

    const root = d3.hierarchy<BubbleNode>(hierarchyData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const packedRoot = pack(root) as any;

    // Color scale based on cluster type
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['whale', 'exchange', 'contract', 'normal'])
      .range(['#ff6b6b', '#4ecdc4', '#45b7d1', '#95e1d3']);

    // Create bubbles
    const nodes = g.selectAll('g')
      .data(packedRoot.leaves())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (_event: any, d: any) => {
        if (onBubbleClick && d.data.holder) {
          onBubbleClick(d.data.holder);
        }
      });

    // Add circles
    nodes.append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', (d: any) => {
        const clusterType = d.data.holder?.cluster?.split('-')[0] || 'normal';
        return colorScale(clusterType);
      })
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.7)
          .attr('stroke-width', 2);
      });

    // Add labels for larger bubbles
    nodes.filter((d: any) => d.r > 30)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .style('font-size', (d: any) => `${Math.min(d.r / 3, 14)}px`)
      .style('fill', '#fff')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text((d: any) => {
        const address = d.data.holder?.address || '';
        return address.substring(0, 6) + '...';
      });

    // Add percentage labels
    nodes.filter((d: any) => d.r > 30)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', (d: any) => `${Math.min(d.r / 4, 12)}px`)
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text((d: any) => `${d.data.holder?.percentage.toFixed(2)}%`);

  }, [holders, onBubbleClick]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    />
  );
};

export default BubbleMap;
