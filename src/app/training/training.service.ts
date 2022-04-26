import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";

import { Exercise } from "./exercise.model";

const api_path: string = 'https://training-app-b20dd-default-rtdb.firebaseio.com/';

@Injectable({
    providedIn : 'root'
})
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesFinishChanged = new Subject<Exercise[]>();

    private availableExercises: Exercise[];
    private runningExercise: Exercise;
    private exercisesFinish: Exercise[] = [];

    constructor(private http: HttpClient) { }

    fetchAvailableExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>(api_path + 'availableExercises.json')
        .pipe(tap(
            (ex: Exercise[]) => {
                this.availableExercises = ex;
            }
        ));
    }

    startExercise(selectedId: string)  {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        console.log(this.runningExercise)
        this.exercisesFinish.push({ ...this.runningExercise, date: new Date(), state: 'completed' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercisesFinish.push({ 
            ...this.runningExercise, 
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(), 
            state: 'cancelled' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise(): Exercise {
        return { ...this.runningExercise };
    }

    fetchCopletedOrCancelledExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>(api_path + 'finishExercises.json')
        .pipe(tap(
            (ex: Exercise[]) => {
                this.exercisesFinish = ex;
                this.exercisesFinishChanged.next([...this.exercisesFinish]);
            }
        ));
    }
 
    addDataToDatabase(): Observable<Exercise[]> {
        return this.http.put<Exercise[]>(api_path + 'finishExercises.json', this.exercisesFinish)
        .pipe(
            tap((
                (ex: Exercise[]) => {
                    this.exercisesFinish = ex;
                    this.exercisesFinishChanged.next([...this.exercisesFinish]);
                }
            ))
        );
    }
}