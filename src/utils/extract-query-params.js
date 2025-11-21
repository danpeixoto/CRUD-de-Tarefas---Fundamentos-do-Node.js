export function extractQueryParams(queryString) {
  if (!queryString) return {};
  console.debug('queryString', queryString);
  return queryString
    .substr(1)
    .split('&')
    .reduce((queryParamas, param) => {
      const [key, value] = param.split('=');
      queryParamas[key] = value;
      return queryParamas;
    }, {});
}
