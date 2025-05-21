export interface Person {
	id?: number;
	name?: string;
	firstName?: string;
	lastName?: string;
	email: string;
	phone?: string;
	address?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PersonResponse {
	content: Person[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

export class PersonCreate implements Omit<Person, 'id' | 'createdAt' | 'updatedAt'> {
	firstName: string = '';
	lastName: string = '';
	email: string = '';
	phone: string = '';
	address: string = '';
}
