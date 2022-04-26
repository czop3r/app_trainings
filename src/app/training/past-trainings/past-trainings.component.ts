import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  exercises = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = ['name', 'date', 'calories', 'duration', 'state'];
  private sub$ = new Subscription();

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.sub$.add(
      this.trainingService.exercisesFinishChanged.subscribe(
        (ex: Exercise[]) => {
          this.exercises.data = ex;
        }
      )
    );
    this.sub$.add(
      this.trainingService.fetchCopletedOrCancelledExercises().subscribe()
    );
  }

  ngAfterViewInit() {
    this.exercises.sort = this.sort;
    this.exercises.paginator = this.paginator;
  }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe()
    }
  }

  doFilter(filterValue: string) {
    this.exercises.filter = filterValue.trim().toLocaleLowerCase();
  }
}
