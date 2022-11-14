export default (() => {
  const WIDTH = "width";
  const HEIGHT = "height";

  /**
   * @param {HTMLElement} elem
   * @param {{dimension?:"width"|"height",breakpoints?:Array<number>,namespace?:String}} options
   * @return {HTMLElement}
   */
  const respond = (...params) =>
    setClassNames(params[0], ...getClassNames(...params));

  /**
   * @param {HTMLElement} elem
   * @param {Iterable<number>} breakpoints
   * @param {{dimension?:"width"|"height",namespace?:String}} options
   * @return {[Set<string>, Set<string>]}
   */
  const getClassNames = (
    elem,
    breakpoints,
    { namespace = "", dimension = WIDTH } = {}
  ) => {
    /**
     * @type {Number}
     */
    const innerSpace = getElementInnerSpace(elem)[dimension],
      /**
       * @type {Set<string>}
       */
      add = new Set(),
      /**
       * @type {Set<string>}
       */
      remove = new Set();

    namespace += dimension + "-";
    for (const breakpoint of breakpoints) {
      (innerSpace < breakpoint ? remove : add).add(namespace + breakpoint);
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
      extraSpace = [computedStyle[HEIGHT], computedStyle[WIDTH]];
    if (computedStyle.boxSizing === "border-box") {
      ["Top", "Right", "Bottom", "Left"].forEach((side, index) =>
        ["padding" + side, `border${side}Width`].forEach(
          (property) =>
            (extraSpace[index % 2] -= parseFloat(computedStyle[property]))
        )
      );
    }

    return { [HEIGHT]: extraSpace[0], [WIDTH]: extraSpace[1] };
  };

  return respond;
})();
