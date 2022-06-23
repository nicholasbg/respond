export default (() => {
  const WIDTH = "width";
  const HEIGHT = "height";

  /**
   * @param {HTMLElement} elem
   * @param {{dimension?:"width"|"height",breakpoints?:Array<number>,namespace?:String}} options
   * @return {HTMLElement}
   */
  const respond = (...params) =>
    setClassNames(params[0], ...respond.getClassNames(...params));

  /**
   * @param {HTMLElement} elem
   * @param {Iterable<number>} breakpoints
   * @param {{dimension?:"width"|"height",namespace?:String}} options
   * @return {[Set<string>, Set<string>]}
   */
  respond.getClassNames = (
    elem,
    breakpoints,
    { namespace, dimension = WIDTH } = {}
  ) => {
    /**
     * @type {Number}
     */
    const length = getElementInnerSpace[dimension](elem),
      /**
       * @type {Set<string>}
       */
      add = new Set(),
      /**
       * @type {Set<string>}
       */
      remove = new Set();
    namespace = (!namespace ? dimension : namespace + "-" + dimension) + "-";
    for (const breakpoint of breakpoints) {
      (length < breakpoint ? remove : add).add(namespace + breakpoint);
    }

    return [add, remove];
  };

  /**
   * @param {HTMLElement} elem
   * @param {Iterable<string>} add
   * @param {Iterable<string>} remove
   *
   * @return {HTMLElement}
   */
  const setClassNames = (elem, add, remove) => {
    const classNames = new Set([...elem.classList, ...add]);
    for (const className of remove) {
      classNames.delete(className);
    }
    elem.className = Array.from(classNames).join(" ");

    return elem;
  };

  /**
   * @param {HTMLElement} elem
   * @return {{width:Number,height:Number}}
   */
  const getElementInnerSpace = (elem) => {
    const computedStyle = getComputedStyle(elem),
      sides = ["Top", "Right", "Bottom", "Left"],
      boundingClientRect = elem.getBoundingClientRect(),
      extraLengths = [boundingClientRect[HEIGHT], boundingClientRect[WIDTH]];

    for (const side of sides) {
      const indexModulus = sides.indexOf(side) % 2;
      for (const property of ["padding" + side, `border${side}Width`]) {
        extraLengths[indexModulus] -= parseFloat(computedStyle[property]);
      }
    }

    return { [HEIGHT]: extraLengths[0], [WIDTH]: extraLengths[1] };
  };

  /**
   * @param {HTMLElement} elem
   * @return {Number}
   */
  getElementInnerSpace[WIDTH] = (elem) => getElementInnerSpace(elem)[WIDTH];

  /**
   * @param {HTMLElement} elem
   * @return {Number}
   */
  getElementInnerSpace[HEIGHT] = (elem) => getElementInnerSpace(elem)[HEIGHT];

  return respond;
})();
