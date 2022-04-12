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
  private subscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.subscription = this.trainingService.fetchAvailableExercises().subscribe(
      (ex: Exercise[]) => {
        this.exercises = ex;
      }
    );
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExercise(form.value.exercise)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
