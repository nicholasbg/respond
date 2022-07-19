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

  const getElementInnerSpace = ((_undefined) => {
    /**
     * @type {CSSStyleDeclaration|undefined}
     */
    let cachedComputedStyle,
      /**
       * @type {Number|undefined}
       */
      cachedWidth,
      /**
       * @type {"width"|"height"|undefined}
       */
      dimension;

    /**
     * @param {HTMLElement} elem
     * @return {{width:Number,height:Number}}
     */
    const getElementInnerSpace = (elem) => {
      let extraLength = 0;
      const isWidth = dimension === WIDTH;
      const computedStyle =
        cachedComputedStyle ||
        (elem.ownerDocument.defaultView || window).getComputedStyle(elem);

      if (computedStyle.boxSizing !== "border-box") {
        for (const extraLengthIndex of [0, 1, 2, 3]) {
          const side = (isWidth ? ["right", "left"] : ["top", "bottom"])[
            extraLengthIndex % 2
          ];
          extraLength += parseFloat(
            computedStyle.getPropertyValue(
              [`padding-${side}`, `border-${side}-width`][
                extraLengthIndex > 1 ? 0 : 1
              ]
            )
          );
        }
      }

      let width = NaN,
        height = width,
        dimensionKey = dimension;

      /**
       * @param {"width"|"height"} dimension
       */
      const getLength = (dimension) =>
        dimension === WIDTH && cachedWidth != null
          ? cachedWidth
          : parseFloat(computedStyle[dimension]);

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

      cachedComputedStyle = _undefined;
      cachedWidth = _undefined;
      dimension = _undefined;

      return { [WIDTH]: width, [HEIGHT]: height };
    };

    /**
     * @param {HTMLElement} elem
     * @return {Number}
     */
    getElementInnerSpace.width = (elem) =>
      (dimension = WIDTH) && getElementInnerSpace(elem)[WIDTH];

    /**
     * @param {HTMLElement} elem
     * @return {Number}
     */
    getElementInnerSpace.height = (elem) =>
      (dimension = HEIGHT) && getElementInnerSpace(elem)[HEIGHT];

    return getElementInnerSpace;
  })();

  return respond;
})();
