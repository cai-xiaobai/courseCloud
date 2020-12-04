/** typeOf */
export function typeOf (target) {
  return /^\[object (\w+)]$/.exec(Object.prototype.toString.apply(target))[1].toLocaleLowerCase()
}

/**
 * 过滤表单树没有变更的值
 * @param { object } form 表单树
 * @param vo 比对的 vo
 */
export function formChange(form , vo = { }) {
  return Object.keys(form).reduce((r , k) => {
    const p = form[k] , v = vo[k]
    if (!equal(p , v)) {
      r[k] = p
    }
    return r
  } , { })
}

/**
 * 俩个值不相等
 * @param v1
 * @param v2
 */
export function equal(v1 , v2) {
  switch (typeOf(v1)) {
    case 'undefined' :
    case 'boolean'  :
    case 'number'  :
    case 'string' :
    case 'null'   : return v1 === v2
    case 'object' : return 'object' === typeOf(v2) && empty(formChange(v1 , v2))
    case 'array'  : return 'array' === typeOf(v2) && v1.length === v2.length && empty(formChange(v1 , v2))
    default : return false
  }
}



/** empty or all empty */
export function empty(cat) {
  if (arguments.length > 1) {
    // 多个值的时候判断都为空
    return [...arguments].every(v => empty(v))
  } else {
    switch (typeOf(cat)) {
      case 'array'  :
      case 'string' :
      case 'object' : return Object.keys(cat).length === 0
      default : return cat == null
    }
  }
}