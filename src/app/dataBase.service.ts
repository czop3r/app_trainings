import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Exercise } from "./training/exercise.model";

@Injectable()
export class DataBaseService {

    constructor(private http: HttpClient) {}

    getAvailableExercises() {
        return this.http.get<Exercise[]>('https://training-app-b20dd-default-rtdb.firebaseio.com/availableExercises.json');
    }

    postExercises(exercises: Exercise[]) {
        this.http.put<Exercise[]>('https://training-app-b20dd-default-rtdb.firebaseio.com/finishExercises.json', exercises)
        .subscribe(response => console.log(response));
    }

    getExercises() {
        return this.http.get<Exercise[]>('https://training-app-b20dd-default-rtdb.firebaseio.com/finishExercises.json');
    }
}