import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";

import { MaterialModule } from "../material.module";

const modulesArr: Array<any> = [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
]

@NgModule({
    imports: modulesArr,
    exports: modulesArr
})
export class SharedModule {}