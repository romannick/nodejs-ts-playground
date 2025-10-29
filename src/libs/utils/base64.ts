export const encodeBase64 = (input: string): string => {
  return Buffer.from(input, 'utf-8').toString('base64');
};

export const decodeBase64 = (base64: string): string => {
  return Buffer.from(base64, 'base64').toString('utf-8');
};