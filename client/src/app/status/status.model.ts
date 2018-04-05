export interface Status {
	time: number;
	entities: Entity[];
}

interface Entity {
	type: string;
	status: string;
}
