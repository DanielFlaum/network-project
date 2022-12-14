// Adapted from https://github.com/anvaka/ngraph.random/blob/main/index.js

/**
 * Creates seeded PRNG with two methods:
 *   next() and nextDouble()
 */
function random(inputSeed?: number) {
  var seed = typeof inputSeed === 'number' ? inputSeed : (+new Date());
  return new Generator(seed)
}

class Generator {

    seed: number;



    /**
     * Generates random integer number in the range from 0 (inclusive) to maxValue (exclusive)
     *
     * @param maxValue Number REQUIRED. Omitting this number will result in NaN values from PRNG.
     */
    next(maxValue: number) {
        return Math.floor(this.nextDouble() * maxValue);
    }

    /**
     * Generates random double number in the range from 0 (inclusive) to 1 (exclusive)
     * This function is the same as Math.random() (except that it could be seeded)
     */
    nextDouble() {
        var seed = this.seed;
        // Robert Jenkins' 32 bit integer hash function.
        seed = ((seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
        seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
        seed = ((seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
        seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
        seed = ((seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
        seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
        this.seed = seed;
        return (seed & 0xfffffff) / 0x10000000;
    }

    /**
     * Returns a random real number from uniform distribution in [0, 1)
     */
    uniform = this.nextDouble;

    /**
     * Returns a random real number from a Gaussian distribution
     * with 0 as a mean, and 1 as standard deviation u ~ N(0,1)
     */
    gaussian() {
        // use the polar form of the Box-Muller transform
        // based on https://introcs.cs.princeton.edu/java/23recursion/StdRandom.java
        var r, x, y;
        do {
            x = this.nextDouble() * 2 - 1;
            y = this.nextDouble() * 2 - 1;
            r = x * x + y * y;
        } while (r >= 1 || r === 0);

        return x * Math.sqrt(-2 * Math.log(r)/r);
    }

    /**
     * See https://twitter.com/anvaka/status/1296182534150135808
     */
    levy() {
        var beta = 3 / 2;
        var sigma = Math.pow(
            gamma( 1 + beta ) * Math.sin(Math.PI * beta / 2) /
                (gamma((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)),
            1/beta
        );
        return this.gaussian() * sigma / Math.pow(Math.abs(this.gaussian()), 1/beta);
    }



    constructor(seed: number) {
        this.seed = seed;
    };

};

// gamma function approximation
function gamma(z: number) {
  return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
}


/*
 * Creates iterator over array, which returns items of array in random order
 * Time complexity is guaranteed to be O(n);
 */
export function randomIterator(array: any[], customRandom: Generator) {
  var localRandom = customRandom || random();
  if (typeof localRandom.next !== 'function') {
    throw new Error('customRandom does not match expected API: next() function is missing');
  }

  return {
    /**
     * Visits every single element of a collection once, in a random order.
     * Note: collection is modified in place.
     */
    forEach: forEach,

    /**
     * Shuffles array randomly, in place.
     */
    shuffle: shuffle
  };

  function shuffle() {
    var i, j, t;
    for (i = array.length - 1; i > 0; --i) {
      j = localRandom.next(i + 1); // i inclusive
      t = array[j];
      array[j] = array[i];
      array[i] = t;
    }

    return array;
  }

  function forEach(callback: (a: any) => void) {
    var i, j, t;
    for (i = array.length - 1; i > 0; --i) {
      j = localRandom.next(i + 1); // i inclusive
      t = array[j];
      array[j] = array[i];
      array[i] = t;

      callback(t);
    }

    if (array.length) {
      callback(array[0]);
    }
  }
}



export default random;
