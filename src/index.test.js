import RangeCollection from './';

describe('Range Collection', () => {
  let rc = null;
  beforeEach(() => {
    rc = new RangeCollection();
  });

  describe('add', () => {
    test('should add single range', () => {
      rc.add([1, 5]);
      expect(rc.print()).toEqual('[1, 5)');
    });

    test('should merge overlapping ranges', () => {
      rc.add([1, 5]);
      expect(rc.print()).toEqual('[1, 5)');

      rc.add([10, 20]);
      expect(rc.print()).toEqual('[1, 5) [10, 20)');

      rc.add([7, 15]);
      expect(rc.print()).toEqual('[1, 5) [7, 20)');
    });

    test('covert merged ranges into single range', () => {
      rc.add([1, 5]);
      expect(rc.print()).toEqual('[1, 5)');

      rc.add([10, 20]);
      expect(rc.print()).toEqual('[1, 5) [10, 20)');

      rc.add([0, 20]);
      expect(rc.print()).toEqual('[0, 20)');
    });
  });

  describe('remove', () => {
    test('should remove nothing from empty', () => {
      rc.remove([1, 5]);
      expect(rc.print()).toEqual('');
    });

    test('should remove nothing when on either side of available ranges', () => {
      rc.add([1, 5]);
      expect(rc.print()).toEqual('[1, 5)');

      rc.remove([-1, 0]);
      expect(rc.print()).toEqual('[1, 5)');

      rc.remove([6, 10]);
      expect(rc.print()).toEqual('[1, 5)');
    });

    test('should remove from middle', () => {
      rc.add([1, 5]);
      expect(rc.print()).toEqual('[1, 5)');

      rc.add([10, 20]);
      expect(rc.print()).toEqual('[1, 5) [10, 20)');

      rc.remove([10, 15]);
      expect(rc.print()).toEqual('[1, 5) [15, 20)');
    });

    test('should add and remove extra ranges when overlapping ranges are removed', () => {
      rc.add([1, 5]);
      expect(rc.print()).toEqual('[1, 5)');

      rc.add([10, 20]);
      expect(rc.print()).toEqual('[1, 5) [10, 20)');

      rc.remove([12, 15]);
      expect(rc.print()).toEqual('[1, 5) [10, 12) [15, 20)');

      rc.remove([17, 25]);
      expect(rc.print()).toEqual('[1, 5) [10, 12) [15, 17)');

      rc.remove([6, 11]);
      expect(rc.print()).toEqual('[1, 5) [11, 12) [15, 17)');

      rc.remove([0, 25]);
      expect(rc.print()).toEqual('');
    });
  });

  test('all operations', () => {
    rc.add([1, 5]);
    expect(rc.print()).toEqual('[1, 5)');

    rc.add([10, 20]);
    expect(rc.print()).toEqual('[1, 5) [10, 20)');

    rc.add([20, 20]);
    expect(rc.print()).toEqual('[1, 5) [10, 20)');

    rc.add([20, 21]);
    expect(rc.print()).toEqual('[1, 5) [10, 21)');

    rc.add([2, 4]);
    expect(rc.print()).toEqual('[1, 5) [10, 21)');

    rc.add([3, 8]);
    expect(rc.print()).toEqual('[1, 8) [10, 21)');

    rc.remove([10, 10]);
    expect(rc.print()).toEqual('[1, 8) [10, 21)');

    rc.remove([10, 11]);
    expect(rc.print()).toEqual('[1, 8) [11, 21)');

    rc.remove([15, 17]);
    expect(rc.print()).toEqual('[1, 8) [11, 15) [17, 21)');

    rc.remove([3, 19]);
    expect(rc.print()).toEqual('[1, 3) [19, 21)');
  });
});
