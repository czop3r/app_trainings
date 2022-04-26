import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  private sub$ = new Subscription();

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.sub$.add(
      this.trainingService.fetchAvailableExercises().subscribe(
        (ex: Exercise[]) => {
          this.exercises = ex;
        }
      ) 
    );
  }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise)
  }
}
