import { SmartSet } from '../dist';

interface Data {
	s: string;
	n?: number;
}

describe('SmartSet tests', () => {
	let set: SmartSet<Data, string>;
	let setWithItems: SmartSet<Data, string>;

	beforeEach(() => {
		set = new SmartSet(i => i.s, []);
		setWithItems = new SmartSet(i => i.s, [ { s: '1' }, { s: '2' } ]);
	});

	describe('creation', () => {
		it('should be instance of Set', () => {
			expect(set instanceof Set).toBe(true);
		});

		it('should create empty set', () => {
			expect(set.size).toBe(0);
			expect([ ...set ]).toEqual([]);
		});

		it('should create empty set from null data', () => {
			set = new SmartSet(i => i.s, null);
			expect(set.size).toBe(0);
			expect([ ...set ]).toEqual([]);
		});
	});

	describe('containment', () => {
		it('should contain item with id constructor', () => {
			expect(setWithItems.has({ s: '1' })).toBe(true);
		});

		it('should contain item key with id constructor', () => {
			expect(setWithItems.hasId('1')).toBe(true);
		});

		it('should not contain item with invalid key with id constructor', () => {
			expect(setWithItems.hasId('3')).toBe(false);
		});

		it('should get item by id with id constructor', () => {
			expect(setWithItems.getById('1')).not.toBe(null);
		});

		it('should not get item with invalid id with id constructor', () => {
			expect(setWithItems.getById('3')).toBe(null);
		});
	});

	describe('addition', () => {
		it('should add non-existent item with id constructor', () => {
			setWithItems.add({ s: '3' });
			expect(setWithItems.size).toBe(3);
		});

		it('should add existent item with id constructor', () => {
			setWithItems.add({ s: '1' });
			expect(setWithItems.size).toBe(2);
		});

		it('should add all items uniquely to empty set with id constructor', () => {
			set.addAll([ { s: '1' }, { s: '3' }, { s: '4' }, { s: '4' } ]);
			expect(set.size).toBe(3);
		});

		it('should add all items uniquely with id constructor', () => {
			setWithItems.addAll([ { s: '1' }, { s: '3' }, { s: '4' }, { s: '4' } ]);
			expect(setWithItems.size).toBe(4);
		});

		it('should not overwrite existing key', () => {
			setWithItems.add({ s: '3', n: 1 });
			expect(setWithItems.getById('3').n).toBe(1);
			setWithItems.add({ s: '3', n: 2 });
			expect(setWithItems.getById('3').n).toBe(1);
		});
	});

	describe('deletion', () => {
		it('should not delete non-existent item constructor', () => {
			setWithItems.delete({ s: '3' });
			expect(setWithItems.size).toBe(2);
		});

		it('should delete existent item constructor', () => {
			setWithItems.delete({ s: '1' });
			expect(setWithItems.size).toBe(1);
		});

		it('should not delete non-existent item with id constructor', () => {
			setWithItems.deleteId('3');
			expect(setWithItems.size).toBe(2);
		});

		it('should delete existent item with id constructor', () => {
			setWithItems.deleteId('1');
			expect(setWithItems.size).toBe(1);
		});

		it('should clear with id constructor', () => {
			setWithItems.clear();
			expect(setWithItems.size).toBe(0);
		});
	});

	describe('iteration', () => {
		it('should iterate keys', () => {
			expect([ ...setWithItems.keys() ]).toEqual([ '1', '2' ]);
		});

		it('should iterate values', () => {
			expect([ ...setWithItems.values() ]).toEqual([ { s: '1' }, { s: '2' } ]);
		});

		it('should iterate entries', () => {
			expect([ ...setWithItems.entries() ]).toEqual([ [ '1', { s: '1' } ], [ '2', { s: '2' } ] ]);
		});

		it('should iterate with forEach', () => {
			const result = [];
			setWithItems.forEach((value, key, thisSet) => {
				result.push([ key, value ]);
				expect(thisSet).toBe(setWithItems);
			});
			expect(result).toEqual([ [ '1', { s: '1' } ], [ '2', { s: '2' } ] ]);
		});

		it('should iterate with forEach inside other set', () => {
			const result = [];
			set.add({ s: '1' });
			setWithItems.forEach((value, key, thisSet) => {
				result.push([ key, value ]);
				expect(thisSet).toBe(set);
			}, set);
			expect(result).toEqual([ [ '1', { s: '1' } ] ]);
		});

		it('should iterate with iterator', () => {
			expect(
				[
					...new SmartSet(i => i.s, [
							{ s: '1', n: 1 }, { s: '2', n: 2 }, { s: '2', n: -2 }, { s: '3', n: 3 },
						],
					),
				])
				.toEqual([ { s: '1', n: 1 }, { s: '2', n: 2 }, { s: '3', n: 3 } ]);
		});

		it('should iterate with iterator and reference', () => {
			const data1 = { s: '1', n: 1 };
			const data2 = { s: '2', n: 2 };
			expect([ ...new SmartSet(i => i.s, [ data1, data2 ]) ]).toStrictEqual([ data1, data2 ]);
		});
	});

	it('should have a toString tag', () => {
		expect(set[Symbol.toStringTag]).toBe('SmartSet');
	});

	it('should have a toString', () => {
		expect(set.toString()).toBe('[object SmartSet]');
	});
});
