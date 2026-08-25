/**
 * FLAMES ENGINE
 * Pure deterministic logic. Zero UI side-effects.
 * Emits structured events consumed by the UI layer.
 */
const FlamesEngine = (() => {

  /** Normalize: lowercase + strip spaces */
  function normalize(name) {
    return name.toLowerCase().replace(/\s+/g, '');
  }

  /**
   * Find and record all one-to-one matches between two character arrays.
   * Returns list of match events: { i1, i2, char }
   */
  function findMatches(arr1, arr2) {
    const a = arr1.map((c, i) => ({ c, i, matched: false }));
    const b = arr2.map((c, i) => ({ c, i, matched: false }));
    const events = [];

    for (let i = 0; i < a.length; i++) {
      if (a[i].matched) continue;
      for (let j = 0; j < b.length; j++) {
        if (b[j].matched) continue;
        if (a[i].c === b[j].c) {
          a[i].matched = true;
          b[j].matched = true;
          events.push({ type: 'MATCH_FOUND', i1: i, i2: j, char: a[i].c });
          break;
        }
      }
    }

    const rem1 = a.filter(x => !x.matched).map(x => x.c);
    const rem2 = b.filter(x => !x.matched).map(x => x.c);
    return { matchEvents: events, remaining: rem1.concat(rem2), rem1, rem2 };
  }

  /**
   * FLAMES circular elimination.
   * Returns list of elimination events + final result.
   */
  function eliminate(count) {
    if (count === 0) {
      return { elimEvents: [], final: 'F' };
    }

    const letters = ['F', 'L', 'A', 'M', 'E', 'S'];
    let arr = [...letters];
    let idx = 0;
    const elimEvents = [];
    let countStep = 0;

    while (arr.length > 1) {
      // Record counting steps
      const countSteps = [];
      for (let step = 0; step < count; step++) {
        const pos = (idx + step) % arr.length;
        countSteps.push({ pos, letter: arr[pos] });
      }
      idx = (idx + count - 1) % arr.length;
      const eliminated = arr[idx];
      elimEvents.push({
        type: 'LETTER_ELIMINATED',
        letter: eliminated,
        countSteps,
        remaining: arr.length - 1
      });
      arr.splice(idx, 1);
      if (idx >= arr.length) idx = 0;
    }

    return { elimEvents, final: arr[0] };
  }

  /**
   * Full calculation — returns structured event log.
   */
  function calculate(rawName1, rawName2) {
    const clean1 = normalize(rawName1);
    const clean2 = normalize(rawName2);

    const { matchEvents, remaining, rem1, rem2 } = findMatches(
      clean1.split(''), clean2.split('')
    );

    const remainCount = remaining.length;
    const { elimEvents, final } = eliminate(remainCount);

    return {
      events: [
        { type: 'NAME_NORMALIZED', raw1: rawName1, raw2: rawName2, clean1, clean2 },
        ...matchEvents,
        { type: 'COUNT_CALCULATED', count: remainCount, rem1, rem2 },
        { type: 'FLAMES_STARTED', count: remainCount },
        ...elimEvents,
        { type: 'FINAL_RESULT', letter: final }
      ],
      // Convenience fields
      clean1, clean2,
      matchEvents,
      remainCount,
      rem1, rem2,
      elimEvents,
      final
    };
  }

  return { calculate, normalize };
})();
