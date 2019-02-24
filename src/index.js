class Range {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
}

/**
 * RangeCollection class
 */
export default class RangeCollection {
  constructor() {
    this.ranges = [];
  }

  /**
   * Merges two mergable ranges and outputs a new range.
   * @param {Range} range1 - First range to merge.
   * @param {Range} range2 - Second range to merge.
   * @returns {Range} Merged range of range1 and range2
   */
  _merge(range1, range2) {
    return new Range(
      Math.min(range1.left, range2.left),
      Math.max(range1.right, range2.right)
    );
  }

  /**
   * Check if second range is ahead of first range
   * @param {Range} range1 First range
   * @param {Range} range2 Second range
   * @returns {Boolean} true if range2 is ahead of range1
   */
  _isAheadOf(range1, range2) {
    return range2.left > range1.right;
  }

  _findIndexForRangeGreaterThan(range) {
    const rangesL = this.ranges.length;
    let lesserIndex = 0;
    for (; lesserIndex < rangesL; lesserIndex += 1) {
      const currentRange = this.ranges[lesserIndex];
      // Continue for ranges smaller than input range
      if (this._isAheadOf(currentRange, range)) {
        continue;
      } else {
        break;
      }
    }

    return lesserIndex;
  }

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    const rangesL = this.ranges.length;
    let middleRange = new Range(range[0], range[1]);

    // Base conditions
    if (rangesL === 0) {
      this.ranges.push(middleRange);
      return;
    }
    if (this._isAheadOf(this.ranges[rangesL - 1], middleRange)) {
      this.ranges.push(middleRange);
      return;
    }
    if (this._isAheadOf(middleRange, this.ranges[0])) {
      this.ranges.unshift(middleRange);
      return;
    }

    let lesserIndex = this._findIndexForRangeGreaterThan(middleRange);
    let ind = lesserIndex;
    for (; ind < rangesL; ind += 1) {
      const currentRange = this.ranges[ind];
      // No need to look ahead as next ranges are greater
      // than mergedRange
      if (this._isAheadOf(middleRange, currentRange)) {
        break;
      }

      // Merge overlapping ranges
      middleRange = this._merge(middleRange, currentRange);
    }

    const lesserRanges = this.ranges.slice(0, lesserIndex);
    const greaterRanges = this.ranges.slice(ind);
    this.ranges = [...lesserRanges, middleRange, ...greaterRanges];
  }

  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    const rangesL = this.ranges.length;
    const removeRange = new Range(range[0], range[1]);

    // Skip if no ranges or range outside current ranges
    if (
      rangesL === 0 ||
      this._isAheadOf(this.ranges[rangesL - 1], removeRange) ||
      this._isAheadOf(removeRange, this.ranges[0])
    ) {
      return;
    }

    let lesserIndex = this._findIndexForRangeGreaterThan(removeRange);
    let ind = lesserIndex;
    const middleRanges = [];
    for (; ind < rangesL; ind += 1) {
      const currentRange = this.ranges[ind];
      // No need to look ahead as next ranges are greater
      // than mergedRange
      if (this._isAheadOf(removeRange, currentRange)) {
        break;
      }

      // Create new range for left and right as required
      if (currentRange.left < removeRange.left) {
        middleRanges.push(new Range(currentRange.left, removeRange.left));
      }
      if (removeRange.right < currentRange.right) {
        middleRanges.push(new Range(removeRange.right, currentRange.right));
      }
    }

    const lesserRanges = this.ranges.slice(0, lesserIndex);
    const greaterRanges = this.ranges.slice(ind);
    this.ranges = [...lesserRanges, ...middleRanges, ...greaterRanges];
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    return this.ranges.map(r => `[${r.left}, ${r.right})`).join(' ');
  }

  /**
   * Prints current ranges to console
   */
  log() {
    console.log(this.print());
  }
}
