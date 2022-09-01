import * as _ from 'lodash'

export default function camelize(array: Array<object>): Array<object> {
  const camelizedArray: Array<object> = []
  
  array.forEach(element => {
    const camelizedObject = _.mapKeys(element, (_v, k) => _.camelCase(k))
    camelizedArray.push(camelizedObject)
  })

  return camelizedArray
}
