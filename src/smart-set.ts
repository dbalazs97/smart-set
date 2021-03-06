export class SmartSet<T, ID extends keyof never> extends Set {
	private innerMap: Record<ID, T> = {} as Record<ID, T>;

	constructor(private idFunction: (item: T) => ID, values?: readonly T[] | null) {
		super();
		this.addAll(values ?? []);
	}

	public get size(): number {
		return Object.keys(this.innerMap).length;
	}

	public add(value: T): this {
		if (!this.has(value)) {
			this.innerMap[this.idFunction(value)] = value;
		}
		return this;
	}

	public addAll(values: readonly T[]): this {
		values.forEach(value => this.add(value));
		return this;
	}

	public delete(value: T): boolean {
		return delete this.innerMap[this.idFunction(value)];
	}

	public deleteId(id: ID): boolean {
		return delete this.innerMap[id];
	}

	public get [Symbol.toStringTag](): string {
		return 'SmartSet';
	}

	public has(value: T): boolean {
		return Object.prototype.hasOwnProperty.call(this.innerMap, this.idFunction(value));
	}

	public getById(id: ID): T | null {
		return this.innerMap[id] ?? null;
	}

	public hasId(id: ID): boolean {
		return Object.prototype.hasOwnProperty.call(this.innerMap, id);
	}

	public [Symbol.iterator](): IterableIterator<T> {
		return this.values();
	}

	public forEach(callbackfn: (value: T, key: T, set: Set<T>) => void, thisArg: any = this): void {
		for (const [ key, value ] of thisArg.entries()) {
			callbackfn(value, key, thisArg);
		}
	}

	public entries(): IterableIterator<[ any, T ]> {
		return Object.keys(this.innerMap).map(key => ([ key, this.innerMap[key] ])).values() as IterableIterator<[ T, T ]>;
	}

	public keys(): IterableIterator<any> {
		return Object.keys(this.innerMap).values() as IterableIterator<ID>;
	}

	public values(): IterableIterator<T> {
		return Object.keys(this.innerMap).map(key => this.innerMap[key]).values() as IterableIterator<T>;
	}

	public clear(): void {
		this.innerMap = {} as Record<ID, T>;
	}

	public union(other: Set<T>): SmartSet<T, ID> {
		return new SmartSet<T, ID>(this.idFunction, [ ...this.values(), ...other ]);
	}

	public intersection(other: Set<T>): SmartSet<T, ID> {
		const returnValue = new SmartSet<T, ID>(this.idFunction);
		for (const thisValue of this.values()) {
			for (const otherValue of other.values()) {
				if (this.idFunction(thisValue) === this.idFunction(otherValue)) {
					returnValue.add(thisValue);
				}
			}
		}
		return returnValue;
	}

	public difference(other: Set<T>): SmartSet<T, ID> {
		const union = this.union(other);
		for (const otherValue of other.values()) {
			union.delete(otherValue);
		}
		return union;
	}

	public symmetricDifference(other: Set<T>): SmartSet<T, ID> {
		const union = this.union(other);
		const intersection = this.intersection(other);
		return union.difference(intersection);
	}
}
