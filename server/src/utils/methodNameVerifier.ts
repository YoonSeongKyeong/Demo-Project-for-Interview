export const methodNameVerifier = (name: string): boolean => {
  const methodNames: string[] = ['get', 'post', 'put', 'delete', 'patch']; // method list consists of <Express's routing method names>
  return methodNames.includes(name);
};
