/**
 * @file 拼接字符串得到代码
 * @author wuya
 */

const nativeMethods = ['onClick', 'onChange', 'onInput'];
const IGNORE_ITEMS = ['children'];

/**
 * 得到属性文本，如 { key: 0, type: 'primary' } 则会返回 'key={0} type="primary"'
 * @param {Object} props - 组件属性
 * @return {string}
 */
function createPropsText(props) {
  const propsText = [];
  const propsMap = {};

  const keys = Object.keys(props);
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const key = keys[i];
    // 忽略
    if (IGNORE_ITEMS.indexOf(key) > -1) {
      continue;
    }
    // 只处理简单类型，string、boolean、function
    const val = props[key];
    if (val) {
      if (typeof val === 'string') {
        propsText.push(`${key}="${props[key]}"`);
        propsMap[key] = `"${val}"`;
      } else if (typeof val === 'boolean') {
        propsText.push(`${key}=${props[key]}`);
        propsMap[key] = val;
      } else if (typeof val === 'function') {
        if (nativeMethods.indexOf(key) > -1) {
          propsText.push(`${key}={this.${props[key].name}}`);
        }
      } else {
        propsText.push(`${key}={${props[key]}}`);
      }
    } else {
    }
  }
  return propsText.join(' ');
}

/**
 * 
 * @param {Antd Component} Component 
 * @param {Object} props 
 */
function mergeProps(Component, props) {
  const { propTypes, defaultProps } = Component;
  return Object.assign({}, propTypes, defaultProps, props);
}

/**
 * 标签与属性生成代码
 * @param {Object} instance 
 * @param {Object} props 
 * @param {boolean} isField - 是否是表单
 */
function createCodeWithProps(instance, props, isField, fieldProps) {
  const { label: Tag, children } = instance;
  const propsText = createPropsText(props);
  let code = `<${Tag} ${propsText}>`;
  // 按钮的文本
  if (children && typeof children === 'string') {
    code += children;
  } else if (children && children.length > 0) {
    code += createSourceCode(children);
  }
  code += `</${Tag}>`;
  if (isField) {
    const { title, label, rules } = fieldProps;
    code = `<Form.Item label="${title}">
          {getFieldDecorator(${label}, {
            rules: [],
          })(
            ${code}
          )}
        </Form.Item>`;
  }
  return code;
}

/**
 * 根据实例对象拼接字符串代码
 * @param {Array} instances - 实例对象数组
 */
export default function createSourceCode(instances) {
  console.log('root', instances);
  let code = '';
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { Component, props } = instance;
    const mergedProps = mergeProps(Component, props);
    code += createCodeWithProps(instance, mergedProps, instance.isField, instance.fieldProps);
  }
  return code;
}
