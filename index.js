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

  const getElementInnerSpace = (() => {
    /**
     * @type {CSSStyleDeclaration|undefined}

    /**
     * @type {Array<CSSStyleDeclaration?,Number?,"width"|"height">}
     */
    let cache = [];

    /**
     * @param {HTMLElement} elem
     * @return {{width:Number,height:Number}}
     */
    const getElementInnerSpace = (elem) => {
      let extraLength = 0;
      const [
          computedStyle = (
            elem.ownerDocument.defaultView || window
          ).getComputedStyle(elem),
          cachedWidth,
          dimension,
        ] = cache,
        isWidth = dimension === WIDTH;

      for (const side of isWidth ? ["right", "left"] : ["top", "bottom"]) {
        for (const property of ["padding-" + side, `border-${side}-width`]) {
          extraLength += parseFloat(computedStyle.getPropertyValue(property));
        }
      }

      let width = NaN,
        height = width,
        dimensionKey = dimension,
        /**
         * @type {DOMRect}
         */
        boundingClientRect;

      const getBoundingClientRect = () => {
        if (!boundingClientRect) {
          boundingClientRect = elem.getBoundingClientRect();
        }
        return boundingClientRect;
      };

      /**
       * @param {"width"|"height"} dimension
       */
      const getLength = (dimension) =>
        dimension === WIDTH && cachedWidth != null
          ? cachedWidth
          : getBoundingClientRect()[dimension];

      if (!dimensionKey) {
        dimensionKey = HEIGHT;
        cachedComputedStyle = computedStyle;
        cachedWidth = getLength(WIDTH);
        width = getElementInnerSpace[WIDTH](elem);
      }

      const val = getLength(dimensionKey) - extraLength;

      if (isWidth) {
        width = val;
      } else {
        height = val;
      }

      cache = [];

      return { [WIDTH]: width, [HEIGHT]: height };
    };

    /**
     * @param {HTMLElement} elem
     * @return {Number}
     */
    getElementInnerSpace[WIDTH] = (elem) =>
      (cache[2] = WIDTH) && getElementInnerSpace(elem)[WIDTH];

    /**
     * @param {HTMLElement} elem
     * @return {Number}
     */
    getElementInnerSpace[HEIGHT] = (elem) =>
      (cache[2] = HEIGHT) && getElementInnerSpace(elem)[HEIGHT];

    return getElementInnerSpace;
  })();

  return respond;
})();
