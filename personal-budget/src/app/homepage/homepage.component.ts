import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { Chart, ArcElement, CategoryScale, LinearScale, registerables } from 'chart.js';
import * as d3 from 'd3';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { DataService } from '../data.service';
Chart.register(ArcElement, CategoryScale, LinearScale, ...registerables);

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent, BreadcrumbsComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  constructor(private dataService: DataService) {}

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [] as string[],
      },
    ],
    labels: [] as string[],
  };

  private budgetData: any[] = [];
  private margin = 60;
  private width = 400;
  private height = 400;
  private outerRadius = Math.min(this.width, this.height) / 2 - this.margin;
  private innerRadius = this.outerRadius * 0.6;
  private labelOffset = 40;

  ngOnInit(): void {
    this.dataService.fetchBudgetData();

    this.dataService.getBudgetData().subscribe((res) => {
      if (res) {
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        res.myBudget.forEach((item, index) => {
          this.dataSource.datasets[0].data.push(item.budget);
          this.dataSource.labels.push(item.title);
          this.dataSource.datasets[0].backgroundColor.push(colorScale(String(index)));
          this.budgetData.push(item);
        });

        this.createChart();
        this.createD3Chart(res.myBudget);
      }
    });
  }

  ngAfterViewInit(): void {}

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });
  }

  createD3Chart(budgetData: { title: string; budget: number }[]): void {
    const width = 600;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal<string>().domain(budgetData.map(d => d.title)).range(d3.schemeCategory10);

    const arc = d3.arc<d3.PieArcDatum<{ title: string, budget: number }>>().innerRadius(radius * 0.5).outerRadius(radius * 0.8);
    const outerArc = d3.arc<d3.PieArcDatum<{ title: string, budget: number }>>().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    const pie = d3.pie<{ title: string, budget: number }>().sort(null).value(d => d.budget);

    const svg = d3.select('#d3Chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const dataReady = pie(budgetData);

    // Draw pie slices
    svg.selectAll('allSlices')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => color(d.data.title))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Draw connecting polylines
    svg.selectAll('allPolylines')
      .data(dataReady)
      .enter()
      .append('polyline')
      .attr('points', (d) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        posC[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [posA, posB, posC].map(p => p.join(',')).join(' ');
      });

    // Draw text labels with budget amount
    svg.selectAll('allLabels')
      .data(dataReady)
      .enter()
      .append('text')
      .text(d => `${d.data.title} (${d.data.budget})`)  // Title and budget amount
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.99 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d) => {
        return this.midAngle(d) < Math.PI ? 'start' : 'end';
      });
  }

  private midAngle(d: { startAngle: number; endAngle: number }): number {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
}
