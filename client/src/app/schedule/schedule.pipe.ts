import { Pipe, PipeTransform } from '@angular/core';
import { ScheduleItem } from './schedule.model';

@Pipe({
	name: 'schedule'
})
export class SchedulePipe implements PipeTransform {

	public transform(value: ScheduleItem[], args?: any): ScheduleItem[] {
		const x = value.sort((a, b) => {
			const keyA = new Date(a.nextRunAt);
			const keyB = new Date(b.nextRunAt);
			// Compare the 2 dates
			if (keyA < keyB) {
				return 1;
			}
			if (keyA > keyB) {
				return -1;
			}
			return 0;
		});

		return x;
	}

}
