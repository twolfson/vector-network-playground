// Based on: https://github.com/stephomi/sculptgl/blob/75bc19bfb666032c9c46010688a802502fc48fd9/src/mesh/dynamic/MeshDynamic.js#L190-L227
exports.resizeArray: function (original, targetLength) {
  // If our orginal is the same length as the target, then return the original
  if (original.length === targetLength) {
    return original;
  }

  // Otherwise, release subsection of original
  if (original.length > targetLength) {
    // DEV: If we grab *2 of the original and it exceeds the length, then it stops at the length as-is
    //   but we like `Math.min` as extra protection
    return original.subarray(0, Math.min(original.length, targetLength * 2));
  }

  // Otherwise, create new array to use
  // DEV: We allocate 2x size to prevent resizing too often
  //   However, as a result we must use `verticesCount` instead of the array length always
  let tmp = new original.constructor(targetLength * 2);
  tmp.set(original);
  return tmp;
};
