import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining: boolean = false;
  private subs$ = new Subscription();

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.subs$.add(
      this.trainingService.exerciseChanged.subscribe(
        exercise => {
          if(exercise) {
            this.ongoingTraining = true;
          } else {
            this.ongoingTraining = false;
          }
        }
      ) 
    );
  }

  ngOnDestroy() {
    if(this.subs$) {
      this.subs$.unsubscribe();
    }
  }

}
