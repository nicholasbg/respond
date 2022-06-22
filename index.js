/**
 * @param {HTMLElement} elem
 * @param {{dimension?:"width"|"height",breakpoints?:Array<number>,namespace?:String}} options
 * @return {HTMLElement}
 */
export default function respond(
  elem,
  { namespace, breakpoints = [], dimension = "width" } = {}
) {
  const measure = getAvailableSpace(elem, { dimension })[dimension] || 0,
    add = [],
    remove = [];
  namespace = [namespace, dimension].filter((value) => value).join("-") + "-";
  for (const breakpoint of breakpoints) {
    (measure < breakpoint ? remove : add).push(namespace + breakpoint);
  }
  return setClassNames(elem, { add, remove });
}
/**
 * @param {HTMLElement} elem
 * @param {Array<string>} add
 * @param {Array<string>} remove
 * @return {HTMLElement}
 */
const setClassNames = (elem, add, remove) => {
  const classNames = new Set(...elem.classList, ...add);
  for (const className of remove) {
    classNames.delete(className);
  }
  elem.className = Array.from(classNames).join(" ");

  return elem;
};

/**
 * @param {HTMLElement} elem
 * @param {{dimension?:"width"|"height",computedStyle?:CSSStyleDeclaration,boundingClientRect?:DOMRect}} options
 * @return {{width:Number|undefined,height:Number|undefined}}
 */
const getAvailableSpace = (
  elem,
  {
    dimension,
    computedStyle = (elem.ownerDocument.defaultView || window).getComputedStyle(
      elem
    ),
    boundingClientRect = elem.getBoundingClientRect(),
  } = {}
) => {
  let extraSpace = 0;
  const isWidth = dimension === "width";
  for (const extraSpaceIndex of [...Array(4).keys()]) {
    const side = (isWidth ? ["right", "left"] : ["top", "bottom"])[
      extraSpaceIndex % 2
    ];
    extraSpace +=
      parseFloat(
        computedStyle.getPropertyValue(
          [`padding-${side}`, `border-${side}-width`][
            extraSpaceIndex > 1 ? 0 : 1
          ]
        )
      ) || 0;
  }
  let width,
    height,
    dimensionKey = dimension;

  if (!dimensionKey) {
    dimensionKey = "height";
    width = getAvailableSpace(elem, {
      dimension: "width",
      computedStyle,
      boundingClientRect,
    }).width;
  }

  const val = boundingClientRect[dimensionKey] - extraSpace;

  if (isWidth) {
    width = val;
  } else {
    height = val;
  }
  return { width, height };
};
