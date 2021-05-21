import { NgModule } from '@angular/core';
import { ObjToArrayPipe } from './obj-to-array/obj-to-array';
import { SumPipe } from './sum-of-items/sum-of-items';
import {RemovewhitespacesPipe} from './remove-white-space/remove-white-space'
@NgModule({
	declarations: [ ObjToArrayPipe, SumPipe,RemovewhitespacesPipe ],
	imports: [],
	exports: [ ObjToArrayPipe, SumPipe, RemovewhitespacesPipe ]
})
export class PipesModule {}
