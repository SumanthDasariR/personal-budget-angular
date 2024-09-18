import { Component } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient} from '@angular/common/http';
import {Chart, ArcElement, CategoryScale, LinearScale, registerables } from 'chart.js';
import { BudgetResponse} from '../models/budget.model';
Chart.register(ArcElement, CategoryScale, LinearScale, ...registerables);
@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  providers:[HttpClient]
})
export class HomepageComponent {
  constructor(private http:HttpClient){}
  public dataSource:{
    datasets: Array<{ data: number[]; backgroundColor: string[] }>;
    labels: string[];
  } = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "#6e7abb",
          "#95e982",
          "#b839d8",
        ],
      },
    ],
    labels: [],
  };
  ngOnInit():void{
    this.http.get<BudgetResponse>("http://localhost:3000/budget")
    .subscribe((res) => {
      for (const item of res.myBudget) {
        this.dataSource.datasets[0].data.push(item.budget);
        this.dataSource.labels.push(item.title);
      }
      this.createChart();
    });
  }
  createChart(): void {
    const ctx:any = document.getElementById('myChart');
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });
  }
}
